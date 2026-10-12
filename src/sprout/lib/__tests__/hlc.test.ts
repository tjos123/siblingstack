import { describe, expect, it } from "vitest";
import { isNewer, nextHlc, observeHlc } from "../hlc";

describe("hlc", () => {
  it("produces strictly increasing clocks", () => {
    const a = nextHlc(1_000);
    const b = nextHlc(1_000);
    const c = nextHlc(1_001);
    expect(a < b).toBe(true);
    expect(b < c).toBe(true);
  });

  it("stays monotonic when the wall clock goes backwards", () => {
    const a = nextHlc(5_000);
    const b = nextHlc(1_000); // clock jumped back
    expect(b > a).toBe(true);
  });

  it("advances past an observed remote clock", () => {
    observeHlc("000000000009999999:000000:abcdef");
    const next = nextHlc(1_000);
    expect(next > "000000000009999999:000000:abcdef").toBe(true);
  });

  it("isNewer only when strictly greater", () => {
    expect(isNewer("b", "a")).toBe(true);
    expect(isNewer("a", "a")).toBe(false);
    expect(isNewer("", "a")).toBe(false);
    expect(isNewer("a", undefined)).toBe(true);
  });
});
