import { z } from "zod";
import type {
  AppSettings,
  BreastSide,
  Category,
  DiaperSubtype,
  FeedSubtype,
  HealthSubtype,
  Log,
  LogDetails,
  NewLog,
  SleepSubtype,
} from "./types";
import { DIAPER_SUBTYPES, FEED_SUBTYPES, HEALTH_SUBTYPES } from "./types";
import type { FinishedTimer } from "@/sprout/hooks/use-timers";
import { cmToIn, kgToLb, mlToOz, ozToMl } from "./units";

export interface LogDraft {
  category: Category;
  subtype: string;
  feedSubtype: FeedSubtype | null;
  diaperSubtype: DiaperSubtype | null;
  healthSubtype: HealthSubtype | null;
  startTime: string;
  endTime: string | null;
  details: LogDetails;
}

export type FieldErrors = Record<string, string>;

export function isoToLocalInput(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function localInputToIso(value: string) {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
}

export function defaultDraft(
  category: Category,
  settings: AppSettings,
): LogDraft {
  const now = new Date().toISOString();
  const base: LogDraft = {
    category,
    subtype: "",
    feedSubtype: null,
    diaperSubtype: null,
    healthSubtype: null,
    startTime: now,
    endTime: null,
    details: {},
  };
  switch (category) {
    case "feed":
      return {
        ...base,
        subtype: "breastfeeding",
        feedSubtype: "breastfeeding",
        details: { breastSide: "left", durationSec: 300, notes: "" },
      };
    case "pump":
      return {
        ...base,
        subtype: "expressed",
        details: {
          pumpLeftOz: 0,
          pumpRightOz: 0,
          durationMin: 15,
          notes: "",
        },
      };
    case "diaper":
      return { ...base, subtype: "wet", diaperSubtype: "wet", details: {} };
    case "sleep": {
      const start = new Date(Date.now() - 45 * 60000);
      return {
        ...base,
        subtype: settings.defaultSleepType,
        startTime: start.toISOString(),
        endTime: now,
        details: { durationMin: 45, notes: "" },
      };
    }
    case "routine":
      return {
        ...base,
        subtype: "tummy_time",
        startTime: new Date(Date.now() - 10 * 60000).toISOString(),
        endTime: now,
        details: { routineName: "tummy_time", durationMin: 10, notes: "" },
      };
    case "milestone":
      return {
        ...base,
        subtype: "first_smile",
        details: { milestoneTitle: "", photo: "🌱", notes: "" },
      };
    case "growth":
      return {
        ...base,
        subtype: "measurement",
        details: { weightKg: 0, heightCm: 0, headCm: 0 },
      };
    case "health":
      return {
        ...base,
        subtype: "medical",
        healthSubtype: "medical",
        details: { notes: "", symptoms: "" },
      };
    default:
      return base;
  }
}

export function draftFromLog(log: Log): LogDraft {
  return {
    category: log.category,
    subtype: log.subtype ?? "",
    feedSubtype: log.feedSubtype ?? null,
    diaperSubtype: log.diaperSubtype ?? null,
    healthSubtype: log.healthSubtype ?? null,
    startTime: log.startTime,
    endTime: log.endTime,
    details: { ...log.details },
  };
}

export function draftFromFinishedTimer(
  finished: FinishedTimer,
  settings: AppSettings,
): LogDraft {
  if (finished.kind === "nursing") {
    const draft = defaultDraft("feed", settings);
    draft.feedSubtype = "breastfeeding";
    draft.subtype = "breastfeeding";
    draft.startTime = finished.startTime;
    draft.endTime = finished.endTime;
    draft.details = {
      breastSide: (finished.side as BreastSide) ?? "left",
      durationSec: finished.elapsedSec,
      notes: "",
    };
    return draft;
  }
  if (finished.kind === "pumping") {
    const draft = defaultDraft("pump", settings);
    draft.startTime = finished.startTime;
    draft.endTime = finished.endTime;
    draft.details = {
      pumpLeftOz: 0,
      pumpRightOz: 0,
      durationSec: finished.elapsedSec,
      durationMin: Math.round(finished.elapsedSec / 60),
      notes: "",
    };
    return draft;
  }
  const draft = defaultDraft("sleep", settings);
  draft.subtype = settings.defaultSleepType;
  draft.startTime = finished.startTime;
  draft.endTime = finished.endTime;
  draft.details = {
    durationMin: Math.round(finished.elapsedSec / 60),
    durationSec: finished.elapsedSec,
    notes: "",
  };
  return draft;
}

function minutesBetween(startIso: string, endIso: string | null) {
  if (!endIso) return 0;
  return Math.max(
    0,
    Math.round(
      (new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000,
    ),
  );
}

export function draftDurationMin(draft: LogDraft) {
  if (draft.endTime) return minutesBetween(draft.startTime, draft.endTime);
  if (typeof draft.details.durationMin === "number") return draft.details.durationMin;
  if (typeof draft.details.durationSec === "number")
    return Math.round((draft.details.durationSec as number) / 60);
  return 0;
}

export function withDuration(draft: LogDraft, minutes: number): LogDraft {
  const now = Date.now();
  let start = new Date(draft.startTime);
  let end = new Date(start.getTime() + minutes * 60000);
  // Never land in the future: anchor the end at "now" and walk the start
  // back so the chosen duration still holds.
  if (end.getTime() > now) {
    end = new Date(now);
    start = new Date(now - minutes * 60000);
  }
  return {
    ...draft,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    details: {
      ...draft.details,
      durationMin: minutes,
      durationSec: minutes * 60,
    },
  };
}

function numberField(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function flatten(draft: LogDraft) {
  const d = draft.details;
  return {
    feedSubtype: draft.feedSubtype,
    diaperSubtype: draft.diaperSubtype,
    healthSubtype: draft.healthSubtype,
    subtype: draft.subtype,
    bottleAmountOz: numberField(d.bottleAmountOz),
    bottleBrand: (d.bottleBrand as string) ?? "",
    durationSec:
      typeof d.durationSec === "number"
        ? d.durationSec
        : draftDurationMin(draft) * 60,
    food: (d.food as string) ?? "",
    pumpLeftOz: numberField(d.pumpLeftOz),
    pumpRightOz: numberField(d.pumpRightOz),
    routineName: (d.routineName as string) ?? draft.subtype,
    milestoneTitle: ((d.milestoneTitle ?? d.title) as string) ?? "",
    weightKg: numberField(d.weightKg),
    heightCm: numberField(d.heightCm),
    headCm: numberField(d.headCm),
    temperatureC: numberField(d.temperatureC),
    vaccineName: (d.vaccineName as string) ?? "",
    medicationName: (d.medicationName as string) ?? "",
    medicationDose: (d.medicationDose as string) ?? "",
    durationMin: draftDurationMin(draft),
    startTime: draft.startTime,
    endTime: draft.endTime,
  };
}

const feedSchema = z
  .object({
    feedSubtype: z.enum(FEED_SUBTYPES).nullable(),
    bottleAmountOz: z.number(),
    durationSec: z.number(),
  })
  .superRefine((value, ctx) => {
    const isBottle =
      value.feedSubtype === "bottlefeed" || value.feedSubtype === "combo";
    if (isBottle && value.bottleAmountOz <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["bottleAmountOz"],
        message: "Add the bottle volume",
      });
    }
    const isBreast =
      value.feedSubtype === "breastfeeding" || value.feedSubtype === "combo";
    if (isBreast && value.durationSec <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["durationSec"],
        message: "Add nursing duration",
      });
    }
  });

