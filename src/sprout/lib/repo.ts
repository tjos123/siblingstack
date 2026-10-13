import { getDB, SETTINGS_ID } from "./db";
import { nextHlc } from "./hlc";
import type {
  AppSettings,
  Baby,
  Log,
  LogDetails,
  NewLog,
  UnitPreferences,
} from "./types";
import { uid } from "./utils";

const USER_KEY = "sprout_user_id";

// Local model key -> server column name. Clock keys use the server names so
// the SQL merge in 008_sprout_merge.sql can compare them directly.
const BABY_FIELDS: Record<string, string> = {
  name: "name",
  birthDate: "birth_date",
  avatarEmoji: "avatar_emoji",
  color: "color",
  sex: "sex",
  defaultBottleBrand: "default_bottle_brand",
  deleted: "deleted",
};

const LOG_FIELDS: Record<string, string> = {
  category: "category",
  subtype: "subtype",
  feedSubtype: "feed_subtype",
  diaperSubtype: "diaper_subtype",
  healthSubtype: "health_subtype",
  startTime: "start_time",
  endTime: "end_time",
  deleted: "deleted",
};

function sameValue(a: unknown, b: unknown): boolean {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

function stampAll(fields: string[]): Record<string, string> {
  const clocks: Record<string, string> = {};
  for (const field of fields) clocks[field] = nextHlc();
  return clocks;
}

export function localUserId(): string {
  if (typeof window === "undefined") return "local";
  let id = window.localStorage.getItem(USER_KEY);
  if (!id) {
    id = uid("user");
    window.localStorage.setItem(USER_KEY, id);
  }
  return id;
}

export const DEFAULT_UNITS: UnitPreferences = {
  volume: "oz",
  weight: "kg",
  length: "cm",
  temperature: "C",
};

export const DEFAULT_FEED_REMINDER_MIN = 180;

export function defaultSettings(): AppSettings {
  return {
    id: SETTINGS_ID,
    nightMode: false,
    theme: "system",
    units: { ...DEFAULT_UNITS },
    defaultSleepType: "nap",
    haptics: true,
    activeBabyId: undefined,
    feedReminderMinutes: DEFAULT_FEED_REMINDER_MIN,
    stash: { fullBottles: 0, ozPerBottle: 4 },
  };
}

export function defaultBaby(): Baby {
  const now = new Date().toISOString();
  return {
    id: uid("baby"),
    name: "Baby",
    birthDate: now.slice(0, 10),
    avatarEmoji: "🌱",
    color: "sage",
    sex: undefined,
    createdAt: now,
    updatedAt: now,
    deleted: false,
    syncedAt: null,
    clocks: {},
    householdId: null,
  };
}

export async function getSettings(): Promise<AppSettings> {
  const db = getDB();
  const existing = await db.settings.get(SETTINGS_ID);
  if (existing) return { ...defaultSettings(), ...existing };
  const settings = defaultSettings();
  await db.settings.put(settings);
  return settings;
}

export async function createBaby(baby: Partial<Baby> = {}): Promise<Baby> {
  const db = getDB();
  const now = new Date().toISOString();
  const created: Baby = {
    ...defaultBaby(),
    ...baby,
    createdAt: baby.createdAt ?? now,
    updatedAt: now,
    deleted: false,
    syncedAt: null,
    clocks: stampAll(Object.values(BABY_FIELDS)),
  };
  await db.babies.put(created);
  return created;
}

export async function saveSettings(patch: Partial<AppSettings>) {
  const db = getDB();
  const current = await getSettings();
  const next = { ...current, ...patch, id: SETTINGS_ID };
  await db.settings.put(next);
  return next;
}

export async function getBabies(): Promise<Baby[]> {
  const db = getDB();
  return db.babies.orderBy("createdAt").toArray();
}

export async function getPrimaryBaby(): Promise<Baby> {
  const babies = await getBabies();
  if (babies.length > 0) return babies[0];
  const baby = defaultBaby();
  await saveBaby(baby);
  return baby;
}

// Adopt a baby that someone else created (from a household invite): stores it
// under its real id so both devices track the SAME row. Any local duplicate
// (same name + birth date, different id) is merged by re-keying its logs onto
// the joined baby, then removed — so a device that already had the baby as a
// local profile doesn't end up with two parallel timelines.
export async function adoptBaby(baby: Partial<Baby> & { id: string }): Promise<Baby> {
  const db = getDB();
  const now = new Date().toISOString();

  const existingById = await db.babies.get(baby.id);

  const rawDupe = baby.name && baby.birthDate
    ? await db.babies.filter(
        (b) =>
          b.id !== baby.id &&
          b.name === baby.name &&
          b.birthDate === baby.birthDate,
      ).toArray()
    : [];

  for (const dupe of rawDupe) {
    if (dupe.deleted) continue;
    await db.logs
      .where("babyId")
      .equals(dupe.id)
      .modify((log) => {
        log.babyId = baby.id;
        log.syncedAt = null;
        log.updatedAt = now;
      });
    await db.babies.delete(dupe.id);
  }

  const clocks = existingById
    ? { ...(existingById.clocks ?? {}) }
    : stampAll(Object.values(BABY_FIELDS));

  const merged: Baby = {
    ...(existingById ?? defaultBaby()),
    ...baby,
    createdAt: baby.createdAt ?? existingById?.createdAt ?? now,
    updatedAt: now,
    deleted: false,
    syncedAt: null,
    clocks,
    householdId: baby.householdId ?? existingById?.householdId ?? null,
  };
  await db.babies.put(merged);
  return merged;
}

export async function saveBaby(baby: Baby) {
  const db = getDB();
  const existing = await db.babies.get(baby.id);
  const now = new Date().toISOString();

  if (!existing) {
    const created: Baby = {
      ...baby,
      updatedAt: now,
      deleted: baby.deleted ?? false,
      syncedAt: null,
      clocks: { ...stampAll(Object.values(BABY_FIELDS)), ...(baby.clocks ?? {}) },
    };
    await db.babies.put(created);
    return created;
  }

  const clocks = { ...(existing.clocks ?? {}) };
  let changed = false;
  for (const [localKey, serverKey] of Object.entries(BABY_FIELDS)) {
    const next = (baby as unknown as Record<string, unknown>)[localKey];
    const prev = (existing as unknown as Record<string, unknown>)[localKey];
    if (!sameValue(next, prev)) {
      clocks[serverKey] = nextHlc();
      changed = true;
    }
  }

  const merged: Baby = changed
    ? { ...baby, clocks, updatedAt: now, syncedAt: null }
    : {
        ...baby,
        clocks: existing.clocks,
        updatedAt: existing.updatedAt,
        syncedAt: existing.syncedAt,
      };
  await db.babies.put(merged);
  return merged;
}

export async function ensureSeed() {
  const db = getDB();
  const count = await db.babies.count();
  if (count === 0) {
    await db.babies.put(defaultBaby());
  }
  const settings = await db.settings.get(SETTINGS_ID);
  if (!settings) {
    await db.settings.put(defaultSettings());
  }
}

export interface CreateLogContext {
  babyId: string;
  userId?: string;
}

export async function createLog(
  input: NewLog,
  ctx: CreateLogContext,
): Promise<Log> {
  const db = getDB();
  const now = new Date().toISOString();
  const details = input.details ?? {};
  const clocks = stampAll(Object.values(LOG_FIELDS));
  for (const key of Object.keys(details)) clocks[`details.${key}`] = nextHlc();

  const log: Log = {
    id: input.id ?? uid("log"),
    babyId: input.babyId ?? ctx.babyId,
    userId: input.userId ?? ctx.userId ?? localUserId(),
    category: input.category,
    subtype: input.subtype ?? null,
    feedSubtype: input.feedSubtype ?? null,
    diaperSubtype: input.diaperSubtype ?? null,
    healthSubtype: input.healthSubtype ?? null,
    startTime: input.startTime ?? now,
    endTime: input.endTime ?? null,
    details,
    createdAt: now,
    updatedAt: now,
    deleted: false,
    syncedAt: null,
    clocks,
    householdId: null,
  };
  await db.logs.put(log);
  return log;
}

export async function updateLog(
  id: string,
  patch: Partial<Omit<Log, "id" | "createdAt">>,
) {
  const db = getDB();
  const current = await db.logs.get(id);
  if (!current) return;

  const clocks = { ...(current.clocks ?? {}) };
  const now = new Date().toISOString();
  const next: Partial<Log> = {};
  let changed = false;

  for (const [localKey, serverKey] of Object.entries(LOG_FIELDS)) {
    if (!(localKey in patch)) continue;
    const value = (patch as unknown as Record<string, unknown>)[localKey];
    if (!sameValue(value, (current as unknown as Record<string, unknown>)[localKey])) {
      (next as unknown as Record<string, unknown>)[localKey] = value;
      clocks[serverKey] = nextHlc();
      changed = true;
    }
  }

  if (patch.details) {
    const merged = { ...(current.details ?? {}), ...patch.details };
    const keys = new Set([
      ...Object.keys(current.details ?? {}),
      ...Object.keys(patch.details),
    ]);
    for (const key of keys) {
      const value = (patch.details as unknown as Record<string, unknown>)[key];
      const prev = (current.details as unknown as Record<string, unknown>)[key];
      if (!sameValue(value, prev)) {
        clocks[`details.${key}`] = nextHlc();
        changed = true;
      }
    }
    next.details = merged;
  }

  await db.logs.update(id, {
    ...next,
    clocks,
    updatedAt: changed ? now : current.updatedAt,
    syncedAt: changed ? null : current.syncedAt,
  });
}

export async function updateLogDetails(id: string, details: Partial<LogDetails>) {
  await updateLog(id, { details: details as Log["details"] });
}

export async function deleteLog(id: string) {
  await updateLog(id, { deleted: true });
}

export async function restoreLog(id: string) {
  await updateLog(id, { deleted: false });
}

export async function purgeLog(id: string) {
  const db = getDB();
  await db.logs.delete(id);
}

export async function clearAllLogs() {
  const db = getDB();
  await db.logs.clear();
}

export async function wipeEverything() {
  const db = getDB();
  await db.logs.clear();
  await db.babies.clear();
  await db.settings.clear();
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem("sprout_timers");
    window.localStorage.removeItem("sprout_active_baby");
  }
}

