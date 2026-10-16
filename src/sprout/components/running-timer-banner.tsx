"use client";

import { ChevronRight, Droplets, Milk, Moon, Square, type LucideIcon } from "lucide-react";
import { useTimers } from "@/sprout/hooks/use-timers";
import { timerClock } from "@/sprout/lib/format";
import { haptic } from "@/sprout/lib/haptics";
import type { TimerKind } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

const META: Record<
  TimerKind,
  { label: string; icon: LucideIcon; text: string; dot: string }
> = {
  nursing: { label: "Nursing", icon: Milk, text: "text-terracotta-read", dot: "bg-terracotta" },
  pumping: { label: "Pumping", icon: Droplets, text: "text-ochre-read", dot: "bg-ochre" },
  sleep: { label: "Sleep", icon: Moon, text: "text-plum-read", dot: "bg-plum" },
};

// Slim, always-visible strip above the tab bar so a live timer is never
// hidden behind a different tab. Tapping it returns to the Tracker; the stop
// control finishes the timer straight into the save sheet.
export function RunningTimerBanner({
  onOpen,
  onStop,
}: {
  onOpen: () => void;
  onStop: (kind: TimerKind) => void;
}) {
  const { timers, runningKinds } = useTimers();
  if (runningKinds.length === 0) return null;

  const lead = runningKinds[0];
  const meta = META[lead];
  const Icon = meta.icon;
  const extra = runningKinds.length - 1;
  const elapsed = timers[lead].elapsedSec;
  const label = runningKinds.map((k) => META[k].label).join(" + ");

  return (
    <div
      className="fixed inset-x-0 z-40 mx-auto flex h-12 w-full max-w-md items-center gap-2 border-y border-hairline bg-sprout-surface/95 px-2 backdrop-blur-md"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 4.5rem)" }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open Tracker — ${label} timer ${timerClock(elapsed)}${
          extra > 0 ? ` and ${extra} more running` : ""
        }`}
        className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage/60"
      >
        <span aria-hidden="true" className={cn("h-2 w-2 shrink-0 rounded-full animate-pulse-soft", meta.dot)} />
        <Icon aria-hidden="true" className={cn("h-4 w-4 shrink-0", meta.text)} />
        <span className={cn("text-xs font-bold", meta.text)}>{meta.label}</span>
        <span className="tabular text-sm font-bold text-foreground">
          {timerClock(elapsed)}
        </span>
        {extra > 0 ? (
          <span className="rounded-full bg-sprout-surface-muted px-2 py-0.5 text-[10px] font-bold text-muted">
            +{extra} more
          </span>
        ) : null}
        <span className="ml-auto flex items-center gap-1 text-[11px] font-bold text-muted">
          Tracker
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </span>
      </button>
      <button
        type="button"
        onClick={() => {
          haptic(12);
          onStop(lead);
        }}
        aria-label={`Stop ${meta.label} timer and review entry`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage/60"
      >
        <Square aria-hidden="true" className="h-4 w-4 fill-current" />
      </button>
    </div>
  );
}