const pumpSchema = z
  .object({ pumpLeftOz: z.number(), pumpRightOz: z.number(), durationMin: z.number() })
  .superRefine((value, ctx) => {
    if (value.pumpLeftOz <= 0 && value.pumpRightOz <= 0 && value.durationMin <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["pumpLeftOz"],
        message: "Add left or right output",
      });
    }
  });

const diaperSchema = z.object({
  diaperSubtype: z.enum(DIAPER_SUBTYPES).nullable(),
});

const sleepSchema = z
  .object({ subtype: z.string(), durationMin: z.number() })
  .superRefine((value, ctx) => {
    if (value.durationMin <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["durationMin"],
        message: "Add the sleep duration",
      });
    }
  });

const routineSchema = z.object({
  routineName: z.string().min(1, "Name this activity"),
});

const milestoneSchema = z.object({
  milestoneTitle: z.string().trim().min(2, "Give this milestone a title"),
});

const growthSchema = z
  .object({ weightKg: z.number(), heightCm: z.number(), headCm: z.number() })
  .superRefine((value, ctx) => {
    if (value.weightKg <= 0 && value.heightCm <= 0 && value.headCm <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["weightKg"],
        message: "Add at least one measurement",
      });
    }
  });

const healthSchema = z
  .object({
    healthSubtype: z.enum(HEALTH_SUBTYPES).nullable(),
    temperatureC: z.number(),
    vaccineName: z.string(),
    medicationName: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.healthSubtype === "temperature" && value.temperatureC <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["temperatureC"],
        message: "Add a temperature reading",
      });
    }
    if (value.healthSubtype === "vaccine" && !value.vaccineName.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["vaccineName"],
        message: "Name the vaccine",
      });
    }
    if (value.healthSubtype === "medication" && !value.medicationName.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["medicationName"],
        message: "Name the medication",
      });
    }
  });