export async function countLogs() {
  const db = getDB();
  return db.logs.filter((log) => !log.deleted).count();
}

export async function exportData() {
  const db = getDB();
  const [logs, babies, settings] = await Promise.all([
    db.logs.toArray(),
    db.babies.toArray(),
    db.settings.toArray(),
  ]);
  return {
    app: "sprout-baby",
    version: 1,
    exportedAt: new Date().toISOString(),
    logs,
    babies,
    settings,
  };
}

export async function importData(payload: {
  logs?: Log[];
  babies?: Baby[];
  settings?: AppSettings[];
}) {
  const db = getDB();
  await db.transaction("rw", db.logs, db.babies, db.settings, async () => {
    if (payload.logs?.length) await db.logs.bulkPut(payload.logs);
    if (payload.babies?.length) await db.babies.bulkPut(payload.babies);
    if (payload.settings?.length) await db.settings.bulkPut(payload.settings);
  });
}

export async function loadSampleData(baby: Baby) {
  const db = getDB();
  const now = Date.now();
  const minutesAgo = (m: number) => new Date(now - m * 60000).toISOString();
  const uidStr = localUserId();
  const base = {
    babyId: baby.id,
    userId: uidStr,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deleted: false,
    syncedAt: null,
  } as const;

  const sample: Log[] = [
    {
      ...base,
      id: uid("log"),
      category: "feed",
      subtype: "breastfeeding",
      feedSubtype: "breastfeeding",
      diaperSubtype: null,
      healthSubtype: null,
      startTime: minutesAgo(85),
      endTime: minutesAgo(67),
      details: {
        breastSide: "left",
        durationMin: 18,
        durationSec: 1080,
        notes: "Calm, good latch",
      },
    },
    {
      ...base,
      id: uid("log"),
      category: "diaper",
      subtype: "wet",
      feedSubtype: null,
      diaperSubtype: "wet",
      healthSubtype: null,
      startTime: minutesAgo(190),
      endTime: null,
      details: { notes: "Quick change" },
    },
    {
      ...base,
      id: uid("log"),
      category: "sleep",
      subtype: "nap",
      feedSubtype: null,
      diaperSubtype: null,
      healthSubtype: null,
      startTime: minutesAgo(320),
      endTime: minutesAgo(200),
      details: { durationMin: 120, notes: "Slept in the bassinet" },
    },
    {
      ...base,
      id: uid("log"),
      category: "pump",
      subtype: "expressed",
      feedSubtype: null,
      diaperSubtype: null,
      healthSubtype: null,
      startTime: minutesAgo(450),
      endTime: minutesAgo(435),
      details: {
        pumpLeftOz: 2.5,
        pumpRightOz: 3,
        pumpLeftMl: 73.9,
        pumpRightMl: 88.7,
        totalOz: 5.5,
        totalMl: 162.6,
        durationMin: 15,
      },
    },
    {
      ...base,
      id: uid("log"),
      category: "milestone",
      subtype: "first_smile",
      feedSubtype: null,
      diaperSubtype: null,
      healthSubtype: null,
      startTime: minutesAgo(60 * 20),
      endTime: null,
      details: {
        milestoneTitle: "First Social Smile",
        title: "First Social Smile",
        photo: "😊",
        notes: "Smiled at grandma during morning play",
      },
    },
    {
      ...base,
      id: uid("log"),
      category: "routine",
      subtype: "tummy_time",
      feedSubtype: null,
      diaperSubtype: null,
      healthSubtype: null,
      startTime: minutesAgo(60 * 24),
      endTime: minutesAgo(60 * 24 - 12),
      details: { routineName: "tummy_time", durationMin: 12, notes: "Held head up high" },
    },
    {
      ...base,
      id: uid("log"),
      category: "growth",
      subtype: "measurement",
      feedSubtype: null,
      diaperSubtype: null,
      healthSubtype: null,
      startTime: minutesAgo(60 * 72),
      endTime: null,
      details: { weightKg: 6.2, heightCm: 61, headCm: 40.5 },
    },
    {
      ...base,
      id: uid("log"),
      category: "health",
      subtype: "vaccine",
      feedSubtype: null,
      diaperSubtype: null,
      healthSubtype: "vaccine",
      startTime: minutesAgo(60 * 48),
      endTime: null,
      details: {
        vaccineName: "2-Month Routine Immunisations",
        temperatureC: 36.8,
        notes: "Mild fussiness, no fever",
      },
    },
  ];

  await db.logs.bulkPut(sample);
  return sample.length;
}
