// src/app/api/paddle/webhook/route.ts
// Handles Paddle webhook events for subscription lifecycle.
// Signature is verified via the SDK (PADDLE_WEBHOOK_SECRET).
// The requested "household_id" rides along as custom_data on checkout.
import { NextRequest, NextResponse } from "next/server";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { serverSupabase } from "@/lib/supabase";

function getPaddle(): Paddle {
  const key = process.env.PADDLE_API_KEY;
  if (!key) throw new Error("Paddle is not configured");
  return new Paddle(key, {
    environment:
      process.env.PADDLE_ENVIRONMENT === "sandbox"
        ? Environment.sandbox
        : Environment.production,
  });
}

const SUBSCRIPTION_EVENTS = new Set([
  "subscription.created",
  "subscription.updated",
  "subscription.activated",
  "subscription.canceled",
  "subscription.paused",
  "subscription.resumed",
  "subscription.past_due",
  "subscription.trialing",
]);

// 'active' and 'trialing' bill as Pro; paused / past_due / canceled do not.
function isActiveSubscription(status: string): boolean {
  return status === "active" || status === "trialing";
}

export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Paddle is not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("paddle-signature") ?? "";

  let unmarshalled: ReturnType<Paddle["webhooks"]["unmarshal"]>;
  try {
    // unmarshal verifies the signature and throws when it doesn't match
    unmarshalled = getPaddle().webhooks.unmarshal(rawBody, secret, signature);
  } catch (err) {
    console.error("Paddle webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (!unmarshalled) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }
  // We only use a subset of fields from the subscription entity
  const event = unmarshalled as unknown as {
    eventType: string;
    data: {
      id: string;
      status: string;
      customerId?: string;
      customData?: Record<string, unknown> | null;
    };
  };

  if (!SUBSCRIPTION_EVENTS.has(event.eventType)) {
    return NextResponse.json({ received: true });
  }

  const db = serverSupabase();
  const subscription = event.data;

  const householdId = subscription.customData?.household_id as string | undefined;

  const isActive = isActiveSubscription(subscription.status);

  if (householdId) {
    await db
      .from("households")
      .update({
        plan_tier: isActive ? "pro" : "free",
        paddle_subscription_id: isActive ? subscription.id : null,
      })
      .eq("id", householdId);

    // Mirror to every member's legacy user-level premium flag
    const { data: members } = await db
      .from("household_caregivers")
      .select("user_id")
      .eq("household_id", householdId);

    if (members?.length) {
      await db
        .from("users")
        .update({
          premium_status: isActive ? "premium" : "free",
          paddle_customer_id:
            subscription.customerId ??
            undefined,
          paddle_subscription_id:
            isActive ? subscription.id : null,
        })
        .in("id", members.map((m) => m.user_id));
    }
  }

  return NextResponse.json({ received: true });
}