const schemas: Record<Category, z.ZodTypeAny> = {
  feed: feedSchema,
  pump: pumpSchema,
  diaper: diaperSchema,
  sleep: sleepSchema,
  routine: routineSchema,
  milestone: milestoneSchema,
  growth: growthSchema,
  health: healthSchema,
};

export function validateDraft(draft: LogDraft): FieldErrors {
  const errors: FieldErrors = {};
  if (draft.startTime && new Date(draft.startTime).getTime() > Date.now()) {
    errors.startTime = "Time can't be in the future";
  } else if (draft.endTime && new Date(draft.endTime).getTime() > Date.now()) {
    errors.startTime = "Time can't be in the future";
  }
  const result = schemas[draft.category].safeParse(flatten(draft));
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!errors[key]) errors[key] = issue.message;
    }
  }
  return errors;
}

export function draftToNewLog(draft: LogDraft): NewLog {
  return {
    category: draft.category,
    subtype: draft.subtype || null,
    feedSubtype: draft.feedSubtype,
    diaperSubtype: draft.diaperSubtype,
    healthSubtype: draft.healthSubtype,
    startTime: draft.startTime,
    endTime: draft.endTime,
    details: draft.details,
  };
}

export const FEED_AMOUNTS_OZ = [1, 2, 3, 4, 5, 6];
export const FEED_AMOUNTS_ML = [30, 60, 90, 120, 150, 180];
export const PUMP_AMOUNTS_OZ = [1, 2, 3, 4, 5];
export const SLEEP_MINUTES = [20, 30, 45, 60, 90, 120];
export const ROUTINE_MINUTES = [5, 10, 15, 20, 30];
export const WEIGHT_QUICK = [3, 4, 5, 6, 7, 8];
export const TEMP_QUICK_C = [36.5, 37, 37.5, 38, 38.5, 39];

export function setBottleAmount(draft: LogDraft, oz: number): LogDraft {
  return {
    ...draft,
    details: {
      ...draft.details,
      bottleAmountOz: oz,
      bottleAmountMl: Math.round(ozToMl(oz)),
    },
  };
}

export function setPumpVolumes(
  draft: LogDraft,
  side: "left" | "right",
  oz: number,
): LogDraft {
  const details = { ...draft.details };
  if (side === "left") {
    details.pumpLeftOz = oz;
    details.pumpLeftMl = Math.round(ozToMl(oz));
  } else {
    details.pumpRightOz = oz;
    details.pumpRightMl = Math.round(ozToMl(oz));
  }
  const left = numberField(details.pumpLeftOz);
  const right = numberField(details.pumpRightOz);
  details.totalOz = Number((left + right).toFixed(2));
  details.totalMl = Math.round(ozToMl(left + right));
  return { ...draft, details };
}

export function setWeight(draft: LogDraft, value: number, unit: "kg" | "lb") {
  const kg = unit === "kg" ? value : value / 2.20462;
  const details = { ...draft.details, weightKg: Number(kg.toFixed(3)) };
  details.weightLb = Number(kgToLb(kg).toFixed(2));
  return { ...draft, details };
}

export function setLength(
  draft: LogDraft,
  field: "height" | "head",
  value: number,
  unit: "cm" | "in",
) {
  const cm = unit === "cm" ? value : value * 2.54;
  const details = { ...draft.details };
  if (field === "height") {
    details.heightCm = Number(cm.toFixed(2));
    details.heightIn = Number(cmToIn(cm).toFixed(2));
  } else {
    details.headCm = Number(cm.toFixed(2));
    details.headIn = Number(cmToIn(cm).toFixed(2));
  }
  return { ...draft, details };
}

export function setTemperature(
  draft: LogDraft,
  value: number,
  unit: "C" | "F",
) {
  const c = unit === "C" ? value : (value - 32) / 1.8;
  return {
    ...draft,
    details: {
      ...draft.details,
      temperatureC: Number(c.toFixed(2)),
      temperatureF: Number((c * 1.8 + 32).toFixed(2)),
    },
  };
}

export function setSleepSubtype(draft: LogDraft, subtype: SleepSubtype): LogDraft {
  return { ...draft, subtype };
}

export function amountFromMl(ml: number) {
  return mlToOz(ml);
}
