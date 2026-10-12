import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { Change } from "@/sprout/lib/stats";
import { cn } from "@/sprout/lib/utils";

export function TrendDelta({
  change,
  format,
  invert = false,
  className,
}: {
  change: Change;
  format?: (abs: number) => string;
  invert?: boolean;
  className?: string;
}) {
  if (change.dir === "flat") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-sprout-surface-muted px-2 py-0.5 text-[10px] font-bold text-muted",
          className,
        )}
      >
        <Minus className="h-3 w-3" /> steady
      </span>
    );
  }
  const positive = invert ? change.dir === "down" : change.dir === "up";
  const Icon = change.dir === "up" ? TrendingUp : TrendingDown;
  const label = format
    ? format(Math.abs(change.abs))
    : `${Math.abs(change.abs).toFixed(change.abs < 10 ? 1 : 0)}`;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
        positive ? "bg-sage/15 text-sage-read" : "bg-rose/15 text-rose-read",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
