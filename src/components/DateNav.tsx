"use client";

import { addDays, formatDayLabel, startOfDay } from "@/lib/time";

interface Props {
  dayStart: number;
  onChange: (newDayStart: number) => void;
}

export default function DateNav({ dayStart, onChange }: Props) {
  const isToday = dayStart === startOfDay();

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => onChange(addDays(dayStart, -1))}
        className="text-ink-muted text-sm px-2 py-1 hover:text-ink"
        aria-label="Previous day"
      >
        ← Prev
      </button>

      <div className="text-center">
        <p className="font-mono text-sm text-ink">{formatDayLabel(dayStart)}</p>
        {!isToday && (
          <button
            onClick={() => onChange(startOfDay())}
            className="text-childA text-xs underline mt-0.5"
          >
            Jump to today
          </button>
        )}
      </div>

      <button
        onClick={() => onChange(addDays(dayStart, 1))}
        disabled={isToday}
        className="text-ink-muted text-sm px-2 py-1 hover:text-ink disabled:opacity-30 disabled:hover:text-ink-muted"
        aria-label="Next day"
      >
        Next →
      </button>
    </div>
  );
}
