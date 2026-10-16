"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/sprout/lib/utils";

export interface ToastOptions {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  /** How long the toast stays up. Undo toasts use ~6s. */
  duration?: number;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
  dismiss: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const EXIT_MS = 160;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const exitRef = useRef<number | null>(null);
  const idRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (exitRef.current !== null) {
      window.clearTimeout(exitRef.current);
      exitRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    clearTimers();
    setVisible(false);
    exitRef.current = window.setTimeout(() => {
      setToast(null);
      exitRef.current = null;
    }, EXIT_MS);
  }, [clearTimers]);

  const show = useCallback(
    (options: ToastOptions) => {
      clearTimers();
      const id = ++idRef.current;
      setToast(options);
      setVisible(true);
      timerRef.current = window.setTimeout(() => {
        if (idRef.current !== id) return;
        timerRef.current = null;
        setVisible(false);
        exitRef.current = window.setTimeout(() => {
          if (idRef.current === id) setToast(null);
          exitRef.current = null;
        }, EXIT_MS);
      }, options.duration ?? 6000);
    },
    [clearTimers],
  );

  useEffect(() => clearTimers, [clearTimers]);

  const value = { show, dismiss };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "fixed inset-x-0 z-[60] mx-auto w-full max-w-md px-4",
            visible
              ? "pointer-events-auto animate-slide-up"
              : "pointer-events-none opacity-0 transition-opacity duration-150",
          )}
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 7.5rem)" }}
        >
          <div className="flex items-center gap-3 rounded-3xl bg-forest px-4 py-3 text-[#f4f1ea] shadow-lift">
            <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">
              {toast.message}
            </span>
            {toast.actionLabel ? (
              <button
                type="button"
                onClick={() => {
                  toast.onAction?.();
                  dismiss();
                }}
                className="inline-flex h-11 shrink-0 items-center rounded-xl px-3 text-xs font-bold text-sage transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/70"
              >
                {toast.actionLabel}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
