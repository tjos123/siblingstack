"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { BreastSide, TimerKind, TimerState, TimersMap } from "@/sprout/lib/types";

const STORAGE_KEY = "sprout_timers";

const idle = (): TimerState => ({
  running: false,
  startTime: null,
  elapsedSec: 0,
  side: null,
});

const DEFAULTS: TimersMap = {
  nursing: idle(),
  pumping: idle(),
  sleep: idle(),
};

export interface FinishedTimer {
  kind: TimerKind;
  startTime: string;
  endTime: string;
  elapsedSec: number;
  side: BreastSide | null;
}

interface TimersContextValue {
  timers: TimersMap;
  anyRunning: boolean;
  runningKinds: TimerKind[];
  isRunning: (kind: TimerKind) => boolean;
  start: (kind: TimerKind, side?: BreastSide) => void;
  stop: (kind: TimerKind) => FinishedTimer;
  cancel: (kind: TimerKind) => void;
  switchSide: (kind: TimerKind, side: BreastSide) => void;
  reset: () => void;
}

const TimersContext = createContext<TimersContextValue | null>(null);

function readStorage(): TimersMap {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as TimersMap;
    return {
      nursing: { ...idle(), ...parsed.nursing },
      pumping: { ...idle(), ...parsed.pumping },
      sleep: { ...idle(), ...parsed.sleep },
    };
  } catch {
    return DEFAULTS;
  }
}

export function TimersProvider({ children }: { children: ReactNode }) {
  const [timers, setTimers] = useState<TimersMap>(readStorage);
  const ref = useRef(timers);
  useEffect(() => {
    ref.current = timers;
  }, [timers]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimers((prev) => {
        let changed = false;
        const next = { ...prev };
        (Object.keys(next) as TimerKind[]).forEach((kind) => {
          const timer = next[kind];
          if (timer.running && timer.startTime) {
            const elapsed = Math.max(
              0,
              Math.floor((Date.now() - new Date(timer.startTime).getTime()) / 1000),
            );
            if (elapsed !== timer.elapsedSec) {
              changed = true;
              next[kind] = { ...timer, elapsedSec: elapsed };
            }
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
    } catch {
      /* ignore */
    }
  }, [timers]);

  const start = useCallback((kind: TimerKind, side?: BreastSide) => {
    setTimers((prev) => ({
      ...prev,
      [kind]: {
        running: true,
        startTime: new Date().toISOString(),
        elapsedSec: 0,
        side: side ?? null,
      },
    }));
  }, []);

  const stop = useCallback((kind: TimerKind): FinishedTimer => {
    const current = ref.current[kind];
    const startTime = current.startTime ?? new Date().toISOString();
    const endTime = new Date().toISOString();
    const elapsedSec = current.running
      ? Math.max(
          0,
          Math.floor((Date.now() - new Date(startTime).getTime()) / 1000),
        )
      : current.elapsedSec;
    setTimers((prev) => ({ ...prev, [kind]: idle() }));
    return { kind, startTime, endTime, elapsedSec, side: current.side ?? null };
  }, []);

  const cancel = useCallback((kind: TimerKind) => {
    setTimers((prev) => ({ ...prev, [kind]: idle() }));
  }, []);

  const switchSide = useCallback((kind: TimerKind, side: BreastSide) => {
    setTimers((prev) => ({
      ...prev,
      [kind]: { ...prev[kind], side },
    }));
  }, []);

  const reset = useCallback(() => {
    setTimers({
      nursing: idle(),
      pumping: idle(),
      sleep: idle(),
    });
  }, []);

  const value: TimersContextValue = useMemo(
    () => ({
      timers,
      anyRunning: (Object.keys(timers) as TimerKind[]).some(
        (kind) => timers[kind].running,
      ),
      runningKinds: (Object.keys(timers) as TimerKind[]).filter(
        (kind) => timers[kind].running,
      ),
      isRunning: (kind) => timers[kind].running,
      start,
      stop,
      cancel,
      switchSide,
      reset,
    }),
    [timers, start, stop, cancel, switchSide, reset],
  );

  return (
    <TimersContext.Provider value={value}>{children}</TimersContext.Provider>
  );
}

export function useTimers() {
  const ctx = useContext(TimersContext);
  if (!ctx) throw new Error("useTimers must be used within a TimersProvider");
  return ctx;
}
