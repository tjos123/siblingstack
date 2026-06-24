"use client";

import { dayPositionPercent, formatClockTime, formatAge, startOfDay } from "@/lib/time";
import type { Child, ScheduleEvent } from "@/types/models";

interface Props {
  child: Child;
  events: ScheduleEvent[];
  dayStart: number;
  accent: "childA" | "childB";
}

const TYPE_LABEL: Record<string, string> = {
  sleep: "Sleep",
  feed: "Feed",
  diaper: "Diaper",
  milestone: "Milestone",
  note: "Note",
};

export default function TimelineLane({ child, events, dayStart, accent }: Props) {
  const now = Date.now();
  const isToday = dayStart === startOfDay();
  // For an ongoing event, "now" only makes sense if we're looking at today.
  // On a past day, cap the bar at end-of-day instead of drawing it through
  // a "now" that isn't actually on this timeline.
  const openEventEnd = isToday ? now : dayStart + 24 * 60 * 60 * 1000;
  const hourMarks = [0, 6, 12, 18, 24];

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            accent === "childA" ? "bg-childA" : "bg-childB"
          }`}
        />
        <h2 className="font-display text-lg text-ink">{child.name}</h2>
        <span className="text-xs text-ink-muted font-mono">
          {formatAge(child.birthDate)}
        </span>
      </div>

      <div className="relative h-12 bg-surface rounded-md overflow-hidden">
        {/* hour gridlines */}
        {hourMarks.map((h) => (
          <div
            key={h}
            className="absolute top-0 bottom-0 w-px bg-surface2"
            style={{ left: `${(h / 24) * 100}%` }}
          />
        ))}

        {/* event blocks */}
        {events
          .filter((e) => e.childId === child.id)
          .map((e) => {
            const left = dayPositionPercent(e.startTime, dayStart);
            const right = dayPositionPercent(e.endTime ?? openEventEnd, dayStart);
            const width = Math.max(right - left, 0.6);
            const isOngoing = e.endTime === null;
            return (
              <div
                key={e.id}
                title={`${TYPE_LABEL[e.type]} · ${formatClockTime(e.startTime)}${
                  e.endTime ? ` – ${formatClockTime(e.endTime)}` : " – now"
                }`}
                className={`absolute top-1 bottom-1 rounded-sm ${
                  accent === "childA" ? "bg-childA" : "bg-childB"
                } ${isOngoing ? "animate-pulse" : ""}`}
                style={{ left: `${left}%`, width: `${width}%`, opacity: e.type === "sleep" ? 1 : 0.55 }}
              />
            );
          })}

        {/* now line — only meaningful when viewing today */}
        {isToday && (
          <div
            className="absolute top-0 bottom-0 w-px bg-ink animate-pulse"
            style={{ left: `${dayPositionPercent(now, dayStart)}%` }}
          />
        )}
      </div>

      <div className="flex justify-between text-[10px] text-ink-muted font-mono mt-1">
        <span>12am</span>
        <span>6am</span>
        <span>12pm</span>
        <span>6pm</span>
        <span>12am</span>
      </div>
    </div>
  );
}
