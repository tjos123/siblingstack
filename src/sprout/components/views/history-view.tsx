"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Droplets, Milk, Moon, Baby } from "lucide-react";
import { LogItem } from "@/sprout/components/log-item";
import { Card } from "@/sprout/components/ui/card";
import { useData } from "@/sprout/hooks/use-data";
import { humanDuration, isoDay, formatDateFull, formatMonthYear } from "@/sprout/lib/format";
import { activeLogs, summarizeDay, type DaySummary } from "@/sprout/lib/stats";
import type { Log } from "@/sprout/lib/types";
import { formatVolume } from "@/sprout/lib/units";
import { cn } from "@/sprout/lib/utils";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function HistoryView({ onOpenLog }: { onOpenLog?: (log: Log) => void }) {
  const { logs, baby, settings } = useData();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date>(() => new Date());

  const byDay = useMemo(() => {
    const map = new Map<string, number>();
    activeLogs(logs).forEach((log) => {
      const key = isoDay(log.startTime);
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, [logs]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const selectedLogs = useMemo(
    () =>
      activeLogs(logs).filter((log) => isoDay(log.startTime) === isoDay(selected)),
    [logs, selected],
  );
  const daySummary: DaySummary = useMemo(
    () => summarizeDay(logs, selected),
    [logs, selected],
  );

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonth((m) => subMonths(m, 1))}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-sprout-surface-muted text-muted transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="font-serif text-base font-bold text-foreground">
            {formatMonthYear(month)}
          </p>
          <button
            type="button"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-sprout-surface-muted text-muted transition-colors hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((label, index) => (
            <span
              key={`${label}-${index}`}
              className="py-1 text-center text-[10px] font-bold uppercase text-muted"
            >
              {label}
            </span>
          ))}
          {days.map((day) => {
            const key = isoDay(day);
            const count = byDay.get(key) ?? 0;
            const inMonth = isSameMonth(day, month);
            const isSelected = isSameDay(day, selected);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(day)}
                className={cn(
                  "relative flex aspect-square items-center justify-center rounded-xl text-xs font-bold transition-all active:scale-95",
                  !inMonth && "text-muted/40",
                  inMonth && !isSelected && "text-foreground hover:bg-sprout-surface-muted",
                  isSelected && "bg-primary text-primary-foreground shadow-soft",
                )}
              >
                {day.getDate()}
                {count > 0 ? (
                  <span
                    className={cn(
                      "absolute bottom-1 h-1.5 w-1.5 rounded-full",
                      isSelected ? "bg-primary-foreground" : "bg-sage",
                      count >= 8 && !isSelected && "h-2 w-2 bg-terracotta",
                    )}
                  />
                ) : null}
                {isToday(day) && !isSelected ? (
                  <span className="absolute inset-1 rounded-lg ring-1 ring-sage/50" />
                ) : null}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="space-y-3">
        <div className="px-1">
          <h2 className="font-serif text-sm font-bold text-foreground">
            {formatDateFull(selected)}
          </h2>
          <p className="text-[11px] font-medium text-muted">
            {selectedLogs.length}{" "}
            {selectedLogs.length === 1 ? "entry" : "entries"} logged
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <MiniStat icon={Milk} value={String(daySummary.feeds)} label="Feeds" tone="bg-sage/15 text-sage-read" />
          <MiniStat icon={Moon} value={humanDuration(daySummary.sleepSec)} label="Sleep" tone="bg-plum/15 text-plum-read" />
          <MiniStat icon={Baby} value={String(daySummary.diapers)} label="Diapers" tone="bg-sky/15 text-sky-read" />
          <MiniStat
            icon={Droplets}
            value={
              daySummary.pumpOz > 0
                ? formatVolume(daySummary.pumpOz, settings.units.volume)
                : "—"
            }
            label="Pumped"
            tone="bg-ochre/25 text-ochre-read"
          />
        </div>

        {selectedLogs.length === 0 ? (
          <div className="rounded-3xl border border-hairline bg-sprout-surface py-10 text-center">
            <p className="text-sm font-bold text-foreground">A quiet day</p>
            <p className="text-xs font-medium text-muted">
              No entries were logged on this date.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedLogs.map((log) => (
              <LogItem
                key={log.id}
                log={log}
                units={settings.units}
                baby={baby ?? undefined}
                onPress={onOpenLog}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  tone: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-sprout-surface-muted py-2.5">
      <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", tone)}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="tabular text-xs font-bold text-foreground">{value}</span>
      <span className="text-[9px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
    </div>
  );
}
