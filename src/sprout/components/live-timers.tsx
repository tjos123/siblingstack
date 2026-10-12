"use client";

import {
  Droplets,
  Milk,
  Moon,
  Play,
  Square,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/sprout/components/ui/button";
import { Segmented } from "@/sprout/components/ui/segmented";
import { useTimers, type FinishedTimer } from "@/sprout/hooks/use-timers";
import { timerClock } from "@/sprout/lib/format";
import { haptic } from "@/sprout/lib/haptics";
import type { BreastSide, TimerKind } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

interface TimerMeta {
  kind: TimerKind;
  label: string;
  runningLabel: string;
  startingLabel: string;
  icon: LucideIcon;
  wrap: string;
  text: string;
  dot: string;
}

const META: TimerMeta[] = [
  {
    kind: "nursing",
    label: "Nursing",
    runningLabel: "Nursing in progress",
    startingLabel: "Start nursing",
    icon: Milk,
    wrap: "bg-terracotta/12 border-terracotta/25",
    text: "text-terracotta-read",
    dot: "bg-terracotta",
  },
  {
    kind: "pumping",
    label: "Pumping",
    runningLabel: "Pumping in progress",
    startingLabel: "Start pumping",
    icon: Droplets,
    wrap: "bg-ochre/18 border-ochre/30",
    text: "text-ochre-read",
    dot: "bg-ochre",
  },
  {
    kind: "sleep",
    label: "Sleep",
    runningLabel: "Sleeping",
    startingLabel: "Start sleep",
    icon: Moon,
    wrap: "bg-plum/12 border-plum/25",
    text: "text-plum-read",
    dot: "bg-plum",
  },
];

export function LiveTimers({
  onFinish,
}: {
  onFinish: (finished: FinishedTimer) => void;
}) {
  const { timers, start, stop, cancel, switchSide } = useTimers();

  return (
    <div className="space-y-2.5">
      {META.map((meta) => {
        const timer = timers[meta.kind];
        const Icon = meta.icon;

        if (!timer.running) {
          return (
            <button
              key={meta.kind}
              type="button"
              onClick={() => {
                haptic(10);
                start(meta.kind, meta.kind === "nursing" ? "left" : undefined);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-3xl border border-hairline bg-sprout-surface p-3 text-left transition-all active:scale-[0.99] hover:border-sage/40 hover:shadow-soft",
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                  meta.wrap,
                  meta.text,
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-foreground">
                  {meta.label}
                </span>
                <span className="block text-[11px] font-medium text-muted">
                  {meta.startingLabel} · tap to begin a live timer
                </span>
              </span>
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground",
                  meta.dot,
                )}
              >
                <Play className="h-4 w-4 translate-x-px" fill="currentColor" />
              </span>
            </button>
          );
        }

        return (
          <div
            key={meta.kind}
            className={cn(
              "rounded-3xl border p-4 shadow-soft",
              meta.wrap,
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sprout-surface/70",
                  meta.text,
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={cn("h-2 w-2 rounded-full", meta.dot, "animate-pulse-soft")} />
                  <span className={cn("text-xs font-bold", meta.text)}>
                    {meta.runningLabel}
                  </span>
                </div>
                <p className="tabular text-2xl font-bold leading-tight text-foreground">
                  {timerClock(timer.elapsedSec)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  haptic(8);
                  cancel(meta.kind);
                }}
                aria-label="Cancel timer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-sprout-surface/70 text-muted transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {meta.kind === "nursing" ? (
              <div className="mt-3">
                <Segmented
                  value={(timer.side as BreastSide) ?? "left"}
                  onChange={(side) => {
                    haptic(6);
                    switchSide("nursing", side);
                  }}
                  size="sm"
                  columns={3}
                  options={[
                    { value: "left", label: "Left" },
                    { value: "right", label: "Right" },
                    {
                      value: "both",
                      label: "Both",
                    },
                  ]}
                />
              </div>
            ) : null}

            <div className="mt-3">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  haptic(12);
                  onFinish(stop(meta.kind));
                }}
              >
                <Square className="h-4 w-4" fill="currentColor" />
                Stop &amp; log
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
