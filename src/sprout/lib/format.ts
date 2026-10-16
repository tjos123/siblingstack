import {
  differenceInSeconds,
  endOfDay,
  format,
  isSameDay,
  isToday,
  isYesterday,
  startOfDay,
  subDays,
} from "date-fns";

export function toDate(value: string | number | Date) {
  return value instanceof Date ? value : new Date(value);
}

export function isoDay(value: string | number | Date) {
  return format(toDate(value), "yyyy-MM-dd");
}

export function dayKey(value: string | number | Date) {
  return isoDay(value);
}

export function startOfDayDate(value: string | number | Date) {
  return startOfDay(toDate(value));
}

export function endOfDayDate(value: string | number | Date) {
  return endOfDay(toDate(value));
}

export function daysAgo(n: number, base: Date = new Date()) {
  return startOfDay(subDays(base, n));
}

export function isSameLocalDay(a: string | number | Date, b: string | number | Date) {
  return isSameDay(toDate(a), toDate(b));
}

export function formatClock(value: string | number | Date) {
  return format(toDate(value), "h:mm a");
}

export function formatClockShort(value: string | number | Date) {
  return format(toDate(value), "h:mma").replace(":00", "");
}

export function formatDateShort(value: string | number | Date) {
  return format(toDate(value), "MMM d");
}

export function formatDateLong(value: string | number | Date) {
  return format(toDate(value), "EEE, MMM d");
}

export function formatDateFull(value: string | number | Date) {
  return format(toDate(value), "EEEE, MMMM d");
}

export function formatMonthYear(value: string | number | Date) {
  return format(toDate(value), "MMMM yyyy");
}

export function formatDayLabel(value: string | number | Date) {
  const date = toDate(value);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEE, MMM d");
}

export function elapsedSecondsSince(value: string | number | Date, now = Date.now()) {
  return Math.max(0, Math.floor((now - toDate(value).getTime()) / 1000));
}

export function durationBetweenSeconds(
  start: string | number | Date,
  end: string | number | Date,
) {
  return Math.max(0, differenceInSeconds(toDate(end), toDate(start)));
}

export function elapsedLabel(value: string | number | Date, now = Date.now()) {
  const seconds = elapsedSecondsSince(value, now);
  const mins = Math.floor(seconds / 60);
  if (mins < 1) return "just now";
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days >= 1) return `${days}d ${hours % 24}h ago`;
  if (hours >= 1) return `${hours}h ${mins % 60}m ago`;
  return `${mins}m ago`;
}

export function humanDuration(seconds: number) {
  if (!seconds || seconds <= 0) return "0m";
  const mins = Math.round(seconds / 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h >= 1) return m ? `${h}h ${m}m` : `${h}h`;
  return `${m}m`;
}

export function humanDurationFromMinutes(minutes: number) {
  return humanDuration(Math.round(minutes * 60));
}

export function timerClock(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function relativeFromNow(value: string | number | Date) {
  return formatDistanceShort(elapsedSecondsSince(value));
}

function formatDistanceShort(seconds: number) {
  const mins = Math.floor(seconds / 60);
  if (mins < 1) return "now";
  const h = Math.floor(mins / 60);
  if (h < 1) return `${mins}m`;
  const d = Math.floor(h / 24);
  if (d < 1) return `${h}h`;
  return `${d}d`;
}

export function dayRangeIso(value: string | number | Date) {
  const date = toDate(value);
  return {
    start: startOfDay(date).toISOString(),
    end: endOfDay(date).toISOString(),
  };
}

export function ageFromBirthDate(birthDate: string | Date, now = new Date()) {
  const birth = toDate(birthDate);
  const totalDays = Math.max(
    0,
    Math.floor((now.getTime() - birth.getTime()) / 86400000),
  );
  const months = Math.floor(totalDays / 30.4375);
  const weeks = Math.floor((totalDays % 30.4375) / 7);
  const days = totalDays % 7;
  if (months >= 1) {
    return {
      label: months === 1 ? "1 month" : `${months} months`,
      detail: `${weeks} wk ${days} d`,
      totalDays,
    };
  }
  return {
    label: `${totalDays} days`,
    detail: `${weeks} wk ${days} d`,
    totalDays,
  };
}

export function weekStart(value: string | number | Date) {
  const date = startOfDay(toDate(value));
  const day = date.getDay();
  const diff = (day + 6) % 7;
  return startOfDay(subDays(date, diff));
}
