import { describe, it, expect } from "vitest";
import {
  computeDailyOverlaps,
  summarizeTrends,
  computePatternStats,
  predictConflict,
} from "@/lib/trends";
import type { ScheduleEvent } from "@/types/models";

const CHILD_A = "child-a";
const CHILD_B = "child-b";
const DAY_MS = 24 * 60 * 60 * 1000;

let nextId = 0;
function event(overrides: Partial<ScheduleEvent>): ScheduleEvent {
  nextId += 1;
  return {
    id: `event-${nextId}`,
    householdId: "household-1",
    childId: CHILD_A,
    type: "sleep",
    startTime: 0,
    endTime: 0,
    createdBy: "user-1",
    createdAt: 0,
    ...overrides,
  };
}

describe("computeDailyOverlaps", () => {
  it("returns one entry per day in the window, even with no events", () => {
    const result = computeDailyOverlaps(CHILD_A, CHILD_B, [], 0, DAY_MS * 3);
    expect(result).toHaveLength(3);
    expect(result.every((d) => d.sleepMinutes === 0 && d.feedMinutes === 0)).toBe(true);
  });

  it("sums overlap minutes correctly within a single day", () => {
    const events = [
      event({ childId: CHILD_A, type: "sleep", startTime: 0, endTime: 60 * 60000 }),
      event({ childId: CHILD_B, type: "sleep", startTime: 30 * 60000, endTime: 90 * 60000 }),
    ];
    const result = computeDailyOverlaps(CHILD_A, CHILD_B, events, 0, DAY_MS);
    expect(result[0].sleepMinutes).toBe(30);
  });

  it("keeps sleep and feed overlaps in separate totals", () => {
    const events = [
      event({ childId: CHILD_A, type: "sleep", startTime: 0, endTime: 60 * 60000 }),
      event({ childId: CHILD_B, type: "sleep", startTime: 0, endTime: 60 * 60000 }),
      event({ childId: CHILD_A, type: "feed", startTime: 0, endTime: 20 * 60000 }),
      event({ childId: CHILD_B, type: "feed", startTime: 0, endTime: 20 * 60000 }),
    ];
    const result = computeDailyOverlaps(CHILD_A, CHILD_B, events, 0, DAY_MS);
    expect(result[0].sleepMinutes).toBe(60);
    expect(result[0].feedMinutes).toBe(20);
  });
});

describe("summarizeTrends", () => {
  it("reports flat with fewer than 4 days of data", () => {
    const daily = [
      { dayStart: 0, sleepMinutes: 10, feedMinutes: 5 },
      { dayStart: DAY_MS, sleepMinutes: 50, feedMinutes: 5 },
    ];
    const [sleepTrend] = summarizeTrends(daily);
    expect(sleepTrend.direction).toBe("flat");
  });

  it("detects an upward trend when the second half is meaningfully higher", () => {
    const daily = [
      { dayStart: 0, sleepMinutes: 10, feedMinutes: 0 },
      { dayStart: DAY_MS, sleepMinutes: 10, feedMinutes: 0 },
      { dayStart: DAY_MS * 2, sleepMinutes: 40, feedMinutes: 0 },
      { dayStart: DAY_MS * 3, sleepMinutes: 40, feedMinutes: 0 },
    ];
    const [sleepTrend] = summarizeTrends(daily);
    expect(sleepTrend.direction).toBe("up");
    expect(sleepTrend.changePercent).toBeGreaterThan(15);
  });

  it("does not flag small fluctuations as a trend", () => {
    const daily = [
      { dayStart: 0, sleepMinutes: 30, feedMinutes: 0 },
      { dayStart: DAY_MS, sleepMinutes: 32, feedMinutes: 0 },
      { dayStart: DAY_MS * 2, sleepMinutes: 31, feedMinutes: 0 },
      { dayStart: DAY_MS * 3, sleepMinutes: 33, feedMinutes: 0 },
    ];
    const [sleepTrend] = summarizeTrends(daily);
    expect(sleepTrend.direction).toBe("flat");
  });
});

