"use client";

import { Monitor, Moon, Settings2, Sun, Timer } from "lucide-react";
import { ageFromBirthDate } from "@/sprout/lib/format";
import type { Baby, ThemeMode } from "@/sprout/lib/types";

export function Header({
  baby,
  theme,
  timerActive,
  onOpenSettings,
  onCycleTheme,
}: {
  baby: Baby | null;
  theme: ThemeMode;
  timerActive: boolean;
  onOpenSettings: () => void;
  onCycleTheme: () => void;
}) {
  const age = baby ? ageFromBirthDate(baby.birthDate) : null;

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-background/85 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-3 pt-safe">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sage/25 bg-sage/15 text-xl">
          {baby?.avatarEmoji ?? "🌱"}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-serif truncate text-lg font-bold leading-tight text-foreground">
            {baby?.name ?? "Baby"}
          </h1>
          <p className="truncate text-[11px] font-medium text-muted">
            {age ? `${age.label} · ${age.detail}` : "Sprout Baby Tracker"}
          </p>
        </div>

        {timerActive ? (
          <span className="flex items-center gap-1.5 rounded-full border border-terracotta/30 bg-terracotta/15 px-2.5 py-1 text-[10px] font-bold text-terracotta-read">
            <Timer className="h-3 w-3 animate-pulse-soft" />
            Live
          </span>
        ) : null}

        <button
          type="button"
          onClick={onCycleTheme}
          aria-label={`Theme: ${theme}`}
          title={`Theme: ${theme}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-sprout-surface-muted text-muted transition-colors hover:text-foreground"
        >
          {theme === "light" ? (
            <Sun className="h-4.5 w-4.5" />
          ) : theme === "dark" ? (
            <Moon className="h-4.5 w-4.5" />
          ) : (
            <Monitor className="h-4.5 w-4.5" />
          )}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Open settings"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-sprout-surface-muted text-muted transition-colors hover:text-foreground"
        >
          <Settings2 className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
}
