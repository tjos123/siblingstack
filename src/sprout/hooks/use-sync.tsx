"use client";

import { useLiveQuery } from "dexie-react-hooks";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { createHousehold as createHouseholdDb } from "@/lib/db/households";
import { useHousehold } from "@/lib/use-household";
import { getDB } from "@/sprout/lib/db";
import { isDirtyBaby, isDirtyLog } from "@/sprout/lib/merge";
import { syncOnce } from "@/sprout/lib/sync";
import { describeSyncError } from "@/sprout/lib/sync-error";

export type SyncStatus =
  | "signed-out"
  | "no-household"
  | "idle"
  | "syncing"
  | "synced"
  | "error"
  | "offline";

interface SyncContextValue {
  status: SyncStatus;
  pending: number;
  lastSyncedAt: string | null;
  error: string | null;
  householdId: string | null;
  signedIn: boolean;
  autoSync: boolean;
  setAutoSync: (value: boolean) => void;
  requestSync: () => void;
  createHousehold: (name: string) => Promise<void>;
}

const SyncContext = createContext<SyncContextValue | null>(null);

const POLL_INTERVAL_MS = 30_000;
// Don't hammer the server if a sync keeps failing; wait at least this long
// between attempts triggered by local changes.
const MIN_RETRY_MS = 5_000;

// Device-level preference: when off, nothing syncs until the user taps
// "Sync now". Stored in localStorage so it survives reloads; read through
// useSyncExternalStore to stay hydration-safe.
const AUTO_SYNC_KEY = "sprout_auto_sync_v1";
const AUTO_SYNC_EVENT = "sprout-auto-sync-change";

function subscribeAutoSync(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(AUTO_SYNC_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(AUTO_SYNC_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function readAutoSync(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(AUTO_SYNC_KEY) !== "0";
  } catch {
    return true;
  }
}

export function SyncProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { householdId, loading: householdLoading, refresh: refreshHousehold } =
    useHousehold();

  const [syncState, setSyncState] = useState<SyncStatus>("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const runningRef = useRef(false);
  const lastAttemptRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const autoSync = useSyncExternalStore(subscribeAutoSync, readAutoSync, () => true);
  const setAutoSync = useCallback((value: boolean) => {
    try {
      window.localStorage.setItem(AUTO_SYNC_KEY, value ? "1" : "0");
      window.dispatchEvent(new Event(AUTO_SYNC_EVENT));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const pending =
    useLiveQuery(
      async () => {
        const db = getDB();
        const [babies, logs] = await Promise.all([
          db.babies.toArray(),
          db.logs.toArray(),
        ]);
        return (
          babies.filter(isDirtyBaby).length + logs.filter(isDirtyLog).length
        );
      },
      [],
      0,
    ) ?? 0;

  const runSync = useCallback(async () => {
    if (!user || !householdId) return;
    if (runningRef.current) return;
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setSyncState("offline");
      return;
    }
    runningRef.current = true;
    lastAttemptRef.current = Date.now();
    setSyncState("syncing");
    setError(null);
    try {
      await syncOnce(getDB(), householdId, user.id);
      setLastSyncedAt(new Date().toISOString());
      setSyncState("synced");
    } catch (e) {
      const message = describeSyncError(e);
      const raw =
        e && typeof e === "object"
          ? {
              name: (e as { name?: unknown }).name,
              code: (e as { code?: unknown }).code,
              status: (e as { status?: unknown }).status,
              keys: Object.getOwnPropertyNames(e),
            }
          : { value: e };
      console.error(`[sprout] sync failed: ${message}`, raw, e);
      setError(message);
      setSyncState("error");
    } finally {
      runningRef.current = false;
    }
  }, [user, householdId]);

  const requestSync = useCallback(() => {
    void runSync();
  }, [runSync]);

  // Debounced auto-sync: local writes bump `pending`, which schedules a push
  // shortly after — no need to tap "Sync now". The cooldown prevents a tight
  // retry loop if the server keeps rejecting.
  const scheduleSync = useCallback(
    (delayMs = 700) => {
      if (typeof window === "undefined") return;
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      const elapsed = Date.now() - lastAttemptRef.current;
      const wait = Math.max(delayMs, MIN_RETRY_MS - elapsed);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        void runSync();
      }, wait);
    },
    [runSync],
  );

  const createHousehold = useCallback(
    async (name: string) => {
      if (!user) throw new Error("Sign in first");
      await createHouseholdDb(user.id, name.trim() || "Our household");
      await refreshHousehold();
    },
    [user, refreshHousehold],
  );

  // Signed-out / no-household are derived so we never set state in an effect.
  const status: SyncStatus = useMemo(() => {
    if (!user) return "signed-out";
    if (!householdLoading && !householdId) return "no-household";
    return syncState;
  }, [user, householdId, householdLoading, syncState]);

  // Run on sign-in / household change and when the tab regains focus.
  useEffect(() => {
    if (!user || !householdId || !autoSync) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void runSync();
    const onVisible = () => {
      if (document.visibilityState === "visible") void runSync();
    };
    const onOnline = () => void runSync();
    const onOffline = () => setSyncState("offline");
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    const interval = window.setInterval(() => void runSync(), POLL_INTERVAL_MS);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.clearInterval(interval);
    };
  }, [user, householdId, runSync, autoSync]);

  // Push as soon as this device has unsynced changes.
  useEffect(() => {
    if (!user || !householdId || !autoSync) {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    if (pending > 0) scheduleSync();
  }, [pending, user, householdId, scheduleSync, autoSync]);

  // Cancel any pending scheduled sync on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  // Realtime: pull as soon as another caregiver's device writes.
  useEffect(() => {
    if (!householdId || !autoSync) return;
    const channel = supabase
      .channel(`sprout-sync-${householdId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sprout_logs",
          filter: `household_id=eq.${householdId}`,
        },
        () => requestSync(),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sprout_babies",
          filter: `household_id=eq.${householdId}`,
        },
        () => requestSync(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [householdId, requestSync, autoSync]);

  const value: SyncContextValue = {
    status,
    pending,
    lastSyncedAt,
    error,
    householdId,
    signedIn: Boolean(user),
    autoSync,
    setAutoSync,
    requestSync,
    createHousehold,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error("useSync must be used within a SyncProvider");
  return ctx;
}
