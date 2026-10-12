"use client";

import { useMemo, useState } from "react";
import { LogItem } from "@/sprout/components/log-item";
import { useData } from "@/sprout/hooks/use-data";
import { TIMELINE_FILTERS } from "@/sprout/lib/categories";
import { formatDayLabel, isoDay } from "@/sprout/lib/format";
import type { Category, Log } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

export function TimelineView({ onOpenLog }: { onOpenLog?: (log: Log) => void }) {
  const { logs, baby, settings, removeLog } = useData();
  const [filter, setFilter] = useState<Category | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? logs : logs.filter((l) => l.category === filter)),
    [logs, filter],
  );

  const groups = useMemo(() => {
    const map = new Map<string, Log[]>();
    filtered.forEach((log) => {
      const key = isoDay(log.startTime);
      const bucket = map.get(key);
      if (bucket) bucket.push(log);
      else map.set(key, [log]);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const onDelete = (log: Log) => {
    if (typeof window !== "undefined" && !window.confirm("Delete this entry?")) {
      return;
    }
    void removeLog(log.id);
  };

  return (
    <div className="space-y-4">
      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
        {TIMELINE_FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "min-h-9 shrink-0 rounded-full px-3.5 text-xs font-bold transition-all active:scale-95",
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-sprout-surface-muted text-muted hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center gap-1 rounded-3xl border border-hairline bg-sprout-surface py-12 text-center">
          <span className="text-2xl">☁️</span>
          <p className="text-sm font-bold text-foreground">Nothing here yet</p>
          <p className="max-w-[220px] text-xs font-medium text-muted">
            Logged moments will appear here, grouped by day.
          </p>
        </div>
      ) : (
        groups.map(([day, dayLogs]) => (
          <section key={day} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <h2 className="font-serif text-sm font-bold text-foreground">
                {formatDayLabel(day)}
              </h2>
              <span className="h-px flex-1 bg-hairline" />
              <span className="text-[11px] font-semibold text-muted">
                {dayLogs.length} {dayLogs.length === 1 ? "entry" : "entries"}
              </span>
            </div>
            <div className="space-y-2">
              {dayLogs.map((log) => (
                <LogItem
                  key={log.id}
                  log={log}
                  units={settings.units}
                  baby={baby ?? undefined}
                  onDelete={onDelete}
                  onPress={onOpenLog}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
