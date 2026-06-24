// src/lib/time.ts

export function startOfDay(date: Date = new Date()): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function addDays(dayStart: number, n: number): number {
  return dayStart + n * DAY_MS;
}

// Converts a timestamp to a 0-100 horizontal position within its day —
// what the timeline lanes use to place event blocks.
export function dayPositionPercent(timestamp: number, dayStart: number): number {
  const clamped = Math.min(Math.max(timestamp, dayStart), dayStart + DAY_MS);
  return ((clamped - dayStart) / DAY_MS) * 100;
}

export function formatClockTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

// Predictions work in "minutes since midnight" rather than absolute
// timestamps, since they're not tied to a specific day. This renders
// that back into a normal clock time string.
export function formatMinuteOfDay(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = Math.round(minutes % 60);
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatDayLabel(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

// "8 months", "2.4 yr" — used in the lane headers next to each child's name
export function formatAge(birthDateIso: string): string {
  const birth = new Date(birthDateIso);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());

  if (months < 24) {
    return `${months} mo`;
  }
  return `${(months / 12).toFixed(1)} yr`;
}

// Converts an epoch ms timestamp to the value a <input type="datetime-local">
// expects ("YYYY-MM-DDTHH:mm"), in the browser's local time — not UTC,
// which is what toISOString() would give you and is wrong here.
export function toDatetimeLocalValue(timestamp: number): string {
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// The inverse — a datetime-local input's value string back to epoch ms.
// JS interprets a timezone-less "YYYY-MM-DDTHH:mm" string as local time
// by default, which is exactly the behavior we want here.
export function fromDatetimeLocalValue(value: string): number {
  return new Date(value).getTime();
}
