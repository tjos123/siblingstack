"use client";

import { formatClockTime } from "@/lib/time";
import { suggestionFor } from "@/lib/suggestions";
import type { Child, ConflictWindow } from "@/types/models";

interface Props {
  conflicts: ConflictWindow[];
  childA: Child;
  childB: Child;
  premium: boolean;
}

const TYPE_LABEL: Record<string, string> = {
  sleep: "both asleep",
  feed: "both feeding",
};

export default function ConflictsPanel({ conflicts, childA, childB, premium }: Props) {
  return (
    <div className="bg-surface rounded-md p-4">
      <h3 className="font-display text-base text-ink mb-3">
        Today's overlaps{" "}
        <span className="text-ink-muted font-body text-sm">
          ({conflicts.length})
        </span>
      </h3>

      {conflicts.length === 0 ? (
        <p className="text-ink-muted text-sm">
          No schedule collisions logged yet today.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {conflicts.map((c, i) => (
            <li key={i} className="text-sm">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-conflict shrink-0" />
                <span className="font-mono text-ink-muted">
                  {formatClockTime(c.overlapStart)}–{formatClockTime(c.overlapEnd)}
                </span>
                <span className="text-ink">
                  {TYPE_LABEL[c.type] ?? c.type} — {childA.name} &amp; {childB.name}
                </span>
              </div>
              {premium ? (
                <p className="text-childB text-xs mt-1 pl-4">
                  {suggestionFor(c, childA, childB)}
                </p>
              ) : (
                <p className="text-ink-muted text-xs mt-1 pl-4 italic">
                  Upgrade for a suggestion on how to reduce this overlap.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
