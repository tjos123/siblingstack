"use client";

import { useMemo, useState } from "react";
import { ChipScroller } from "@/sprout/components/ui/chip-scroller";
import { LogItem } from "@/sprout/components/log-item";
import { Segmented } from "@/sprout/components/ui/segmented";
import { useToast } from "@/sprout/components/ui/toast";
import { HistoryView } from "@/sprout/components/views/history-view";
import { useData } from "@/sprout/hooks/use-data";
import { useFamilyMembers } from "@/sprout/hooks/use-family-members";
import { TIMELINE_FILTERS } from "@/sprout/lib/categories";
import { formatDayLabel, isoDay } from "@/sprout/lib/format";
import type { Category, Log } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

type TimelineMode = "list" | "calendar";

export function TimelineView({ onOpenLog }: { onOpenLog?: (log: Log) => void }) {
  const { logs, baby, settings, removeLog, editLog } = useData();
  const { members } = useFamilyMembers();
  const toast = useToast();
  const [filter, setFilter] = useState<Category | "all">("all");
  const [mode, setMode] = useState<TimelineMode>("list");

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
    void removeLog(log.id);
    toast.show({
      message: "Entry deleted",
      actionLabel: "Undo",
      duration: 6000,
      onAction: () => void editLog(log.id, { deleted: false }),
    });
  };

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        columns={2}
        size="sm"
        options={[
          { value: "list", label: "List" },
          { value: "calendar", label: "Calendar" },
        ]}
      />

      {mode === "calendar" ? (
        <HistoryView onOpenLog={onOpenLog} />
      ) : (
        <>
          <ChipScroller className="-mx-4 px-4">
        {TIMELINE_FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "min-h-11 shrink-0 snap-start rounded-full px-3.5 text-xs font-bold transition-all active:scale-95",
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-sprout-surface-muted text-muted hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </ChipScroller>

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
                  showCaregiver={members.length > 1}
                />
              ))}
            </div>
          </section>
        ))
      )}
        </>
      )}
    </div>
  );
}
