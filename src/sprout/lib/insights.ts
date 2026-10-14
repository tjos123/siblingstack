import {
  DEFAULT_FEED_REMINDER_MIN,
} from "./repo";
import {
  activeLogs,
  currentWakeWindowSec,
  feedDurationSec,
  lastLogByCategory,
  summarizeDay,
} from "./stats";
import { format } from "date-fns";
import {
  formatClock,
  humanDuration,
  isoDay,
  toDate,
} from "./format";
import type { Baby, Log, UnitPreferences } from "./types";
import { formatVolume } from "./units";

export interface FeedDueInfo {
  lastFeedAt: number | null;
  minutesSince: number | null;
  due: boolean;
  overdueMinutes: number;
}

export function feedDueInfo(
  logs: Log[],
  now = Date.now(),
  thresholdMin = DEFAULT_FEED_REMINDER_MIN,
): FeedDueInfo {
  const feed = lastLogByCategory(logs, "feed");
  if (!feed) return { lastFeedAt: null, minutesSince: null, due: false, overdueMinutes: 0 };
  const feedEnd =
    toDate(feed.startTime).getTime() + Math.round(feedDurationSec(feed) * 1000);
  const minutesSince = Math.max(0, Math.floor((now - feedEnd) / 60000));
  return {
    lastFeedAt: feedEnd,
    minutesSince,
    due: minutesSince >= thresholdMin,
    overdueMinutes: Math.max(0, minutesSince - thresholdMin),
  };
}

export interface WakeWindowInfo {
  awakeSec: number;
  minSec: number;
  maxSec: number;
  phase: "sleeping" | "calm" | "cue" | "window" | "overdoing";
}

function wakeTarget(months: number) {
  const m = Math.max(0, months);
  if (m < 1) return { min: 45 * 60, max: 75 * 60 };
  if (m < 2) return { min: 60 * 60, max: 95 * 60 };
  if (m < 3) return { min: 75 * 60, max: 110 * 60 };
  if (m < 4) return { min: 90 * 60, max: 120 * 60 };
  if (m < 6) return { min: 110 * 60, max: 145 * 60 };
  if (m < 9) return { min: 120 * 60, max: 160 * 60 };
  if (m < 12) return { min: 145 * 60, max: 185 * 60 };
  if (m < 18) return { min: 180 * 60, max: 220 * 60 };
  return { min: 200 * 60, max: 260 * 60 };
}

export function wakeWindowInfo(
  logs: Log[],
  ageMonths: number,
  now = new Date(),
): WakeWindowInfo {
  const awakeSec = currentWakeWindowSec(logs, now);
  const { min, max } = wakeTarget(ageMonths);
  if (awakeSec === null) {
    const ongoing = activeLogs(logs).some((l) => l.category === "sleep" && !l.endTime);
    return {
      awakeSec: 0,
      minSec: min,
      maxSec: max,
      phase: ongoing ? "sleeping" : "calm",
    };
  }
  if (awakeSec > max + 15 * 60) {
    return { awakeSec, minSec: min, maxSec: max, phase: "overdoing" };
  }
  if (awakeSec >= min) return { awakeSec, minSec: min, maxSec: max, phase: "window" };
  if (awakeSec >= min - 15 * 60) {
    return { awakeSec, minSec: min, maxSec: max, phase: "cue" };
  }
  return { awakeSec, minSec: min, maxSec: max, phase: "calm" };
}

export interface GrowthSpurt {
  active: boolean;
  reason: string | null;
}

export function growthSpurtSignal(logs: Log[], now = new Date()): GrowthSpurt {
  const active = activeLogs(logs);
  const todayKey = isoDay(now);
  const todayFeeds = active.filter(
    (l) => l.category === "feed" && isoDay(l.startTime) === todayKey,
  ).length;
  const past = active.filter((l) => l.category === "feed" && isoDay(l.startTime) !== todayKey);
  const days = new Set(past.map((l) => isoDay(l.startTime))).size || 1;
  const baseline = past.length / days;
  if (todayFeeds >= 8 && baseline >= 3 && todayFeeds >= baseline * 1.5) {
    return {
      active: true,
      reason: "Cluster feeding detected — a growth spurt often means supply is boosting.",
    };
  }
  return { active: false, reason: null };
}

export interface IntakeOutput {
  intakeOz: number;
  breastMinutes: number;
  diapers: number;
  wetCount: number;
  dryCount: number;
}

export function intakeOutput(logs: Log[], now = new Date()): IntakeOutput {
  const day = summarizeDay(logs, now);
  const todayLogs = activeLogs(logs).filter((l) => isoDay(l.startTime) === isoDay(now));
  const wetCount = todayLogs.filter(
    (l) => l.category === "diaper" && (l.subtype === "wet" || l.subtype === "both"),
  ).length;
  const dryCount = todayLogs.filter(
    (l) => l.category === "diaper" && l.subtype === "dry",
  ).length;
  return {
    intakeOz: day.feedBottleOz + day.pumpOz,
    breastMinutes: day.breastMinutes,
    diapers: day.diapers,
    wetCount,
    dryCount,
  };
}

export function handoffSummary(
  logs: Log[],
  baby: Baby | null,
  units: UnitPreferences,
  now = new Date(),
): string {
  const day = summarizeDay(logs, now);
  const todayLogs = activeLogs(logs).filter((l) => isoDay(l.startTime) === isoDay(now));
  const lines: string[] = [];
  lines.push(`🌱 ${baby ? baby.name : "Baby"} — ${format(now, "EEE, MMM d")}`);
  const lastFeed = lastLogByCategory(todayLogs, "feed");
  if (lastFeed) lines.push(`🍼 Last feed ${formatClock(lastFeed.startTime)}`);
  const lastDiaper = lastLogByCategory(todayLogs, "diaper");
  if (lastDiaper) lines.push(`💧 Last diaper ${formatClock(lastDiaper.startTime)}`);
  const lastSleep = lastLogByCategory(todayLogs, "sleep");
  if (lastSleep) lines.push(`😴 Last sleep ${formatClock(lastSleep.startTime)}`);
  lines.push("");
  lines.push(`Milk today: ${day.feeds} feed(s), ${formatVolume(day.feedBottleOz + day.pumpOz, units.volume)} bottle`);
  lines.push(`Breast time: ${humanDuration(Math.round(day.breastMinutes * 60))}`);
  lines.push(`Sleep today: ${humanDuration(day.sleepSec)}`);
  lines.push(`Diapers today: ${day.diapers}`);
  const meds = todayLogs.filter((l) => l.category === "health");
  if (meds.length > 0) {
    lines.push("");
    lines.push(`Health: ${meds.map((l) => (l.details.vaccineName ?? l.details.medicationName ?? l.details.symptoms ?? "note") as string).join("; ")}`);
  }
  const notes = todayLogs.filter((l) => typeof l.details.notes === "string" && (l.details.notes as string).length > 0);
  if (notes.length > 0) {
    lines.push("");
    const lastNote = notes.sort((a, b) => toDate(b.startTime).getTime() - toDate(a.startTime).getTime())[0];
    lines.push(`Note: ${(lastNote.details.notes as string).slice(0, 200)}`);
  }
  return lines.join("\n");
}