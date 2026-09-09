// src/lib/billing.ts
// Billing actions now talk to Paddle (merchant of record).
//
//   Checkout — Paddle.js checkout overlay, opened client-side. The price
//   comes from NEXT_PUBLIC_PADDLE_MONTHLY/ANNUAL_PRICE_ID. household_id
//   is attached as custom_data so the webhook knows which household to
//   upgrade.
//
//   Portal   — calls /api/paddle/portal, which resolves the household's
//   active subscription and returns Paddle's management URLs (cancel /
//   update payment method) for the user to open.

import { supabase } from "@/lib/supabase";

export type BillingInterval = "monthly" | "annual";

export async function inviteCaregiver(householdId: string, email: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await fetch("/api/caregiver/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ householdId, email }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Invite failed");
  }
}

// Injects the Paddle.js script exactly once, then returns the global
// Paddle instance. Rejects clearly before Paddle is configured.
async function getPaddle(): Promise<PaddleInstance> {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) throw new Error("Paddle isn't configured yet on this environment.");

  let paddle = window.Paddle;
  if (paddle) return paddle;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[src*="paddle.com/paddle/v2/paddle.js"]');
    if (existing) { existing.addEventListener("load", () => resolve()); return; }
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Couldn't load Paddle."));
    document.head.appendChild(script);
  });

  paddle = window.Paddle;
  if (!paddle) throw new Error("Couldn't load Paddle.");

  paddle.Environment.set(
    process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "sandbox" ? "sandbox" : "production"
  );

  return paddle;
}

export async function startCheckout(interval: BillingInterval = "annual"): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const paddle = await getPaddle();
  await paddle.Initialize({ token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN! });

  // Resolve this user's household so the webhook can map the subscription
  const { data, error } = await supabase
    .from("household_caregivers")
    .select("household_id")
    .eq("user_id", session.user.id)
    .limit(1)
    .single();
  if (error || !data) throw new Error("No household found — finish onboarding first.");

  const priceId =
    interval === "annual"
      ? process.env.NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID!
      : process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID!;
  if (!priceId) throw new Error("Paddle isn't configured yet on this environment.");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "https://www.siblingstack.com";

  paddle.Checkout.open({
    settings: {
      theme: "light",
      successUrl: `${appUrl}/app?upgraded=1`,
      successUrlNetworkDelay: 2,
    },
    items: [{ priceId, quantity: 1 }],
    customData: {
      household_id: data.household_id,
      user_id: session.user.id,
      interval,
    },
  });
}

export async function openBillingPortal(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await fetch("/api/paddle/portal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Portal failed");
  }

  const { url } = await res.json();
  if (!url) throw new Error("No billing page available for this subscription.");
  window.location.href = url;
}