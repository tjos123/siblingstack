import { describe, it, expect } from "vitest";
import { findConflicts } from "@/lib/conflicts";
import type { ScheduleEvent } from "@/types/models";

const CHILD_A = "child-a";
const CHILD_B = "child-b";
const CHILD_C = "child-c"; // used to confirm a third child's events are ignored

let nextId = 0;
function event(overrides: Partial<ScheduleEvent>): ScheduleEvent {
  nextId += 1;
  return {
    id: `event-${nextId}`,
    householdId: "household-1",
    childId: CHILD_A,
    type: "sleep",
    startTime: 0,
    endTime: 0,
    createdBy: "user-1",
    createdAt: 0,
    ...overrides,
  };
}

describe("findConflicts", () => {
  it("returns no conflicts when there are no events", () => {
    expect(findConflicts(CHILD_A, CHILD_B, [])).toEqual([]);
  });

  it("returns no conflicts for non-overlapping sleep windows", () => {
    const events = [
      event({ childId: CHILD_A, type: "sleep", startTime: 0, endTime: 100 }),
      event({ childId: CHILD_B, type: "sleep", startTime: 200, endTime: 300 }),
    ];
    expect(findConflicts(CHILD_A, CHILD_B, events)).toEqual([]);
  });

  it("detects an overlapping sleep window and reports the correct overlap range", () => {
    const events = [
      event({ childId: CHILD_A, type: "sleep", startTime: 0, endTime: 100 }),
      event({ childId: CHILD_B, type: "sleep", startTime: 50, endTime: 150 }),
    ];
    const conflicts = findConflicts(CHILD_A, CHILD_B, events);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toMatchObject({
      type: "sleep",
      overlapStart: 50,
      overlapEnd: 100,
    });
  });

  it("does not flag a conflict when events of different types overlap", () => {
    const events = [
      event({ childId: CHILD_A, type: "sleep", startTime: 0, endTime: 100 }),
      event({ childId: CHILD_B, type: "feed", startTime: 50, endTime: 150 }),
    ];
    expect(findConflicts(CHILD_A, CHILD_B, events)).toEqual([]);
  });

  it("ignores diaper events entirely, even if they overlap", () => {
    const events = [
      event({ childId: CHILD_A, type: "diaper", startTime: 0, endTime: 0 }),
      event({ childId: CHILD_B, type: "diaper", startTime: 0, endTime: 0 }),
    ];
    expect(findConflicts(CHILD_A, CHILD_B, events)).toEqual([]);
  });

  it("treats events that merely touch (no overlap) as not conflicting", () => {
    const events = [
      event({ childId: CHILD_A, type: "feed", startTime: 0, endTime: 100 }),
      event({ childId: CHILD_B, type: "feed", startTime: 100, endTime: 200 }),
    ];
    expect(findConflicts(CHILD_A, CHILD_B, events)).toEqual([]);
  });

  it("treats an ongoing event (endTime null) as extending to `now`", () => {
    const now = 1000;
    const events = [
      event({ childId: CHILD_A, type: "sleep", startTime: 0, endTime: null }), // still ongoing
      event({ childId: CHILD_B, type: "sleep", startTime: 500, endTime: 700 }),
    ];
    const conflicts = findConflicts(CHILD_A, CHILD_B, events, now);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toMatchObject({ overlapStart: 500, overlapEnd: 700 });
  });

  it("ignores events belonging to a child outside the requested pair", () => {
    const events = [
      event({ childId: CHILD_A, type: "sleep", startTime: 0, endTime: 100 }),
      event({ childId: CHILD_C, type: "sleep", startTime: 50, endTime: 150 }),
    ];
    expect(findConflicts(CHILD_A, CHILD_B, events)).toEqual([]);
  });

  it("returns multiple conflicts sorted by overlap start time", () => {
    const events = [
      // later conflict, listed first in the input on purpose
      event({ childId: CHILD_A, type: "feed", startTime: 500, endTime: 600 }),
      event({ childId: CHILD_B, type: "feed", startTime: 550, endTime: 650 }),
      // earlier conflict
      event({ childId: CHILD_A, type: "sleep", startTime: 0, endTime: 100 }),
      event({ childId: CHILD_B, type: "sleep", startTime: 50, endTime: 150 }),
    ];
    const conflicts = findConflicts(CHILD_A, CHILD_B, events);
    expect(conflicts).toHaveLength(2);
    expect(conflicts[0].type).toBe("sleep");
    expect(conflicts[1].type).toBe("feed");
  });
});
