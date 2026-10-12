import { describe, expect, it } from "vitest";
import { describeSyncError } from "../sync-error";

describe("describeSyncError", () => {
  it("returns Error messages as-is", () => {
    expect(describeSyncError(new Error("boom"))).toBe("boom");
  });

  it("reads Postgrest error objects instead of rendering [object Object]", () => {
    const err = {
      message: "Could not find the function public.sprout_merge(p_payload)",
      details: null,
      hint: null,
      code: "PGRST202",
    };
    const out = describeSyncError(err);
    expect(out).toContain("Could not find the function");
    expect(out).toContain("migrations 006");
    expect(out).not.toContain("[object Object]");
  });

  it("joins message, details and hint", () => {
    const out = describeSyncError({
      message: "fail",
      details: "bad payload",
      hint: "try again",
    });
    expect(out).toBe("fail — bad payload — try again");
  });

  it("falls back to the code when there is no message", () => {
    expect(describeSyncError({ code: "23503" })).toBe("Sync failed (23503)");
  });

  it("handles strings, null and undefined", () => {
    expect(describeSyncError("nope")).toBe("nope");
    expect(describeSyncError(null)).toBe("Sync failed");
    expect(describeSyncError(undefined)).toBe("Sync failed");
  });

  it("uses a custom toString instead of rendering [object Object]", () => {
    const err = { toString: () => "Custom failure" };
    expect(describeSyncError(err)).toBe("Custom failure");
  });

  it("never returns {} for an opaque object", () => {
    const out = describeSyncError(Object.create({ message: "hidden" }));
    expect(out).not.toBe("{}");
    expect(out).not.toContain("[object Object]");
  });
});
