import { describe, expect, it } from "vitest";
import { pickHouseholdId } from "@/lib/household-preference";

describe("pickHouseholdId", () => {
  it("returns null when there are no households", () => {
    expect(pickHouseholdId([], null)).toBeNull();
  });

  it("falls back to the first household without a preference", () => {
    expect(pickHouseholdId(["own", "joined"], null)).toBe("own");
  });

  it("prefers the joined household while the user is still a member", () => {
    expect(pickHouseholdId(["own", "joined"], "joined")).toBe("joined");
  });

  it("ignores a stale preference the user is no longer a member of", () => {
    expect(pickHouseholdId(["own", "joined"], "gone")).toBe("own");
  });
});
