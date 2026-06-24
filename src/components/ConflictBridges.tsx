"use client";

import { dayPositionPercent } from "@/lib/time";
import type { ConflictWindow } from "@/types/models";

interface Props {
  conflicts: ConflictWindow[];
  dayStart: number;
}

// Absolutely positioned over the gap between the two lanes — each conflict
// becomes a vertical band, literally bridging the two timelines, in the
// conflict color so it reads as "this is the thing worth noticing" rather
// than just another colored block.
export default function ConflictBridges({ conflicts, dayStart }: Props) {
  if (conflicts.length === 0) return null;

  return (
    <div className="relative h-3 pointer-events-none">
      {conflicts.map((c, i) => {
        const left = dayPositionPercent(c.overlapStart, dayStart);
        const right = dayPositionPercent(c.overlapEnd, dayStart);
        const width = Math.max(right - left, 0.6);
        return (
          <div
            key={i}
            className="absolute top-0 bottom-0 bg-conflict/70"
            style={{ left: `${left}%`, width: `${width}%` }}
          />
        );
      })}
    </div>
  );
}
