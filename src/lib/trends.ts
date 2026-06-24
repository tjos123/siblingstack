// src/lib/trends.ts
//
// The shared engine behind both halves of the consolidated premium
// feature: trend reports (retrospective — "what's been happening") and
// predictions (forward-looking — "what's likely next"). Both read from
// the same rolling window of events; this file just computes two
// different views over it.
//
// Deliberately statistics-based, not ML — rolling means and standard
// deviation over a trailing window. Cheap, auditable, and honest about
// uncertainty (see "confidence" below), which matters more here than
// sophistication: a wrong prediction stated confidently is worse than
// no prediction at all.

import type { EventType, ScheduleEvent } from "@/types/models";
import { findConflicts } from "@/lib/conflicts";

const DAY_MS = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------
// Part 1: Daily overlap series — the retrospective trend data
// ---------------------------------------------------------------------

export interface DailyOverlap {
  dayStart: number;
  sleepMinutes: number;
  feedMinutes: number;
}

// Buckets conflicts into one entry per day across the window. Note: an
// event that starts before midnight and ends after it is bucketed
// entirely into its start day — a deliberate simplification for v1,
// since exact midnight-crossing accuracy matters far less here than the
// week-over-week trend direction does.
export function computeDailyOverlaps(
  childAId: string,
  childBId: string,
  events: ScheduleEvent[],
  windowStart: number,
  windowEnd: number
): DailyOverlap[] {
  const days: DailyOverlap[] = [];

  for (let day = windowStart; day < windowEnd; day += DAY_MS) {
    const dayEvents = events.filter(
      (e) => e.startTime >= day && e.startTime < day + DAY_MS
    );
    const conflicts = findConflicts(childAId, childBId, dayEvents, day + DAY_MS);

    let sleepMinutes = 0;
    let feedMinutes = 0;
    for (const c of conflicts) {
      const minutes = (c.overlapEnd - c.overlapStart) / 60000;
      if (c.type === "sleep") sleepMinutes += minutes;
      if (c.type === "feed") feedMinutes += minutes;
    }

    days.push({ dayStart: day, sleepMinutes: Math.round(sleepMinutes), feedMinutes: Math.round(feedMinutes) });
  }

  return days;
}

// ---------------------------------------------------------------------
// Part 2: Trend direction — first half of the window vs. second half
// ---------------------------------------------------------------------

export interface TrendSummary {
  type: "sleep" | "feed";
  direction: "up" | "down" | "flat";
  changePercent: number;
  averageMinutesPerDay: number;
}

function summarizeOne(
  daily: DailyOverlap[],
  key: "sleepMinutes" | "feedMinutes",
  type: "sleep" | "feed"
): TrendSummary {
  if (daily.length < 4) {
    return { type, direction: "flat", changePercent: 0, averageMinutesPerDay: 0 };
  }

  const mid = Math.floor(daily.length / 2);
  const avg = (arr: DailyOverlap[]) =>
    arr.reduce((sum, d) => sum + d[key], 0) / arr.length;

  const firstAvg = avg(daily.slice(0, mid));
  const secondAvg = avg(daily.slice(mid));
  const overallAvg = avg(daily);

  const changePercent =
    firstAvg === 0 ? 0 : ((secondAvg - firstAvg) / Math.max(firstAvg, 1)) * 100;

  // A flat 15% threshold rather than flagging every small wobble as a
  // "trend" — daily overlap is naturally noisy, and calling out every
  // fluctuation would make the feature feel jumpy rather than insightful.
  let direction: TrendSummary["direction"] = "flat";
  if (Math.abs(changePercent) > 15) {
    direction = changePercent > 0 ? "up" : "down";
  }

  return {
    type,
    direction,
    changePercent: Math.round(changePercent),
    averageMinutesPerDay: Math.round(overallAvg),
  };
}

export function summarizeTrends(daily: DailyOverlap[]): TrendSummary[] {
  return [
    summarizeOne(daily, "sleepMinutes", "sleep"),
    summarizeOne(daily, "feedMinutes", "feed"),
  ];
}

// ---------------------------------------------------------------------
// Part 3: Per-child pattern stats — the basis for predictions
// ---------------------------------------------------------------------

export interface PatternStats {
  type: EventType;
  sampleSize: number;
  meanStartMinuteOfDay: number | null;
  meanDurationMinutes: number | null;
  consistency: "high" | "medium" | "low";
}

function minuteOfDay(timestamp: number): number {
  const d = new Date(timestamp);
  return d.getHours() * 60 + d.getMinutes();
}

function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function computePatternStats(
  childId: string,
  events: ScheduleEvent[],
  type: EventType
): PatternStats {
  const matching = events.filter(
    (e) => e.childId === childId && e.type === type && e.endTime !== null
  );

  // Fewer than 3 data points isn't enough to call it a pattern — be
  // honest about that rather than extrapolating from noise.
  if (matching.length < 3) {
    return {
      type,
      sampleSize: matching.length,
      meanStartMinuteOfDay: null,
      meanDurationMinutes: null,
      consistency: "low",
    };
  }

  const startMinutes = matching.map((e) => minuteOfDay(e.startTime));
  const durations = matching.map((e) => (e.endTime! - e.startTime) / 60000);

  const meanStart = startMinutes.reduce((a, b) => a + b, 0) / startMinutes.length;
  const meanDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const startStdDev = standardDeviation(startMinutes);

  let consistency: PatternStats["consistency"] = "low";
  if (startStdDev < 30) consistency = "high";
  else if (startStdDev < 60) consistency = "medium";

  return {
    type,
    sampleSize: matching.length,
    meanStartMinuteOfDay: Math.round(meanStart),
    meanDurationMinutes: Math.round(meanDuration),
    consistency,
  };
}

// ---------------------------------------------------------------------
// Part 4: Cross-sibling predicted conflict
// ---------------------------------------------------------------------

export interface PredictedConflict {
  type: EventType;
  childAPredictedStart: number; // minute of day
  childBPredictedStart: number; // minute of day
  overlapMinutes: number;
  confidence: "high" | "medium" | "low";
}

const CONFIDENCE_RANK = { high: 3, medium: 2, low: 1 };

// Predicts whether two children's typical windows for the same event
// type are likely to overlap, based on their individual pattern stats.
// Confidence is capped at the *lower* of the two children's individual
// consistency — a confident prediction needs both kids to be
// predictable, not just one.
export function predictConflict(
  statsA: PatternStats,
  statsB: PatternStats
): PredictedConflict | null {
  if (
    statsA.type !== statsB.type ||
    statsA.meanStartMinuteOfDay === null ||
    statsB.meanStartMinuteOfDay === null ||
    statsA.meanDurationMinutes === null ||
    statsB.meanDurationMinutes === null
  ) {
    return null;
  }

  const aStart = statsA.meanStartMinuteOfDay;
  const aEnd = aStart + statsA.meanDurationMinutes;
  const bStart = statsB.meanStartMinuteOfDay;
  const bEnd = bStart + statsB.meanDurationMinutes;

  const overlapStart = Math.max(aStart, bStart);
  const overlapEnd = Math.min(aEnd, bEnd);
  const overlapMinutes = overlapEnd - overlapStart;

  if (overlapMinutes <= 0) return null;

  const confidence =
    CONFIDENCE_RANK[statsA.consistency] < CONFIDENCE_RANK[statsB.consistency]
      ? statsA.consistency
      : statsB.consistency;

  return {
    type: statsA.type,
    childAPredictedStart: aStart,
    childBPredictedStart: bStart,
    overlapMinutes: Math.round(overlapMinutes),
    confidence,
  };
}
