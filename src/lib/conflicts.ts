// src/lib/conflicts.ts
//
// This is the one piece of logic that doesn't exist in any generic baby
// tracker: given both kids' events for a day, find where their schedules
// overlap or collide (e.g. both need a feed within the same 20-minute
// window, or one's nap window is being blocked by the other's wake time).
//
// Kept as a pure function — no Firestore calls in here — so it's easy to
// unit test and easy to later move into a Cloud Function if you want to
// precompute it server-side instead of on every client render.

import type { ScheduleEvent, ConflictWindow, EventType } from "@/types/models";

const CONFLICT_TYPES: EventType[] = ["feed", "sleep"];

// Two events "conflict" if their time ranges overlap at all. An ongoing
// event (endTime === null) is treated as extending to `now`.
function overlaps(a: ScheduleEvent, b: ScheduleEvent, now: number): boolean {
  const aEnd = a.endTime ?? now;
  const bEnd = b.endTime ?? now;
  return a.startTime < bEnd && b.startTime < aEnd;
}

export function findConflicts(
  childAId: string,
  childBId: string,
  events: ScheduleEvent[],
  now: number = Date.now()
): ConflictWindow[] {
  const conflicts: ConflictWindow[] = [];

  const aEvents = events.filter(
    (e) => e.childId === childAId && CONFLICT_TYPES.includes(e.type)
  );
  const bEvents = events.filter(
    (e) => e.childId === childBId && CONFLICT_TYPES.includes(e.type)
  );

  for (const a of aEvents) {
    for (const b of bEvents) {
      if (a.type !== b.type) continue; // only flag same-type collisions for now
      if (overlaps(a, b, now)) {
        conflicts.push({
          type: a.type,
          childAId,
          childBId,
          overlapStart: Math.max(a.startTime, b.startTime),
          overlapEnd: Math.min(a.endTime ?? now, b.endTime ?? now),
        });
      }
    }
  }

  return conflicts.sort((x, y) => x.overlapStart - y.overlapStart);
}
