"use client";

import { useRef } from "react";
import { CategoryIcon } from "@/sprout/components/category-icon";
import { CATEGORY_META, TONES } from "@/sprout/lib/categories";
import { haptic } from "@/sprout/lib/haptics";
import { CATEGORIES, type Category } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const INSTANT: Category[] = ["feed", "diaper", "sleep"];
const LONG_PRESS_MS = 500;

export function QuickLogGrid({
  onSelect,
  onQuickLog,
}: {
  onSelect: (category: Category) => void;
  onQuickLog?: (category: Category) => void;
}) {
  const timerRef = useRef<number | null>(null);
  const firedRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startPress = (category: Category, instant: boolean) => {
    if (!onQuickLog || !instant) return;
    firedRef.current = false;
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      firedRef.current = true;
      haptic(14);
      onQuickLog(category);
    }, LONG_PRESS_MS);
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {CATEGORIES.map((category) => {
        const meta = CATEGORY_META[category];
        const tone = TONES[meta.tone];
        // Pump keeps a solid amber tile so it reads clearly at a glance.
        const isPump = category === "pump";
        const instant = Boolean(onQuickLog) && INSTANT.includes(category);
        return (
          <button
            key={category}
            type="button"
            aria-label={
              instant ? `Log ${meta.label.toLowerCase()} · hold to log instantly` : `Log ${meta.label.toLowerCase()}`
            }
            onPointerDown={() => startPress(category, instant)}
            onPointerUp={clearTimer}
            onPointerLeave={clearTimer}
            onPointerCancel={clearTimer}
            onContextMenu={(event) => event.preventDefault()}
            onClick={() => {
              if (firedRef.current) {
                firedRef.current = false;
                return;
              }
              haptic(8);
              onSelect(category);
            }}
            className={cn(
              "flex min-h-[84px] flex-col items-center justify-center gap-1.5 rounded-3xl border border-hairline bg-sprout-surface px-1 py-2 transition-all active:scale-95 hover:border-sage/40 hover:shadow-soft",
              FOCUS,
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-2xl",
                isPump ? "bg-[#f0cf7a] text-[#3a3320]" : tone.iconWrap,
              )}
            >
              <CategoryIcon category={category} className="h-5 w-5" />
            </span>
            <span className="text-center text-[12px] font-semibold leading-none text-foreground">
              {meta.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
