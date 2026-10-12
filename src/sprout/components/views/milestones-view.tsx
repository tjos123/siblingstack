"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/sprout/components/ui/button";
import { useData } from "@/sprout/hooks/use-data";
import { MILESTONE_PRESET_LABELS } from "@/sprout/lib/categories";
import { formatDateLong } from "@/sprout/lib/format";
import { milestonesFromLogs } from "@/sprout/lib/log-summary";
import type { MilestonePreset } from "@/sprout/lib/types";

function presetOf(subtype: string | null) {
  if (!subtype) return null;
  return MILESTONE_PRESET_LABELS[subtype as MilestonePreset] ?? null;
}

export function MilestonesView({ onAddMilestone }: { onAddMilestone: () => void }) {
  const { logs } = useData();
  const milestones = useMemo(() => milestonesFromLogs(logs), [logs]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="font-serif text-base font-bold text-foreground">
            Growing up
          </h2>
          <p className="text-[11px] font-medium text-muted">
            {milestones.length}{" "}
            {milestones.length === 1 ? "memory" : "memories"} captured
          </p>
        </div>
        <Button variant="accent" size="sm" onClick={onAddMilestone}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {milestones.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-hairline bg-sprout-surface py-14 text-center">
          <span className="text-3xl">✨</span>
          <p className="text-sm font-bold text-foreground">The album is empty</p>
          <p className="max-w-[240px] text-xs font-medium text-muted">
            Capture first smiles, first words and every little win as your baby
            grows.
          </p>
          <Button variant="primary" size="sm" className="mt-1" onClick={onAddMilestone}>
            <Plus className="h-4 w-4" />
            Log the first milestone
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {milestones.map((log) => {
            const emoji = (log.details.photo as string) || "🌱";
            const title =
              (log.details.milestoneTitle as string) ||
              (log.details.title as string) ||
              presetOf(log.subtype) ||
              "Milestone";
            const notes = (log.details.notes as string) ?? "";
            return (
              <div
                key={log.id}
                className="flex flex-col gap-2 rounded-3xl border border-hairline bg-sprout-surface p-4 shadow-soft"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-plum/12 text-2xl">
                  {emoji}
                </span>
                <p className="text-sm font-bold leading-snug text-foreground">
                  {title}
                </p>
                <p className="text-[11px] font-bold text-plum-read">
                  {formatDateLong(log.startTime)}
                </p>
                {notes ? (
                  <p className="line-clamp-3 text-[11px] font-medium text-muted">
                    {notes}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
