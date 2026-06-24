"use client";

import { addDays, formatDayLabel, startOfDay } from "@/lib/time";
import { useState } from "react";

interface Props {
  dayStart: number;
  onChange: (newDayStart: number) => void;
}

export default function DateNav({ dayStart, onChange }: Props) {
  const isToday = dayStart === startOfDay();
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => onChange(addDays(dayStart, -1))}
        className="text-ink-muted text-sm px-2 py-1 hover:text-ink"
        aria-label="Previous day"
      >
        ← Prev
      </button>

      <div className="text-center relative">
        <button onClick={() => setPickerOpen(!pickerOpen)} className="text-center">
          <p className="font-mono text-sm text-ink">{formatDayLabel(dayStart)}</p>
          {!isToday && (
            <span className="text-childA text-xs underline mt-0.5 block">
              Jump to today
            </span>
          )}
        </button>
        {pickerOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-10 bg-surface2 rounded-md p-2 shadow-lg border border-surface2">
            <input
              type="date"
              value={new Date(dayStart).toISOString().slice(0, 10)}
              onChange={(e) => {
                if (e.target.value) {
                  onChange(new Date(e.target.value).getTime());
                  setPickerOpen(false);
                }
              }}
              className="bg-surface border border-surface2 rounded-md px-2 py-1 text-ink text-xs"
              autoFocus
            />
          </div>
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
