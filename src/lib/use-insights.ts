"use client";

import { useEffect, useState } from "react";
import { listEventsInRange } from "@/lib/db/events";
import { startOfDay, addDays } from "@/lib/time";
import {
  computeDailyOverlaps, summarizeTrends,
  computePatternStats, predictConflict,
  type DailyOverlap, type TrendSummary, type PredictedConflict,
} from "@/lib/trends";
import type { ScheduleEvent } from "@/types/models";

const WINDOW_DAYS = 14;
const MIN_DAYS_WITH_DATA = 5;

interface InsightsState {
  loading: boolean;
  hasEnoughData: boolean;
  daily: DailyOverlap[];
  trends: TrendSummary[];
  predictions: PredictedConflict[];
}

export function useInsights(
  householdId: string | null,
  childAId: string | undefined,
  childBId: string | undefined
): InsightsState {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!householdId) { setLoading(false); return; }
      setLoading(true);
      const windowEnd = startOfDay() + 86_400_000;
      const windowStart = addDays(startOfDay(), -WINDOW_DAYS);
      const data = await listEventsInRange(householdId, windowStart, windowEnd);
      if (!cancelled) { setEvents(data); setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [householdId]);

  if (loading || !childAId || !childBId) {
    return { loading, hasEnoughData: false, daily: [], trends: [], predictions: [] };
  }

  const windowEnd = startOfDay() + 86_400_000;
  const windowStart = addDays(startOfDay(), -WINDOW_DAYS);
  const daily = computeDailyOverlaps(childAId, childBId, events, windowStart, windowEnd);
  const hasEnoughData = daily.filter(d => d.sleepMinutes > 0 || d.feedMinutes > 0).length >= MIN_DAYS_WITH_DATA;
  const trends = summarizeTrends(daily);
  const predictions: PredictedConflict[] = [];
  for (const type of ["sleep", "feed"] as const) {
    const statsA = computePatternStats(childAId, events, type);
    const statsB = computePatternStats(childBId, events, type);
    const predicted = predictConflict(statsA, statsB);
    if (predicted) predictions.push(predicted);
  }
  return { loading: false, hasEnoughData, daily, trends, predictions };
}
