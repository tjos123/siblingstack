import type { Baby, BabySex } from "./types";

export interface InvitePayload {
  v: 1;
  name: string;
  birthDate: string;
  avatarEmoji: string;
  sex?: BabySex;
  issuedAt: string;
}

function toBase64Url(input: string) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const withPad = padded + "=".repeat((4 - (padded.length % 4)) % 4);
  const binary = atob(withPad);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeInvite(baby: Baby): string {
  const payload: InvitePayload = {
    v: 1,
    name: baby.name,
    birthDate: baby.birthDate,
    avatarEmoji: baby.avatarEmoji,
    sex: baby.sex,
    issuedAt: new Date().toISOString(),
  };
  return toBase64Url(JSON.stringify(payload));
}

export function decodeInvite(code: string): InvitePayload | null {
  try {
    const trimmed = code.trim();
    const raw = trimmed.includes("invite=")
      ? trimmed.slice(trimmed.indexOf("invite=") + "invite=".length).split("&")[0]
      : trimmed;
    const parsed = JSON.parse(fromBase64Url(raw)) as InvitePayload;
    if (parsed && parsed.v === 1 && typeof parsed.name === "string") return parsed;
    return null;
  } catch {
    return null;
  }
}

export function buildInviteLink(baby: Baby, origin?: string): string {
  const base =
    origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/?invite=${encodeInvite(baby)}`;
}

export function readInviteFromUrl(): InvitePayload | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const code = params.get("invite");
  if (!code) return null;
  return decodeInvite(code);
}

export function clearInviteFromUrl() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("invite");
  window.history.replaceState({}, "", url.toString());
}
