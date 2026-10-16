import {
  daysAgo,
  durationBetweenSeconds,
  isoDay,
  startOfDayDate,
  toDate,
} from "./format";
import type { Log } from "./types";
import { average, round, sum } from "./utils";

export const NIGHT_START_HOUR = 19;
export const NIGHT_END_HOUR = 7;

export type RangeDays = 1 | 7 | 14;

export interface RangeWindow {
  days: RangeDays;
  start: Date;
  end: Date;
  previousStart: Date;
  previousEnd: Date;
}

export function buildWindow(days: RangeDays, now = new Date()): RangeWindow {
  const end = now;
  const start =
    days === 1 ? startOfDayDate(now) : daysAgo(days - 1, now);
  const spanMs = end.getTime() - start.getTime();
  const previousEnd = new Date(start.getTime() - 1);
  const previousStart = new Date(start.getTime() - spanMs - 1);
  return { days, start, end, previousStart, previousEnd };
}

export function inRange(log: Log, start: Date, end: Date) {
  const t = toDate(log.startTime).getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export function activeLogs(logs: Log[]) {
  return logs.filter((log) => !log.deleted);
}

export function isNightTime(value: string | number | Date) {
  const hour = toDate(value).getHours();
  return hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;
}

export function sleepDurationSec(log: Log): number {
  if (log.endTime) {
    return durationBetweenSeconds(log.startTime, log.endTime);
  }
  const details = log.details ?? {};
  if (typeof details.durationSec === "number") return details.durationSec;
  if (typeof details.durationMin === "number") return details.durationMin * 60;
  return 0;
}

export function feedDurationSec(log: Log): number {
  if (log.category !== "feed") return 0;
  const details = log.details ?? {};
  if (typeof details.durationSec === "number") return details.durationSec;
  if (typeof details.durationMin === "number") return details.durationMin * 60;
  if (log.endTime) return durationBetweenSeconds(log.startTime, log.endTime);
  return 0;
}

export function bottleVolumeOz(log: Log): number {
  const details = log.details ?? {};
  if (typeof details.bottleAmountOz === "number") return details.bottleAmountOz;
  if (typeof details.bottleAmountMl === "number") return details.bottleAmountMl / 29.5735;
  return 0;
}

export function pumpVolumeOz(log: Log): number {
  const details = log.details ?? {};
  const total =
    (typeof details.pumpLeftOz === "number" ? details.pumpLeftOz : 0) +
    (typeof details.pumpRightOz === "number" ? details.pumpRightOz : 0);
  if (total > 0) return total;
  if (typeof details.bottleAmountOz === "number") return details.bottleAmountOz;
  return 0;
}

export function pumpDurationMin(log: Log): number {
  const details = log.details ?? {};
  if (typeof details.durationMin === "number") return details.durationMin;
  if (typeof details.durationSec === "number") return details.durationSec / 60;
  if (log.endTime) return durationBetweenSeconds(log.startTime, log.endTime) / 60;
  return 0;
}

export interface FeedStats {
  sessions: number;
  perDay: number;
  activeDays: number;
  bottleOz: number;
  breastMinutes: number;
  avgGapMinutes: number;
  breastSessions: number;
  bottleSessions: number;
  solidSessions: number;
}

// Averages are per *active* day — days that actually hold an entry of the
// category — so a tracker with a gap in it doesn't read as "fewer feeds a day".
function perDayDivisor(entries: Log[], days: number) {
  if (days <= 1) return 1;
  return new Set(entries.map((l) => isoDay(l.startTime))).size;
}

function computeFeed(logs: Log[], days: number): FeedStats {
  const feeds = logs
    .filter((l) => l.category === "feed")
    .sort((a, b) => toDate(a.startTime).getTime() - toDate(b.startTime).getTime());
  const breastSessions = feeds.filter(
    (l) => l.feedSubtype === "breastfeeding" || l.feedSubtype === "combo",
  ).length;
  const bottleSessions = feeds.filter(
    (l) => l.feedSubtype === "bottlefeed" || l.feedSubtype === "combo",
  ).length;
  const solidSessions = feeds.filter((l) => l.feedSubtype === "solid").length;
  const bottleOz = sum(feeds.map(bottleVolumeOz));
  const breastMinutes = sum(feeds.map(feedDurationSec)) / 60;
  const gaps: number[] = [];
  for (let i = 1; i < feeds.length; i += 1) {
    const gap =
      durationBetweenSeconds(feeds[i - 1].startTime, feeds[i].startTime) / 60;
    if (gap > 0 && gap < 60 * 12) gaps.push(gap);
  }
  const divisor = perDayDivisor(feeds, days);
  return {
    sessions: feeds.length,
    perDay: divisor > 0 ? feeds.length / divisor : 0,
    activeDays: new Set(feeds.map((l) => isoDay(l.startTime))).size,
    bottleOz,
    breastMinutes,
    avgGapMinutes: average(gaps),
    breastSessions,
    bottleSessions,
    solidSessions,
  };
}

export interface DiaperStats {
  count: number;
  perDay: number;
  activeDays: number;
  wet: number;
  dirty: number;
  both: number;
  dry: number;
  day: number;
  night: number;
}

function computeDiaper(logs: Log[], days: number): DiaperStats {
  const diapers = logs.filter((l) => l.category === "diaper");
  const divisor = perDayDivisor(diapers, days);
  return {
    count: diapers.length,
    perDay: divisor > 0 ? diapers.length / divisor : 0,
    activeDays: new Set(diapers.map((l) => isoDay(l.startTime))).size,
    wet: diapers.filter((l) => l.subtype === "wet").length,
    dirty: diapers.filter((l) => l.subtype === "dirty").length,
    both: diapers.filter((l) => l.subtype === "both").length,
    dry: diapers.filter((l) => l.subtype === "dry").length,
    day: diapers.filter((l) => !isNightTime(l.startTime)).length,
    night: diapers.filter((l) => isNightTime(l.startTime)).length,
  };
}

export interface SleepStats {
  sessions: number;
  totalSec: number;
  perDayHours: number;
  activeDays: number;
  daySec: number;
  nightSec: number;
  longestSec: number;
  avgWakeWindowSec: number;
}

function computeSleep(logs: Log[], days: number): SleepStats {
  const sleeps = logs
    .filter((l) => l.category === "sleep")
    .sort((a, b) => toDate(a.startTime).getTime() - toDate(b.startTime).getTime());
  const durations = sleeps.map(sleepDurationSec);
  const totalSec = sum(durations);
  const daySec = sum(
    sleeps
      .filter((l) => !isNightTime(l.startTime))
      .map(sleepDurationSec),
  );
  const nightSec = sum(
    sleeps.filter((l) => isNightTime(l.startTime)).map(sleepDurationSec),
  );
  const wakeWindows: number[] = [];
  for (let i = 1; i < sleeps.length; i += 1) {
    const prevEnd = sleeps[i - 1].endTime
      ? toDate(sleeps[i - 1].endTime as string)
      : new Date(
          toDate(sleeps[i - 1].startTime).getTime() +
            sleepDurationSec(sleeps[i - 1]) * 1000,
        );
    const gap = durationBetweenSeconds(prevEnd, sleeps[i].startTime);
    if (gap > 0 && gap < 60 * 60 * 10) wakeWindows.push(gap);
  }
  const divisor = perDayDivisor(sleeps, days);
  return {
    sessions: sleeps.length,
    totalSec,
    perDayHours: divisor > 0 ? totalSec / 3600 / divisor : 0,
    activeDays: new Set(sleeps.map((l) => isoDay(l.startTime))).size,
    daySec,
    nightSec,
    longestSec: durations.length ? Math.max(...durations) : 0,
    avgWakeWindowSec: average(wakeWindows),
  };
}

export interface PumpStats {
  sessions: number;
  totalOz: number;
  perDayOz: number;
  activeDays: number;
  totalMinutes: number;
  avgPerSessionOz: number;
}

function computePump(logs: Log[], days: number): PumpStats {
  const pumps = logs.filter((l) => l.category === "pump");
  const totalOz = sum(pumps.map(pumpVolumeOz));
  const divisor = perDayDivisor(pumps, days);
  return {
    sessions: pumps.length,
    totalOz,
    perDayOz: divisor > 0 ? totalOz / divisor : 0,
    activeDays: new Set(pumps.map((l) => isoDay(l.startTime))).size,
    totalMinutes: sum(pumps.map(pumpDurationMin)),
    avgPerSessionOz: pumps.length ? totalOz / pumps.length : 0,
  };
}

export interface Change {
  dir: "up" | "down" | "flat";
  abs: number;
  pct: number;
}

export function computeChange(current: number, previous: number): Change {
  const abs = current - previous;
  if (Math.abs(abs) < 0.001 || previous === 0) {
    return { dir: abs === 0 ? "flat" : abs > 0 ? "up" : "down", abs, pct: 0 };
  }
  const pct = (abs / Math.abs(previous)) * 100;
  return { dir: abs > 0 ? "up" : "down", abs, pct };
}

export interface TrendsResult {
  window: RangeWindow;
  rangeActiveDays: number;
  feed: FeedStats;
  feedPrev: FeedStats;
  diaper: DiaperStats;
  diaperPrev: DiaperStats;
  sleep: SleepStats;
  sleepPrev: SleepStats;
  pump: PumpStats;
  pumpPrev: PumpStats;
}

export function computeTrends(
  allLogs: Log[],
  days: RangeDays,
  now = new Date(),
): TrendsResult {
  const window = buildWindow(days, now);
  const logs = activeLogs(allLogs);
  const current = logs.filter((l) =>
    inRange(l, window.start, window.end),
  );
  const previous = logs.filter((l) =>
    inRange(l, window.previousStart, window.previousEnd),
  );
  return {
    window,
    rangeActiveDays: new Set(current.map((l) => isoDay(l.startTime))).size,
    feed: computeFeed(current, days),
    feedPrev: computeFeed(previous, days),
    diaper: computeDiaper(current, days),
    diaperPrev: computeDiaper(previous, days),
    sleep: computeSleep(current, days),
    sleepPrev: computeSleep(previous, days),
    pump: computePump(current, days),
    pumpPrev: computePump(previous, days),
  };
}

export interface DailyBucket {
  key: string;
  date: Date;
  feeds: number;
  feedBottleOz: number;
  breastMinutes: number;
  diapers: number;
  sleepHours: number;
  pumpOz: number;
}

export function bucketByDay(logs: Log[], days: number, now = new Date()): DailyBucket[] {
  const active = activeLogs(logs);
  const buckets: DailyBucket[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = daysAgo(i, now);
    const key = isoDay(date);
    buckets.push({
      key,
      date,
      feeds: 0,
      feedBottleOz: 0,
      breastMinutes: 0,
      diapers: 0,
      sleepHours: 0,
      pumpOz: 0,
    });
  }
  const index = new Map(buckets.map((b) => [b.key, b]));
  active.forEach((log) => {
    const bucket = index.get(isoDay(log.startTime));
    if (!bucket) return;
    if (log.category === "feed") {
      bucket.feeds += 1;
      bucket.feedBottleOz += bottleVolumeOz(log);
      bucket.breastMinutes += feedDurationSec(log) / 60;
    } else if (log.category === "diaper") {
      bucket.diapers += 1;
    } else if (log.category === "sleep") {
      bucket.sleepHours += sleepDurationSec(log) / 3600;
    } else if (log.category === "pump") {
      bucket.pumpOz += pumpVolumeOz(log);
    }
  });
  return buckets;
}

export interface DaySummary {
  feeds: number;
  feedBottleOz: number;
  breastMinutes: number;
  diapers: number;
  sleepSec: number;
  pumpOz: number;
  pumpMinutes: number;
  routines: number;
  milestones: number;
}

export function summarizeDay(logs: Log[], date: string | number | Date): DaySummary {
  const key = isoDay(date);
  const dayLogs = activeLogs(logs).filter((l) => isoDay(l.startTime) === key);
  return {
    feeds: dayLogs.filter((l) => l.category === "feed").length,
    feedBottleOz: sum(
      dayLogs.filter((l) => l.category === "feed").map(bottleVolumeOz),
    ),
    breastMinutes:
      sum(dayLogs.filter((l) => l.category === "feed").map(feedDurationSec)) / 60,
    diapers: dayLogs.filter((l) => l.category === "diaper").length,
    sleepSec: sum(
      dayLogs.filter((l) => l.category === "sleep").map(sleepDurationSec),
    ),
    pumpOz: sum(dayLogs.filter((l) => l.category === "pump").map(pumpVolumeOz)),
    pumpMinutes: sum(
      dayLogs.filter((l) => l.category === "pump").map(pumpDurationMin),
    ),
    routines: dayLogs.filter((l) => l.category === "routine").length,
    milestones: dayLogs.filter((l) => l.category === "milestone").length,
  };
}

export function lastLogByCategory(logs: Log[], category: Log["category"]) {
  const matches = activeLogs(logs)
    .filter((l) => l.category === category)
    .sort((a, b) => toDate(b.startTime).getTime() - toDate(a.startTime).getTime());
  return matches[0] ?? null;
}

export function currentWakeWindowSec(logs: Log[], now = new Date()): number | null {
  const sleeps = activeLogs(logs)
    .filter((l) => l.category === "sleep" && l.endTime)
    .sort((a, b) => toDate(b.endTime as string).getTime() - toDate(a.endTime as string).getTime());
  if (sleeps.length === 0) return null;
  const lastEnd = sleeps[0].endTime as string;
  const ongoing = activeLogs(logs).some(
    (l) => l.category === "sleep" && !l.endTime,
  );
  if (ongoing) return null;
  return durationBetweenSeconds(lastEnd, now);
}

export function totalsForToday(logs: Log[], now = new Date()) {
  return summarizeDay(logs, now);
}

export function formatOz(oz: number) {
  return round(oz, 1);
}
