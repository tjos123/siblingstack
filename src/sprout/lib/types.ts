export const CATEGORIES = [
  "feed",
  "pump",
  "diaper",
  "sleep",
  "routine",
  "milestone",
  "growth",
  "health",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const FEED_SUBTYPES = [
  "breastfeeding",
  "bottlefeed",
  "solid",
  "combo",
] as const;
export type FeedSubtype = (typeof FEED_SUBTYPES)[number];

export const BOTTLE_TYPES = ["formula", "expressed", "mixed"] as const;
export type BottleType = (typeof BOTTLE_TYPES)[number];

export const DIAPER_SUBTYPES = ["wet", "dirty", "both", "dry"] as const;
export type DiaperSubtype = (typeof DIAPER_SUBTYPES)[number];

export const SLEEP_SUBTYPES = ["nap", "night"] as const;
export type SleepSubtype = (typeof SLEEP_SUBTYPES)[number];

export const HEALTH_SUBTYPES = [
  "medical",
  "vaccine",
  "temperature",
  "medication",
] as const;
export type HealthSubtype = (typeof HEALTH_SUBTYPES)[number];

export const ROUTINE_PRESETS = [
  "tummy_time",
  "bath",
  "outdoor_play",
  "massage",
  "reading",
] as const;
export type RoutinePreset = (typeof ROUTINE_PRESETS)[number];

export const MILESTONE_PRESETS = [
  "first_smile",
  "first_laugh",
  "first_rollover",
  "first_word",
  "first_tooth",
  "first_steps",
  "sitting_up",
  "crawling",
] as const;
export type MilestonePreset = (typeof MILESTONE_PRESETS)[number];

export type BreastSide = "left" | "right" | "both";

export type BabySex = "female" | "male";

export type VolumeUnit = "oz" | "ml";
export type WeightUnit = "kg" | "lb";
export type LengthUnit = "cm" | "in";
export type TemperatureUnit = "C" | "F";

export interface UnitPreferences {
  volume: VolumeUnit;
  weight: WeightUnit;
  length: LengthUnit;
  temperature: TemperatureUnit;
}

export interface LogDetails {
  notes?: string;
  caregiver?: string;
  // feed
  breastSide?: BreastSide;
  leftDurationSec?: number;
  rightDurationSec?: number;
  durationSec?: number;
  durationMin?: number;
  bottleAmountOz?: number;
  bottleAmountMl?: number;
  bottleType?: BottleType;
  bottleBrand?: string;
  food?: string;
  // pump
  pumpLeftOz?: number;
  pumpRightOz?: number;
  pumpLeftMl?: number;
  pumpRightMl?: number;
  totalOz?: number;
  totalMl?: number;
  // sleep / routine
  routineName?: string;
  // milestone
  milestoneTitle?: string;
  title?: string;
  photo?: string;
  // growth
  weightKg?: number;
  weightLb?: number;
  heightCm?: number;
  heightIn?: number;
  headCm?: number;
  headIn?: number;
  // health
  medicationName?: string;
  medicationDose?: string;
  vaccineName?: string;
  temperatureC?: number;
  temperatureF?: number;
  symptoms?: string;
  [key: string]: unknown;
}

export interface Log {
  id: string;
  babyId: string;
  userId: string;
  category: Category;
  subtype: string | null;
  feedSubtype?: FeedSubtype | null;
  diaperSubtype?: DiaperSubtype | null;
  healthSubtype?: HealthSubtype | null;
  startTime: string;
  endTime: string | null;
  details: LogDetails;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
  syncedAt?: string | null;
  // Per-field hybrid logical clocks, keyed by server field name
  // (e.g. "start_time", "details.bottleAmountOz"). See lib/hlc.ts.
  clocks?: Record<string, string>;
  householdId?: string | null;
}

export type NewLog = Omit<
  Log,
  "id" | "createdAt" | "updatedAt" | "babyId" | "userId"
> & {
  id?: string;
  babyId?: string;
  userId?: string;
};

export interface Baby {
  id: string;
  name: string;
  birthDate: string;
  avatarEmoji: string;
  color: string;
  sex?: BabySex;
  defaultBottleBrand?: string;
  createdAt: string;
  updatedAt?: string;
  deleted?: boolean;
  syncedAt?: string | null;
  clocks?: Record<string, string>;
  householdId?: string | null;
}

export interface StashState {
  fullBottles: number;
  ozPerBottle: number;
}

export type ThemeMode = "light" | "dark" | "system";

export interface AppSettings {
  id: string;
  nightMode: boolean;
  theme?: ThemeMode;
  units: UnitPreferences;
  defaultSleepType: SleepSubtype;
  haptics: boolean;
  activeBabyId?: string;
  feedReminderMinutes?: number;
  stash?: StashState;
}

export interface TimerState {
  running: boolean;
  startTime: string | null;
  elapsedSec: number;
  side?: BreastSide | null;
  startedAt?: string;
}

export interface TimersMap {
  nursing: TimerState;
  pumping: TimerState;
  sleep: TimerState;
}

export type TimerKind = keyof TimersMap;

export type ActiveView =
  | "tracker"
  | "timeline"
  | "trends"
  | "milestones"
  | "account"
  | "tools";
