"use client";

import {
  ChevronDown,
  Droplets,
  Milk,
  Moon,
  Play,
  Plus,
  Square,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
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

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function LiveTimers({
  onFinish,
}: {
  onFinish: (finished: FinishedTimer) => void;
}) {
  const { timers, start, stop, cancel, switchSide } = useTimers();
  const [expanded, setExpanded] = useState(false);

  const running = META.filter((meta) => timers[meta.kind].running);
  const idle = META.filter((meta) => !timers[meta.kind].running);

  return (
    <div className="space-y-2">
      {running.map((meta) => {
        const timer = timers[meta.kind];
        const Icon = meta.icon;
        return (
          <div
            key={meta.kind}
            role="group"
            aria-label={`${meta.runningLabel} — ${timerClock(timer.elapsedSec)}`}
            className={cn("rounded-3xl border p-3 shadow-soft", meta.wrap)}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sprout-surface/70",
                  meta.text,
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      meta.dot,
                      "animate-pulse-soft",
                    )}
                  />
                  <span className={cn("truncate text-[11px] font-bold", meta.text)}>
                    {meta.runningLabel}
                  </span>
                </div>
                <p className="tabular text-xl font-bold leading-tight text-foreground">
                  {timerClock(timer.elapsedSec)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  haptic(8);
                  cancel(meta.kind);
                }}
                aria-label={`Cancel ${meta.label.toLowerCase()} timer without logging`}
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sprout-surface/70 text-muted transition-colors hover:text-foreground",
                  FOCUS,
                )}
              >
                <X className="h-4.5 w-4.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  haptic(12);
                  onFinish(stop(meta.kind));
                }}
                aria-label={`Stop and log ${meta.label.toLowerCase()} timer`}
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95",
                  FOCUS,
                )}
              >
                <Square className="h-4 w-4" fill="currentColor" />
              </button>
            </div>

            {meta.kind === "nursing" ? (
              <div className="mt-2.5">
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
                    { value: "both", label: "Both" },
                  ]}
                />
              </div>
            ) : null}
          </div>
        );
      })}

      {idle.length > 0 ? (
        <>
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={`${expanded ? "Choose a timer" : "Start a timer"} ${idle
              .map((m) => m.label)
              .join(" · ")}`}
            onClick={() => {
              haptic(8);
              setExpanded((prev) => !prev);
            }}
            className={cn(
              "flex min-h-[56px] w-full items-center gap-3 rounded-3xl border border-dashed border-sage/40 bg-sprout-surface p-2.5 pr-3 text-left transition-all active:scale-[0.99] hover:border-sage/60 hover:shadow-soft",
              FOCUS,
            )}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sage/12 text-sage-read">
              <Plus className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold leading-tight text-foreground">
                {expanded ? "Choose a timer" : "Start a timer"}
              </span>
              <span className="block truncate text-[11px] font-medium leading-tight text-muted">
                {idle.map((m) => m.label).join(" · ")}
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "h-5 w-5 shrink-0 text-muted transition-transform",
                expanded ? "rotate-180" : "",
              )}
            />
          </button>

          {expanded
            ? idle.map((meta) => {
                const Icon = meta.icon;
                return (
                  <button
                    key={meta.kind}
                    type="button"
                    aria-label={`${meta.startingLabel} — start a live timer`}
                    onClick={() => {
                      haptic(10);
                      setExpanded(false);
                      start(meta.kind, meta.kind === "nursing" ? "left" : undefined);
                    }}
                    className={cn(
                      "flex min-h-[56px] w-full items-center gap-3 rounded-3xl border border-hairline bg-sprout-surface p-2.5 pr-2 text-left transition-all active:scale-[0.99] hover:border-sage/40 hover:shadow-soft",
                      FOCUS,
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                        meta.wrap,
                        meta.text,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold leading-tight text-foreground">
                        {meta.label}
                      </span>
                      <span className="block truncate text-[11px] font-medium leading-tight text-muted">
                        {meta.startingLabel} · tap to begin
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-primary-foreground",
                        meta.dot,
                      )}
                    >
                      <Play className="h-4 w-4 translate-x-px" fill="currentColor" />
                    </span>
                  </button>
                );
              })
            : null}
        </>
      ) : null}
    </div>
  );
}
