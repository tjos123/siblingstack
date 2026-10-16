import { describe, expect, it } from "vitest";
import {
  computeChange,
  computeTrends,
  isNightTime,
  sleepDurationSec,
  type RangeDays,
} from "@/sprout/lib/stats";
import type { Category, Log } from "@/sprout/lib/types";

const NOW = new Date("2026-06-10T12:00:00");

let seq = 0;
function log(
  category: Category,
  startTime: string,
  patch: Partial<Log> = {},
): Log {
  seq += 1;
  return {
    id: `log_${seq}`,
    babyId: "baby_1",
    userId: "local_user_1",
    category,
    subtype: null,
    startTime,
    endTime: null,
    details: {},
    createdAt: startTime,
    updatedAt: startTime,
    deleted: false,
    ...patch,
  };
}

// Checklist item 3: averages divide by the days that actually hold data,
// not by the length of the window.
describe("computeTrends — per-active-day averages", () => {
  it("divides by 2 when data spans only 2 of 7 days", () => {
    const logs = [
      ...[1, 2, 3].map((h) =>
        log("feed", `2026-06-09T0${h}:00:00`, {
          feedSubtype: "bottlefeed",
          subtype: "bottlefeed",
          details: { bottleAmountOz: 4 },
        }),
      ),
      ...[1, 2, 3].map((h) =>
        log("feed", `2026-06-10T0${h}:00:00`, {
          feedSubtype: "bottlefeed",
          subtype: "bottlefeed",
          details: { bottleAmountOz: 4 },
        }),
      ),
    ];

    const result = computeTrends(logs, 7 as RangeDays, NOW);

    expect(result.feed.sessions).toBe(6);
    expect(result.feed.activeDays).toBe(2);
    expect(result.feed.perDay).toBe(3);
    expect(result.rangeActiveDays).toBe(2);
  });

  it("returns zeroes with no data and no crashed divisions", () => {
    const result = computeTrends([], 7 as RangeDays, NOW);

    expect(result.feed.sessions).toBe(0);
    expect(result.feed.perDay).toBe(0);
    expect(result.diaper.count).toBe(0);
    expect(result.diaper.perDay).toBe(0);
    expect(result.sleep.sessions).toBe(0);
    expect(result.sleep.perDayHours).toBe(0);
    expect(result.pump.sessions).toBe(0);
    expect(result.pump.perDayOz).toBe(0);
    expect(result.rangeActiveDays).toBe(0);
  });

  it("skips soft-deleted entries entirely", () => {
    const logs = [
      log("feed", "2026-06-09T08:00:00", { deleted: true }),
      log("diaper", "2026-06-10T08:00:00", { deleted: true }),
    ];

    const result = computeTrends(logs, 7 as RangeDays, NOW);

    expect(result.feed.sessions).toBe(0);
    expect(result.diaper.count).toBe(0);
    expect(result.rangeActiveDays).toBe(0);
  });

  it("splits pump volume across active days", () => {
    const logs = [
      log("pump", "2026-06-09T06:00:00", {
        details: { pumpLeftOz: 3, pumpRightOz: 5 },
      }),
      log("pump", "2026-06-10T06:00:00", {
        details: { pumpLeftOz: 4, pumpRightOz: 4 },
      }),
    ];

    const result = computeTrends(logs, 7 as RangeDays, NOW);

    expect(result.pump.totalOz).toBe(16);
    expect(result.pump.activeDays).toBe(2);
    expect(result.pump.perDayOz).toBe(8);
  });
});

describe("computeChange", () => {
  it("never reports a percentage against a zero baseline", () => {
    expect(computeChange(3, 0)).toMatchObject({ dir: "up", pct: 0 });
  });

  it("computes rise and fall percentages (signed)", () => {
    expect(computeChange(4, 2)).toMatchObject({ dir: "up", pct: 100 });
    expect(computeChange(1, 2)).toMatchObject({ dir: "down", pct: -50 });
  });
});

describe("isNightTime (sleep day/night split)", () => {
  it("treats 19:00 onward and before 07:00 as night", () => {
    expect(isNightTime("2026-06-10T19:00:00")).toBe(true);
    expect(isNightTime("2026-06-10T06:59:00")).toBe(true);
  });

  it("treats the rest of the day as day", () => {
    expect(isNightTime("2026-06-10T07:00:00")).toBe(false);
    expect(isNightTime("2026-06-10T18:59:00")).toBe(false);
  });
});

describe("sleepDurationSec", () => {
  it("falls back to durationMin when there is no endTime", () => {
    const entry = log("sleep", "2026-06-10T13:00:00", {
      details: { durationMin: 45 },
    });
    expect(sleepDurationSec(entry)).toBe(45 * 60);
  });
});
