import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  INVITE_TTL_SECONDS,
  signInvite,
  verifyInvite,
} from "@/lib/sprout-invite-code";
import { isSignedInviteCode } from "@/sprout/lib/share";

const input = {
  householdId: "hh_123",
  babyId: "baby_456",
  name: "Nova 🌱",
  birthDate: "2026-01-02",
  avatarEmoji: "🍼",
  color: "sage",
  sex: "female" as const,
};

describe("sprout invite code", () => {
  beforeEach(() => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-secret";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("round-trips a signed invite payload", () => {
    const code = signInvite(input);
    expect(isSignedInviteCode(code)).toBe(true);

    const parsed = verifyInvite(code);
    expect(parsed).not.toBeNull();
    expect(parsed).toMatchObject({
      v: 2,
      hh: input.householdId,
      b: input.babyId,
      n: input.name,
      bd: input.birthDate,
      a: input.avatarEmoji,
      c: input.color,
      s: input.sex,
    });
  });

  it("rejects a tampered payload", () => {
    const code = signInvite(input);
    const [, sig] = code.split(".");
    const forgedBody = Buffer.from(
      JSON.stringify({
        v: 2,
        hh: "someone_elses_household",
        b: "baby_x",
        n: "x",
        bd: "2026-01-02",
        a: "🌱",
        c: "sage",
        s: null,
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
      "utf8",
    ).toString("base64url");

    expect(verifyInvite(`${forgedBody}.${sig}`)).toBeNull();
  });

  it("rejects a code signed with a different secret", () => {
    const code = signInvite(input);
    process.env.SUPABASE_SERVICE_ROLE_KEY = "another-secret";
    expect(verifyInvite(code)).toBeNull();
  });

  it("rejects an expired invite", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const code = signInvite(input);

    vi.setSystemTime(new Date(Date.now() + (INVITE_TTL_SECONDS + 60) * 1000));
    expect(verifyInvite(code)).toBeNull();
  });

  it("ignores legacy (unsigned) profile codes", () => {
    const legacy = Buffer.from(
      JSON.stringify({ v: 1, name: "Baby" }),
      "utf8",
    ).toString("base64url");
    expect(isSignedInviteCode(legacy)).toBe(false);
    expect(verifyInvite(legacy)).toBeNull();
  });
});