"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  Monitor,
  Moon,
  Plus,
  Settings2,
  Sun,
} from "lucide-react";
import { Button } from "@/sprout/components/ui/button";
import { Sheet } from "@/sprout/components/ui/sheet";
import { ageFromBirthDate } from "@/sprout/lib/format";
import type { Baby, ThemeMode } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

export function Header({
  baby,
  babies,
  theme,
  onOpenSettings,
  onCycleTheme,
  onSelectBaby,
  onAddChild,
}: {
  baby: Baby | null;
  babies: Baby[];
  theme: ThemeMode;
  onOpenSettings: () => void;
  onCycleTheme: () => void;
  onSelectBaby: (id: string) => void;
  onAddChild: () => void;
}) {
  const age = baby ? ageFromBirthDate(baby.birthDate) : null;
  const [kidsOpen, setKidsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-background/85 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-3 pt-safe">
        <h1 className="sr-only">{baby?.name ?? "Baby"}</h1>
        <button
          type="button"
          onClick={() => setKidsOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={kidsOpen}
          aria-label={`Switch child. Currently ${baby?.name ?? "Baby"}.`}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl text-left transition-colors hover:bg-sprout-surface-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sage/25 bg-sage/15 text-2xl"
          >
            {baby?.avatarEmoji ?? "🌱"}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1">
              <span className="font-serif truncate text-lg font-bold leading-tight text-foreground">
                {baby?.name ?? "Baby"}
              </span>
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-muted"
              />
            </span>
            <span className="block truncate text-[11px] font-medium text-muted">
              {age ? `${age.label} · ${age.detail}` : "Sprout Baby Tracker"}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onCycleTheme}
          aria-label={`Appearance: ${theme}. Tap to change.`}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sprout-surface-muted text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {theme === "light" ? (
            <Sun aria-hidden="true" className="h-5 w-5" />
          ) : theme === "dark" ? (
            <Moon aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Monitor aria-hidden="true" className="h-5 w-5" />
          )}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Open settings"
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sprout-surface-muted text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Settings2 aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <Sheet
        open={kidsOpen}
        onClose={() => setKidsOpen(false)}
        title="Children"
        subtitle="Switch who you're tracking"
      >
        <div className="space-y-2">
          {babies.map((child) => {
            const active = child.id === baby?.id;
            const childAge = ageFromBirthDate(child.birthDate);
            return (
              <button
                key={child.id}
                type="button"
                onClick={() => {
                  onSelectBaby(child.id);
                  setKidsOpen(false);
                }}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60",
                  active
                    ? "border-sage/40 bg-sage/12"
                    : "border-hairline bg-sprout-surface hover:bg-sprout-surface-muted",
                )}
              >
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sage/15 text-xl"
                >
                  {child.avatarEmoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-foreground">
                    {child.name}
                  </span>
                  <span className="block text-[11px] font-medium text-muted">
                    {childAge.label} · {childAge.detail}
                  </span>
                </span>
                {active ? (
                  <Check
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-sage-read"
                  />
                ) : null}
              </button>
            );
          })}
          <Button
            variant="soft"
            size="md"
            className="w-full"
            onClick={() => {
              onAddChild();
              setKidsOpen(false);
            }}
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add child
          </Button>
        </div>
      </Sheet>
    </header>
  );
}
