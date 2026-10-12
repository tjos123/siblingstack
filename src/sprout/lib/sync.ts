// src/sprout/lib/sync.ts
//
// Two-way sync between the local Sprout IndexedDB and the Supabase
// sprout_babies / sprout_logs tables (see migrations 006-008).
//
// Strategy: local-first. The device is always the source of truth for its own
// offline writes. On sync we (1) pull everything changed since our last cursor
// and merge it into IndexedDB field-by-field using HLC clocks, then (2) push
// every row that is still dirty through the server-side merge RPC, then (3)
// adopt the canonical rows coming back. Field-level merge means two phones can
// edit different fields of the same log without clobbering each other.

import { supabase } from "@/lib/supabase";
import type { SproutDB } from "./db";
import {
  babyToServer,
  isDirtyBaby,
  isDirtyLog,
  logToServer,
  mergeRemoteBaby,
  mergeRemoteLog,
  observeClocks,
  serverToBaby,
  serverToLog,
  type Row,
} from "./merge";

// ── pull ──────────────────────────────────────────────────────────────
async function pullSince(db: SproutDB, householdId: string, cursor: string): Promise<number> {
  const [{ data: babyRows, error: babyError }, { data: logRows, error: logError }] =
    await Promise.all([
      supabase
        .from("sprout_babies")
        .select("*")
        .eq("household_id", householdId)
        .gt("updated_at", cursor),
      supabase
        .from("sprout_logs")
        .select("*")
        .eq("household_id", householdId)
        .gt("updated_at", cursor),
    ]);

  if (babyError) throw babyError;
  if (logError) throw logError;

  let count = 0;

  for (const row of (babyRows ?? []) as Row[]) {
    observeClocks(row.clocks);
    const remote = serverToBaby(row);
    const local = await db.babies.get(remote.id);
    await db.babies.put(local ? mergeRemoteBaby(local, remote) : remote);
    count += 1;
  }

  for (const row of (logRows ?? []) as Row[]) {
    observeClocks(row.clocks);
    const remote = serverToLog(row);
    const local = await db.logs.get(remote.id);
    await db.logs.put(local ? mergeRemoteLog(local, remote) : remote);
    count += 1;
  }

  return count;
}

// ── push ──────────────────────────────────────────────────────────────
async function pushDirty(db: SproutDB, householdId: string, userId: string): Promise<number> {
  const [babies, logs] = await Promise.all([db.babies.toArray(), db.logs.toArray()]);
  const dirtyBabies = babies.filter(isDirtyBaby);
  const dirtyLogs = logs.filter(isDirtyLog);

  if (dirtyBabies.length === 0 && dirtyLogs.length === 0) return 0;

  const startedAt = new Date().toISOString();

  const { data, error } = await supabase.rpc("sprout_merge", {
    p_payload: {
      babies: dirtyBabies.map((baby) => babyToServer(baby, householdId)),
      logs: dirtyLogs.map((log) => logToServer(log, householdId, userId)),
    },
  });
  if (error) throw error;

  const merged = (data ?? {}) as { babies?: Row[]; logs?: Row[] };

  for (const row of merged.babies ?? []) {
    observeClocks(row.clocks);
    const local = await db.babies.get(row.id);
    if (local && (local.updatedAt ?? local.createdAt) > startedAt) continue;
    await db.babies.put(serverToBaby(row));
  }

  for (const row of merged.logs ?? []) {
    observeClocks(row.clocks);
    const local = await db.logs.get(row.id);
    if (local && local.updatedAt > startedAt) continue;
    await db.logs.put(serverToLog(row));
  }

  return dirtyBabies.length + dirtyLogs.length;
}

// ── orchestrator ──────────────────────────────────────────────────────
export interface SyncResult {
  pushed: number;
  pulled: number;
}

const cursorKey = (householdId: string) => `sprout_sync_cursor_${householdId}`;

export function lastCursor(householdId: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(cursorKey(householdId));
}

export async function syncOnce(
  db: SproutDB,
  householdId: string,
  userId: string,
): Promise<SyncResult> {
  const cursor = lastCursor(householdId) ?? new Date(0).toISOString();
  const startedAt = new Date().toISOString();

  const pulled = await pullSince(db, householdId, cursor);
  const pushed = await pushDirty(db, householdId, userId);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(cursorKey(householdId), startedAt);
  }

  return { pushed, pulled };
}
