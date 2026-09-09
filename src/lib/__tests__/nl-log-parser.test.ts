import { describe, it, expect } from "vitest";
import { parseNaturalLog } from "@/lib/nl-log-parser";

const KIDS = ["Maya", "Leo"];

describe("parseNaturalLog", () => {
  it("returns null for garbage input", () => {
    expect(parseNaturalLog("asdf qwerty", KIDS)).toBeNull();
  });

  it("parses a sleep range with child name", () => {
    const r = parseNaturalLog("Maya napped 2-3pm", KIDS)!;
    expect(r.childIndex).toBe(0);
    expect(r.type).toBe("sleep");
    expect(r.startMinuteOfDay).toBe(14 * 60);
    expect(r.endMinuteOfDay).toBe(15 * 60);
  });

  it("inherits pm suffix for the end time", () => {
    const r = parseNaturalLog("Leo slept 12-2pm", KIDS)!;
    expect(r.type).toBe("sleep");
    expect(r.startMinuteOfDay).toBe(12 * 60);
    expect(r.endMinuteOfDay).toBe(14 * 60);
  });

  it("parses feed with amount keyword", () => {
    const r = parseNaturalLog("Leo feed 30ml at 9:15am", KIDS)!;
    expect(r.childIndex).toBe(1);
    expect(r.type).toBe("feed");
    expect(r.startMinuteOfDay).toBe(9 * 60 + 15);
  });

  it("parses diaper change", () => {
    const r = parseNaturalLog("diaper change for maya at 4:30", KIDS)!;
    expect(r.childIndex).toBe(0);
    expect(r.type).toBe("diaper");
  });

  it("defaults to sleep for bare time logs", () => {
    const r = parseNaturalLog("Maya at 10:00", KIDS)!;
    expect(r.type).toBe("sleep");
  });

  it("treats today's times as within today", () => {
    const r = parseNaturalLog("Leo napped 3-4pm", KIDS)!;
    expect(r.startMinuteOfDay).toBeLessThanOrEqual(24 * 60);
    expect(r.endMinuteOfDay).toBe(r.startMinuteOfDay + 60);
  });
});