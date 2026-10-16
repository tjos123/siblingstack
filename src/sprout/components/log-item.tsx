"use client";

import { Trash } from "lucide-react";
import { CategoryIcon } from "@/sprout/components/category-icon";
import { CATEGORY_META, TONES } from "@/sprout/lib/categories";
import { formatClock, formatDateShort, isSameLocalDay } from "@/sprout/lib/format";
import { logSummary, logTimeRange, logTitle } from "@/sprout/lib/log-summary";
import type { Baby, Log, UnitPreferences } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

export function LogItem({
  log,
  units,
  baby,
  onDelete,
  onPress,
  showDate = false,
  showCaregiver = false,
}: {
  log: Log;
  units: UnitPreferences;
  baby?: Baby;
  onDelete?: (log: Log) => void;
  onPress?: (log: Log) => void;
  showDate?: boolean;
  showCaregiver?: boolean;
}) {
  const meta = CATEGORY_META[log.category];
  const tone = TONES[meta.tone];
  const range = logTimeRange(log);
  const title = logTitle(log, baby);
  const summary = logSummary(log, units);
  const today = isSameLocalDay(log.startTime, new Date());
  const timeLabel = today
    ? formatClock(log.startTime)
    : `${formatDateShort(log.startTime)} · ${formatClock(log.startTime)}`;
  const caregiver = showCaregiver ? log.details.caregiver : undefined;

  return (
    <div
      role={onPress ? "button" : undefined}
      tabIndex={onPress ? 0 : undefined}
      onClick={() => onPress?.(log)}
      onKeyDown={(e) => {
        if (onPress && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onPress(log);
        }
      }}
      className={cn(
        "flex items-center gap-3 rounded-3xl border border-hairline bg-sprout-surface p-3 transition-colors hover:border-sage/40",
        onPress ? "cursor-pointer active:bg-sprout-surface-sunken" : undefined,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
          tone.iconWrap,
        )}
      >
        <CategoryIcon category={log.category} className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="line-clamp-2 text-sm font-bold text-foreground">{title}</p>
          {caregiver ? (
            <span className="mt-0.5 shrink-0 rounded-full bg-sage/15 px-2 py-0.5 text-[10px] font-bold text-sage-read">
              {caregiver}
            </span>
          ) : null}
        </div>
        <p className="line-clamp-3 text-[12px] font-medium text-muted">{summary}</p>
        <p className="tabular mt-0.5 text-[11px] font-semibold text-muted">
          {showDate ? timeLabel : range ?? timeLabel}
        </p>
      </div>
      {onDelete ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(log);
          }}
          aria-label="Delete entry"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-rose/12 hover:text-rose-read"
        >
          <Trash aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
