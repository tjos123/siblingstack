// src/lib/nl-log-parser.ts
//
// Lightweight natural-language log parser. Turns terse parent-speak into
// a structured event:
//   "maya napped 2-3pm"
//   "leo feed 30ml at 9:15"
//   "diaper change for jacy at 4:30"
//   "baby slept 12:30-2"
// Falls back to best-effort field extraction (child, type, time range)
// and returns null when nothing can be confidently parsed.

import type { EventType } from "@/types/models";

export interface ParsedLog {
  childIndex: number | null; // index into children[]
  type: EventType;
  startMinuteOfDay: number;
  endMinuteOfDay: number | null;
  notes?: string;
}

type ChildMatch = { index: number; token: string };

const TYPE_KEYWORDS: { regex: RegExp; type: EventType }[] = [
  { regex: /\bslept?\b|\bnap(?:ped|ping)?\b|\basleep\b|\bdown\b/gi, type: "sleep" },
  { regex: /\bfeed?\b|\bate\b|\bbottle\b|\bnursed\b|\bbreast\b|\bformula\b|\bmeal\b|\bmilk\b|\bml\b|\boz\b/gi, type: "feed" },
  { regex: /\bdiaper\b|\bpoop\b|\bpee\b|\bwet\b|\bsoil\b|\bchange(?:d)?\b/gi, type: "diaper" },
  { regex: /\bmilestone\b|\bfirst\s+\w+\b|\brolling|\bwalk(?:ed)?\b|\bsmiled\b|\bsaid\b/gi, type: "milestone" },
  { regex: /\bnit\b|\bnote\b|\btantrum\b|\bmedication\b|\bmedicine\b|\bsick\b|\bfever\b/gi, type: "note" },
];

function parseTime(token: string): number | null {
  const twelve = token.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)/i);
  if (twelve) {
    let hour = Number(twelve[1]);
    const minute = Number(twelve[2] ?? "0");
    const suffix = twelve[3].toLowerCase().replace(/\./g, "");
    if (suffix === "pm" && hour < 12) hour += 12;
    if (suffix === "am" && hour === 12) hour = 0;
    return hour * 60 + minute;
  }

  const twentyFour = token.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFour) {
    const hour = Number(twentyFour[1]);
    if (hour > 23 || Number(twentyFour[2]) > 59) return null;
    return hour * 60 + Number(twentyFour[2]);
  }

  const relative = token.match(/^(1[0-2]|[1-9])(?::(\d{2}))?\s*(am|pm|noon|o'clock)?$/i);
  if (relative) {
    let hour = Number(relative[1]);
    const minute = Number(relative[2] ?? "0");
    const suffix = (relative[3] ?? "").toLowerCase();
    if (suffix === "pm" && hour < 12) hour += 12;
    if (suffix === "am" && hour === 12) hour = 0;
    if (suffix === "noon") hour = 12;
    return hour * 60 + minute;
  }

  return null;
}

function extractTimeRanges(text: string): { start: number; end: number | null } | null {
  // Pattern: X-Y where both sides are times, e.g. "2-3pm", "12:30-2", "2pm-3"
  const range = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:to|until|-|–)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (range) {
    // If only one side has an am/pm suffix, inherit it onto the bare side
    const suffix = range[3] ?? range[6];
    const startToken = `${range[1]}${range[2] ? `:${range[2]}` : ""}${suffix ?? ""}`;
    const endToken = `${range[4]}${range[5] ? `:${range[5]}` : ""}${suffix ?? ""}`;
    const startMinute = parseTime(startToken);
    const endMinute = parseTime(endToken);
    if (startMinute !== null && endMinute !== null) {
      return { start: startMinute, end: endMinute > startMinute ? endMinute : null };
    }
  }

  // Pattern: single time with am/pm, e.g. "at 2pm" or "9:30pm"
  const single = text.match(/(\d{1,2}):?(\d{2})?\s*(am|pm|noon|o'clock)/i);
  if (single) {
    const minute = parseTime(`${single[1]}${single[2] ? `:${single[2]}` : ""} ${single[3]}`);
    if (minute !== null) return { start: minute, end: null };
  }

  // Pattern: single 24-hour time, e.g. "at 10:00"
  const single24 = text.match(/(\d{1,2}):(\d{2})(?!\s*(?:am|pm))/i);
  if (single24) {
    const minute = parseTime(`${single24[1]}:${single24[2]}`);
    if (minute !== null) return { start: minute, end: null };
  }

  return null;
}

function findChild(text: string, names: string[]): ChildMatch | null {
  for (let i = 0; i < names.length; i++) {
    const name = names[i].trim();
    if (!name) continue;
    const lower = name.toLowerCase();
    if (text.toLowerCase().includes(lower)) {
      return { index: i, token: lower };
    }
  }
  return null;
}

export function parseNaturalLog(input: string, childNames: string[]): ParsedLog | null {
  const text = input.trim().toLowerCase();
  if (text.length < 2) return null;

  const child = findChild(text, childNames);
  const times = extractTimeRanges(text);

  let type: EventType | null = null;
  for (const { regex, type: candidate } of TYPE_KEYWORDS) {
    if (regex.test(text)) { type = candidate; break; }
  }

  // "at" or a bare time with no other keyword is assumed sleep (most
  // common terse log for dual-kid households)
  if (!type && times) type = "sleep";

  if (!type) return null;

  return {
    childIndex: child?.index ?? null,
    type,
    startMinuteOfDay: times?.start ?? nowMinuteOfDay(),
    endMinuteOfDay: times?.end ?? null,
    notes: undefined,
  };
}

function nowMinuteOfDay(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}