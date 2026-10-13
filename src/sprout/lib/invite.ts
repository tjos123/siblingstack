// src/sprout/lib/invite.ts
//
// Client-side helpers for household invites (signed codes minted by
// /api/sprout/invite). Also carries the interstitial storage used to survive
// the "sign in to join" redirect: the code is stashed in sessionStorage and
// picked up again on the tracker page after the auth round-trip.
import { supabase } from "@/lib/supabase";
import type { BabySex } from "./types";

export interface MintInviteInput {
  householdId: string;
  babyId: string;
  name: string;
  birthDate: string;
  avatarEmoji: string;
  color: string;
  sex?: BabySex;
}

export async function mintInvite(input: MintInviteInput): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Sign in to invite a caregiver.");
  const res = await fetch("/api/sprout/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(input),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.error ?? "Couldn't generate the invite.");
  return body.code as string;
}

export interface InvitedBaby {
  id: string;
  name: string;
  birthDate: string;
  avatarEmoji: string;
  color: string;
  sex: BabySex | null;
}

export interface JoinInviteResult {
  householdId: string;
  baby: InvitedBaby;
}

export async function joinInvite(code: string): Promise<JoinInviteResult> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Sign in to join a family.");
  const res = await fetch("/api/sprout/invite/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ code: code.trim() }),
  });
  const body = (await res.json().catch(() => null)) as
    | (JoinInviteResult & { error?: string })
    | null;
  if (!res.ok) throw new Error(body?.error ?? "Couldn't join — check the invite link.");
  return body as JoinInviteResult;
}

// Open a minted link. Signed codes are safe to place in a query string because
// they're validated server-side; the tracker page reads them from ?invite=.
export function inviteUrl(code: string, origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/sprout-baby-tracker?invite=${encodeURIComponent(code)}`;
}

export function readInviteCodeFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("invite");
}

const JOIN_CODE_KEY = "sprout_join_code";

export function saveJoinCode(code: string) {
  try {
    window.sessionStorage.setItem(JOIN_CODE_KEY, code);
  } catch {
    /* storage unavailable */
  }
}

export function takeJoinCode(): string | null {
  try {
    const code = window.sessionStorage.getItem(JOIN_CODE_KEY);
    window.sessionStorage.removeItem(JOIN_CODE_KEY);
    return code;
  } catch {
    return null;
  }
}