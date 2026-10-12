// src/sprout/lib/hlc.ts
//
// Hybrid Logical Clock. Every field we write gets stamped with an HLC string
// that is lexicographically sortable and monotonic even if the device clock
// jumps backwards. Format:
//
//   <millis:16><counter:6>:<actor>
//   "000001764000000000:000000:ab12cd"
//
// Comparison is a plain string compare, both here and in the SQL merge
// (008_sprout_merge.sql), which is what makes field-level last-write-wins
// cheap on the server.

const ACTOR_KEY = "sprout_hlc_actor";
const MAX_COUNTER = 999_999;

let lastMs = 0;
let counter = 0;
let actor: string | null = null;

function actorId(): string {
  if (actor) return actor;
  if (typeof window === "undefined") {
    actor = "000000";
    return actor;
  }
  let stored = window.localStorage.getItem(ACTOR_KEY);
  if (!stored) {
    stored = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0");
    window.localStorage.setItem(ACTOR_KEY, stored);
  }
  actor = stored;
  return actor;
}

function format(ms: number, count: number, who: string): string {
  return `${String(ms).padStart(16, "0")}:${String(count).padStart(6, "0")}:${who}`;
}

/** Produce a fresh clock string guaranteed greater than any we've produced. */
export function nextHlc(nowMs: number = Date.now()): string {
  if (nowMs > lastMs) {
    lastMs = nowMs;
    counter = 0;
  } else {
    counter += 1;
    if (counter > MAX_COUNTER) {
      lastMs += 1;
      counter = 0;
    }
  }
  return format(lastMs, counter, actorId());
}

/**
 * Advance our clock past a clock string observed from a remote write, so any
 * future local edit sorts after it.
 */
export function observeHlc(remote: string | null | undefined): void {
  if (!remote || typeof remote !== "string") return;
  const [msPart, countPart] = remote.split(":");
  const ms = Number(msPart);
  const count = Number(countPart);
  if (!Number.isFinite(ms) || !Number.isFinite(count)) return;
  if (ms > lastMs) {
    lastMs = ms;
    counter = count;
  } else if (ms === lastMs && count > counter) {
    counter = count;
  }
}

/** A clock is only "newer" if it is strictly greater than the other. */
export function isNewer(a: string | undefined | null, b: string | undefined | null): boolean {
  return (a ?? "") > (b ?? "");
}
