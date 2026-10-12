import {
  DIAPER_SUBTYPE_LABELS,
  HEALTH_SUBTYPE_LABELS,
  MILESTONE_PRESET_LABELS,
  ROUTINE_PRESET_LABELS,
  subtypeLabel,
} from "./categories";
import { humanDuration, timerClock } from "./format";
import {
  feedDurationSec,
  pumpDurationMin,
  pumpVolumeOz,
  sleepDurationSec,
} from "./stats";
import type {
  Baby,
  DiaperSubtype,
  HealthSubtype,
  Log,
  UnitPreferences,
} from "./types";
import { formatLength, formatTemperature, formatVolume, formatWeight } from "./units";

const SIDE_LABEL: Record<string, string> = {
  left: "Left",
  right: "Right",
  both: "Both",
};

export function logTitle(log: Log, baby?: Baby): string {
  switch (log.category) {
    case "feed":
      return subtypeLabel("feed", log.feedSubtype ?? log.subtype);
    case "diaper":
      return `Diaper · ${
        DIAPER_SUBTYPE_LABELS[log.diaperSubtype as DiaperSubtype] ?? "Change"
      }`;
    case "sleep":
      return log.subtype === "night" ? "Night Sleep" : "Nap";
    case "pump":
      return "Pumping Session";
    case "routine":
      return (
        ROUTINE_PRESET_LABELS[log.subtype as keyof typeof ROUTINE_PRESET_LABELS] ??
        log.details?.routineName === "custom"
          ? "Activity"
          : "Routine"
      );
    case "milestone":
      return (
        (log.details?.milestoneTitle as string) ||
        (log.details?.title as string) ||
        MILESTONE_PRESET_LABELS[
          log.subtype as keyof typeof MILESTONE_PRESET_LABELS
        ] ||
        "Milestone"
      );
    case "growth":
      return "Growth Check";
    case "health":
      return (
        HEALTH_SUBTYPE_LABELS[log.healthSubtype as HealthSubtype] ?? "Health"
      );
    default:
      return baby ? baby.name : "Entry";
  }
}

function feedSummary(log: Log, units: UnitPreferences) {
  const subtype = log.feedSubtype;
  const details = log.details ?? {};
  if (subtype === "bottlefeed") {
    const vol = formatVolume((details.bottleAmountOz as number) ?? 0, units.volume);
    const type = details.bottleType ? ` ${details.bottleType}` : "";
    const brand = details.bottleBrand ? ` · ${details.bottleBrand}` : "";
    return `${vol}${type} bottle${brand}`;
  }
  if (subtype === "solid") {
    return details.food ? `Solids · ${details.food}` : "Solids";
  }
  if (subtype === "combo") {
    const vol = formatVolume((details.bottleAmountOz as number) ?? 0, units.volume);
    return `Combo · ${humanDuration(feedDurationSec(log))} + ${vol}`;
  }
  const side = SIDE_LABEL[(details.breastSide as string) ?? "left"] ?? "Left";
  return `${side} breast · ${humanDuration(feedDurationSec(log))}`;
}

export function logSummary(log: Log, units: UnitPreferences): string {
  const details = log.details ?? {};
  switch (log.category) {
    case "feed":
      return feedSummary(log, units);
    case "pump": {
      const total = pumpVolumeOz(log);
      const mins = pumpDurationMin(log);
      const left = (details.pumpLeftOz as number) ?? 0;
      const right = (details.pumpRightOz as number) ?? 0;
      return `${formatVolume(total, units.volume)} · ${left}+${right}oz · ${Math.round(mins)}m`;
    }
    case "diaper":
      return DIAPER_SUBTYPE_LABELS[log.diaperSubtype as DiaperSubtype] ?? "Changed";
    case "sleep":
      return humanDuration(sleepDurationSec(log));
    case "routine":
      return (details.durationMin as number)
        ? humanDuration(sleepDurationSec(log) || (details.durationMin as number) * 60)
        : "Activity";
    case "milestone":
      return (details.notes as string) || "A new memory";
    case "growth": {
      const parts: string[] = [];
      if (typeof details.weightKg === "number")
        parts.push(formatWeight(details.weightKg, units.weight));
      if (typeof details.heightCm === "number")
        parts.push(formatLength(details.heightCm, units.length));
      if (typeof details.headCm === "number")
        parts.push(`head ${formatLength(details.headCm, units.length)}`);
      return parts.join(" · ") || "Measurement";
    }
    case "health": {
      const subtype = log.healthSubtype;
      if (subtype === "temperature" && typeof details.temperatureC === "number")
        return formatTemperature(details.temperatureC, units.temperature);
      if (subtype === "vaccine")
        return (details.vaccineName as string) || "Vaccination";
      if (subtype === "medication")
        return [details.medicationName, details.medicationDose]
          .filter(Boolean)
          .join(" · ") || "Medication";
      return (details.symptoms as string) || "Medical note";
    }
    default:
      return "Logged";
  }
}

export function logTimeRange(log: Log) {
  if (!log.endTime) return null;
  const start = new Date(log.startTime);
  const end = new Date(log.endTime);
  const fmt = (d: Date) =>
    d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function durationBadgeText(log: Log) {
  if (log.category === "sleep") return timerClock(sleepDurationSec(log));
  if (log.category === "feed") return timerClock(feedDurationSec(log));
  return null;
}

export function milestonesFromLogs(logs: Log[]): Log[] {
  return logs
    .filter((log) => log.category === "milestone" && !log.deleted)
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );
}
