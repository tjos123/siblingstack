// src/lib/billing.ts
// Billing actions now hit Next.js API routes instead of Cloud Functions.
// Stripe API routes (checkout, portal) to be added when payment is enabled.

import { supabase } from "@/lib/supabase";

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

export async function startCheckout(): Promise<void> {
  // Placeholder — wire up Paddle/PayPal when subscription is re-enabled
  throw new Error("Subscription billing not yet configured.");
}

export async function openBillingPortal(): Promise<void> {
  // Placeholder — wire up billing portal when subscription is re-enabled
  throw new Error("Billing portal not yet configured.");
}
