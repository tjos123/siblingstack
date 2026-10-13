"use client";

import { useLiveQuery } from "dexie-react-hooks";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getDB, SETTINGS_ID } from "@/sprout/lib/db";
import * as repo from "@/sprout/lib/repo";
import type {
  AppSettings,
  Baby,
  Log,
  NewLog,
  ThemeMode,
  UnitPreferences,
} from "@/sprout/lib/types";

function subscribeSystemDark(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => undefined;
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSystemDark() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function usePrefersDark() {
  return useSyncExternalStore(subscribeSystemDark, getSystemDark, () => false);
}

interface DataContextValue {
  ready: boolean;
  baby: Baby | null;
  babies: Baby[];
  logs: Log[];
  settings: AppSettings;
  logCount: number;
  theme: ThemeMode;
  nightMode: boolean;
  addLog: (input: NewLog) => Promise<Log>;
  saveLogEdit: (id: string, input: NewLog) => Promise<void>;
  editLog: (id: string, patch: Partial<Log>) => Promise<void>;
  editLogDetails: (id: string, details: Log["details"]) => Promise<void>;
  removeLog: (id: string) => Promise<void>;
  updateBaby: (patch: Partial<Baby>) => Promise<void>;
  setActiveBaby: (id: string) => Promise<void>;
  addBaby: (patch?: Partial<Baby>) => Promise<Baby>;
  adoptBaby: (patch: Partial<Baby> & { id: string }) => Promise<Baby>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  setUnits: (patch: Partial<UnitPreferences>) => Promise<void>;
  setTheme: (value: ThemeMode) => Promise<void>;
  loadSampleData: () => Promise<number>;
  wipeAll: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    repo
      .ensureSeed()
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const logs = useLiveQuery(
    async () => {
      const db = getDB();
      return db.logs.orderBy("startTime").reverse().toArray();
    },
    [],
    [] as Log[],
  );

  const babies = useLiveQuery(
    async () => {
      const db = getDB();
      return db.babies.orderBy("createdAt").toArray();
    },
    [],
    [] as Baby[],
  );

  const settingsRow = useLiveQuery(
    async () => {
      const db = getDB();
      return db.settings.get(SETTINGS_ID);
    },
    [],
    undefined as AppSettings | undefined,
  );

  const sortedBabies = useMemo(
    () => [...(babies ?? [])].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [babies],
  );
  const settings = useMemo(
    () => (settingsRow ? { ...repo.defaultSettings(), ...settingsRow } : repo.defaultSettings()),
    [settingsRow],
  );
  const systemDark = usePrefersDark();
  const theme: ThemeMode =
    settings.theme ?? (settings.nightMode ? "dark" : "system");
  const nightMode = theme === "dark" || (theme === "system" && systemDark);
  const activeBabyId = settings.activeBabyId ?? sortedBabies[0]?.id ?? null;
  const baby = sortedBabies.find((b) => b.id === activeBabyId) ?? null;
  const activeLogs = useMemo(
    () =>
      (logs ?? []).filter(
        (log) => !log.deleted && (!activeBabyId || log.babyId === activeBabyId),
      ),
    [logs, activeBabyId],
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("night", nightMode);
    root.style.colorScheme = nightMode ? "dark" : "light";
    try {
      window.localStorage.setItem("sprout_theme_mode", theme);
      window.localStorage.setItem("sprout_theme", nightMode ? "night" : "light");
    } catch {
      /* ignore */
    }
  }, [nightMode, theme]);

  const addLog = useCallback(
    async (input: NewLog) => {
      const target = baby ?? (await repo.getPrimaryBaby());
      const created = await repo.createLog(input, { babyId: target.id });
      const brand = input.details?.bottleBrand;
      const isBottle =
        input.feedSubtype === "bottlefeed" || input.feedSubtype === "combo";
      if (
        isBottle &&
        typeof brand === "string" &&
        brand.trim() &&
        brand.trim() !== target.defaultBottleBrand
      ) {
        await repo.saveBaby({ ...target, defaultBottleBrand: brand.trim() });
      }
      return created;
    },
    [baby],
  );

  const saveLogEdit = useCallback(
    async (id: string, input: NewLog) => {
      const target = baby ?? (await repo.getPrimaryBaby());
      await repo.updateLog(id, {
        category: input.category,
        subtype: input.subtype ?? null,
        feedSubtype: input.feedSubtype ?? null,
        diaperSubtype: input.diaperSubtype ?? null,
        healthSubtype: input.healthSubtype ?? null,
        startTime: input.startTime ?? new Date().toISOString(),
        endTime: input.endTime ?? null,
        details: input.details ?? {},
      });
      const brand = input.details?.bottleBrand;
      const isBottle =
        input.feedSubtype === "bottlefeed" || input.feedSubtype === "combo";
      if (
        isBottle &&
        typeof brand === "string" &&
        brand.trim() &&
        brand.trim() !== target.defaultBottleBrand
      ) {
        await repo.saveBaby({ ...target, defaultBottleBrand: brand.trim() });
      }
    },
    [baby],
  );

  const editLog = useCallback(
    (id: string, patch: Partial<Log>) => repo.updateLog(id, patch),
    [],
  );

  const editLogDetails = useCallback(
    (id: string, details: Log["details"]) => repo.updateLogDetails(id, details),
    [],
  );

  const removeLog = useCallback((id: string) => repo.deleteLog(id), []);

  const updateBaby = useCallback(
    async (patch: Partial<Baby>) => {
      const current = baby ?? (await repo.getPrimaryBaby());
      await repo.saveBaby({ ...current, ...patch });
    },
    [baby],
  );

  const setActiveBaby = useCallback(async (id: string) => {
    await repo.saveSettings({ activeBabyId: id });
  }, []);

  const addBaby = useCallback(async (patch?: Partial<Baby>) => {
    const created = await repo.createBaby(patch);
    await repo.saveSettings({ activeBabyId: created.id });
    return created;
  }, []);

  const adoptBaby = useCallback(async (patch: Partial<Baby> & { id: string }) => {
    const accepted = await repo.adoptBaby(patch);
    await repo.saveSettings({ activeBabyId: accepted.id });
    return accepted;
  }, []);

  const updateSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      await repo.saveSettings(patch);
    },
    [],
  );

  const setUnits = useCallback(
    async (patch: Partial<UnitPreferences>) => {
      const current = await repo.getSettings();
      await repo.saveSettings({
        units: { ...current.units, ...patch },
      });
    },
    [],
  );

  const setTheme = useCallback(async (value: ThemeMode) => {
    await repo.saveSettings({ theme: value, nightMode: value === "dark" });
  }, []);

  const loadSampleData = useCallback(async () => {
    const primary = baby ?? (await repo.getPrimaryBaby());
    return repo.loadSampleData(primary);
  }, [baby]);

  const wipeAll = useCallback(() => repo.wipeEverything(), []);

  const value: DataContextValue = {
    ready,
    baby,
    babies: sortedBabies,
    logs: activeLogs,
    settings,
    logCount: activeLogs.length,
    theme,
    nightMode,
    addLog,
    saveLogEdit,
    editLog,
    editLogDetails,
    removeLog,
    updateBaby,
    setActiveBaby,
    addBaby,
    adoptBaby,
    updateSettings,
    setUnits,
    setTheme,
    loadSampleData,
    wipeAll,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
