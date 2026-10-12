// src/sprout/lib/merge.ts
//
// Pure, side-effect-free conversion + merge helpers shared by the sync engine
// (sync.ts) and unit tests. Kept free of any Supabase/IndexedDB imports so it
// can run anywhere.
//
// Field-level last-write-wins: a remote field only replaces a local one when
// its HLC clock is strictly greater (see hlc.ts). The exact same comparison
// runs server-side in 008_sprout_merge.sql.

import { isNewer, observeHlc } from "./hlc";
import type { Baby, Log } from "./types";

export type Row = Record<string, any>;

export const LOG_FIELD_MAP: Record<string, string> = {
  category: "category",
  subtype: "subtype",
  feedSubtype: "feed_subtype",
  diaperSubtype: "diaper_subtype",
  healthSubtype: "health_subtype",
  startTime: "start_time",
  endTime: "end_time",
  deleted: "deleted",
};

export const BABY_FIELD_MAP: Record<string, string> = {
  name: "name",
  birthDate: "birth_date",
  avatarEmoji: "avatar_emoji",
  color: "color",
  sex: "sex",
  defaultBottleBrand: "default_bottle_brand",
  deleted: "deleted",
};

export function observeClocks(clocks: Record<string, string> | undefined | null) {
  if (!clocks) return;
  for (const value of Object.values(clocks)) observeHlc(value);
}

// ── local -> server ───────────────────────────────────────────────────
export function logToServer(log: Log, householdId: string, userId: string) {
  return {
    id: log.id,
    household_id: householdId,
    baby_id: log.babyId,
    user_id: userId,
    category: log.category,
    subtype: log.subtype ?? null,
    feed_subtype: log.feedSubtype ?? null,
    diaper_subtype: log.diaperSubtype ?? null,
    health_subtype: log.healthSubtype ?? null,
    start_time: log.startTime,
    end_time: log.endTime ?? null,
    details: log.details ?? {},
    created_at: log.createdAt,
    deleted: log.deleted ?? false,
    clocks: log.clocks ?? {},
  };
}

export function babyToServer(baby: Baby, householdId: string) {
  return {
    id: baby.id,
    household_id: householdId,
    name: baby.name,
    birth_date: baby.birthDate,
    avatar_emoji: baby.avatarEmoji,
    color: baby.color,
    sex: baby.sex ?? null,
    default_bottle_brand: baby.defaultBottleBrand ?? null,
    created_at: baby.createdAt,
    deleted: baby.deleted ?? false,
    clocks: baby.clocks ?? {},
  };
}

// ── server -> local ───────────────────────────────────────────────────
export function serverToLog(row: Row): Log {
  return {
    id: row.id,
    babyId: row.baby_id,
    userId: row.user_id ?? "",
    category: row.category,
    subtype: row.subtype ?? null,
    feedSubtype: row.feed_subtype ?? null,
    diaperSubtype: row.diaper_subtype ?? null,
    healthSubtype: row.health_subtype ?? null,
    startTime: row.start_time,
    endTime: row.end_time ?? null,
    details: row.details ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deleted: row.deleted ?? false,
    syncedAt: row.updated_at,
    clocks: row.clocks ?? {},
    householdId: row.household_id,
  };
}

export function serverToBaby(row: Row): Baby {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    avatarEmoji: row.avatar_emoji,
    color: row.color,
    sex: row.sex ?? undefined,
    defaultBottleBrand: row.default_bottle_brand ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deleted: row.deleted ?? false,
    syncedAt: row.updated_at,
    clocks: row.clocks ?? {},
    householdId: row.household_id,
  };
}

// ── dirty detection ───────────────────────────────────────────────────
export function isDirtyLog(log: Log): boolean {
  return !log.syncedAt || log.updatedAt > log.syncedAt;
}

export function isDirtyBaby(baby: Baby): boolean {
  if (!baby.syncedAt) return true;
  const updated = baby.updatedAt ?? baby.createdAt;
  return updated > baby.syncedAt;
}

// ── field-level merge (remote into local) ─────────────────────────────
export function mergeRemoteLog(local: Log, remote: Log): Log {
  const clocks = { ...(local.clocks ?? {}) };
  const out: Log = { ...local };

  for (const [localKey, serverKey] of Object.entries(LOG_FIELD_MAP)) {
    const remoteClock = remote.clocks?.[serverKey];
    if (isNewer(remoteClock, clocks[serverKey])) {
      (out as Row)[localKey] = (remote as Row)[localKey];
      if (remoteClock) clocks[serverKey] = remoteClock;
    }
  }

  const localDetails = local.details ?? {};
  const remoteDetails = remote.details ?? {};
  const mergedDetails: Record<string, unknown> = { ...localDetails };
  const keys = new Set([...Object.keys(localDetails), ...Object.keys(remoteDetails)]);
  for (const key of keys) {
    const clockKey = `details.${key}`;
    const remoteClock = remote.clocks?.[clockKey];
    if (isNewer(remoteClock, clocks[clockKey])) {
      mergedDetails[key] = remoteDetails[key];
      if (remoteClock) clocks[clockKey] = remoteClock;
    }
  }

  out.details = mergedDetails as Log["details"];
  out.clocks = clocks;
  out.householdId = remote.householdId;

  const localDirty = isDirtyLog(local);
  out.syncedAt = localDirty ? local.syncedAt ?? null : remote.syncedAt;
  out.updatedAt = localDirty ? local.updatedAt : remote.updatedAt;
  return out;
}

export function mergeRemoteBaby(local: Baby, remote: Baby): Baby {
  const clocks = { ...(local.clocks ?? {}) };
  const out: Baby = { ...local };

  for (const [localKey, serverKey] of Object.entries(BABY_FIELD_MAP)) {
    const remoteClock = remote.clocks?.[serverKey];
    if (isNewer(remoteClock, clocks[serverKey])) {
      (out as Row)[localKey] = (remote as Row)[localKey];
      if (remoteClock) clocks[serverKey] = remoteClock;
    }
  }

  out.clocks = clocks;
  out.householdId = remote.householdId;
  const localDirty = isDirtyBaby(local);
  out.syncedAt = localDirty ? local.syncedAt ?? null : remote.syncedAt;
  out.updatedAt = localDirty ? local.updatedAt : remote.updatedAt;
  return out;
}
