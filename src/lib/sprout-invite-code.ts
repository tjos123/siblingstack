// src/lib/sprout-invite-code.ts
//
// Server-only: mints and verifies signed household-invite codes for the Sprout
// baby tracker. A code is `base64url(payload).base64url(HMAC-SHA256(payload))`
// signed with the service role key, so clients cannot forge or tamper with the
// household / baby id they carry. Checked server-side in the join endpoint.
import { createHmac, timingSafeEqual } from "crypto";
import type { BabySex } from "@/sprout/lib/types";

export interface SproutInvitePayload {
  v: 2;
  hh: string; // household id
  b: string; // baby row id (shared across both devices)
  n: string; // baby name
  bd: string; // birth date (YYYY-MM-DD)
  a: string; // avatar emoji
  c: string; // color
  s: BabySex | null;
  exp: number; // expiry, epoch seconds
}

const VERSION = 2;
export const INVITE_TTL_SECONDS = 7 * 24 * 60 * 60;

function secret(): string {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return value;
}

function toB64Url(input: Buffer): string {
  return input.toString("base64url");
}

function fromB64Url(input: string): Buffer {
  return Buffer.from(input, "base64url");
}

export interface SignInviteInput {
  householdId: string;
  babyId: string;
  name: string;
  birthDate: string;
  avatarEmoji: string;
  color: string;
  sex: BabySex | null;
}

export function signInvite(input: SignInviteInput): string {
  const payload: SproutInvitePayload = {
    v: VERSION,
    hh: input.householdId,
    b: input.babyId,
    n: input.name,
    bd: input.birthDate,
    a: input.avatarEmoji,
    c: input.color,
    s: input.sex ?? null,
    exp: Math.floor(Date.now() / 1000) + INVITE_TTL_SECONDS,
  };
  const body = JSON.stringify(payload);
  const sig = createHmac("sha256", secret()).update(body).digest();
  return `${toB64Url(Buffer.from(body, "utf8"))}.${toB64Url(sig)}`;
}

export function verifyInvite(code: string): SproutInvitePayload | null {
  const dot = code.indexOf(".");
  if (dot === -1) return null;
  const bodyB64 = code.slice(0, dot);
  const sigB64 = code.slice(dot + 1);

  let body: string;
  let sig: Buffer;
  try {
    body = fromB64Url(bodyB64).toString("utf8");
    sig = fromB64Url(sigB64);
  } catch {
    return null;
  }

  const expected = createHmac("sha256", secret()).update(body).digest();
  if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) {
    return null;
  }

  let payload: SproutInvitePayload;
  try {
    payload = JSON.parse(body) as SproutInvitePayload;
  } catch {
    return null;
  }
  if (payload.v !== VERSION) return null;
  if (typeof payload.hh !== "string" || typeof payload.b !== "string") return null;
  if (
    payload.exp <= Math.floor(Date.now() / 1000)
  ) {
    return null;
  }
  return payload;
}