describe("computePatternStats", () => {
  it("returns null stats with fewer than 3 matching events", () => {
    const events = [
      event({ childId: CHILD_A, type: "feed", startTime: 0, endTime: 20 * 60000 }),
    ];
    const stats = computePatternStats(CHILD_A, events, "feed");
    expect(stats.meanStartMinuteOfDay).toBeNull();
    expect(stats.consistency).toBe("low");
  });

  it("computes a consistent mean start time for regular events", () => {
    // All three feeds start at minute 600 of the day (10:00 AM) on
    // different days — epoch 0 is midnight, so 600 minutes in works
    // directly as a minute-of-day value for this test.
    const base = 600 * 60000;
    const events = [
      event({ childId: CHILD_A, type: "feed", startTime: base, endTime: base + 20 * 60000 }),
      event({ childId: CHILD_A, type: "feed", startTime: base + DAY_MS, endTime: base + DAY_MS + 20 * 60000 }),
      event({ childId: CHILD_A, type: "feed", startTime: base + DAY_MS * 2, endTime: base + DAY_MS * 2 + 20 * 60000 }),
    ];
    const stats = computePatternStats(CHILD_A, events, "feed");
    expect(stats.consistency).toBe("high");
    expect(stats.meanDurationMinutes).toBe(20);
  });

  it("ignores still-ongoing events (endTime null) when computing duration", () => {
    const events = [
      event({ childId: CHILD_A, type: "sleep", startTime: 0, endTime: null }),
      event({ childId: CHILD_A, type: "sleep", startTime: DAY_MS, endTime: DAY_MS + 60 * 60000 }),
      event({ childId: CHILD_A, type: "sleep", startTime: DAY_MS * 2, endTime: DAY_MS * 2 + 60 * 60000 }),
    ];
    const stats = computePatternStats(CHILD_A, events, "sleep");
    // Only 2 of the 3 events have a real endTime, so sample size should reflect that
    expect(stats.sampleSize).toBe(2);
  });
});

describe("predictConflict", () => {
  it("returns null when either child has insufficient data", () => {
    const incomplete = { type: "sleep" as const, sampleSize: 1, meanStartMinuteOfDay: null, meanDurationMinutes: null, consistency: "low" as const };
    const complete = { type: "sleep" as const, sampleSize: 10, meanStartMinuteOfDay: 600, meanDurationMinutes: 60, consistency: "high" as const };
    expect(predictConflict(incomplete, complete)).toBeNull();
  });

  it("returns null when predicted windows don't overlap", () => {
    const statsA = { type: "sleep" as const, sampleSize: 10, meanStartMinuteOfDay: 540, meanDurationMinutes: 30, consistency: "high" as const }; // 9:00-9:30
    const statsB = { type: "sleep" as const, sampleSize: 10, meanStartMinuteOfDay: 720, meanDurationMinutes: 30, consistency: "high" as const }; // 12:00-12:30
    expect(predictConflict(statsA, statsB)).toBeNull();
  });

  it("predicts an overlap and reports the correct duration", () => {
    const statsA = { type: "sleep" as const, sampleSize: 10, meanStartMinuteOfDay: 600, meanDurationMinutes: 60, consistency: "high" as const }; // 10:00-11:00
    const statsB = { type: "sleep" as const, sampleSize: 10, meanStartMinuteOfDay: 630, meanDurationMinutes: 60, consistency: "high" as const }; // 10:30-11:30
    const result = predictConflict(statsA, statsB);
    expect(result).not.toBeNull();
    expect(result!.overlapMinutes).toBe(30);
  });

  it("caps confidence at the lower of the two children's consistency", () => {
    const confident = { type: "feed" as const, sampleSize: 10, meanStartMinuteOfDay: 600, meanDurationMinutes: 20, consistency: "high" as const };
    const erratic = { type: "feed" as const, sampleSize: 10, meanStartMinuteOfDay: 610, meanDurationMinutes: 20, consistency: "low" as const };
    const result = predictConflict(confident, erratic);
    expect(result!.confidence).toBe("low");
  });
});
