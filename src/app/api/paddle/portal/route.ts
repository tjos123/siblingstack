// src/app/api/paddle/portal/route.ts
// Resolves the caller's household subscription and returns Paddle's
// management URLs (cancel / update payment method) for the client to open.
import { NextRequest, NextResponse } from "next/server";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { serverSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

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

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const db = serverSupabase();

    // Which household is this user a caregiver of?
    const { data: caregivership } = await db
      .from("household_caregivers")
      .select("household_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();
    if (!caregivership) {
      return NextResponse.json({ error: "No household found" }, { status: 404 });
    }

    const { data: household } = await db
      .from("households")
      .select("paddle_subscription_id")
      .eq("id", caregivership.household_id)
      .single();
    const subscriptionId = household?.paddle_subscription_id;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "No active subscription for this household." },
        { status: 404 }
      );
    }

    const paddle = getPaddle();
    const subscription = await paddle.subscriptions.get(subscriptionId);

    // Paddle exposes manage links on the subscription (cancel, update PM)
    const url =
      subscription.managementUrls?.cancel ??
      subscription.managementUrls?.updatePaymentMethod ??
      null;

    if (!url) {
      return NextResponse.json(
        { error: "No billing page available for this subscription." },
        { status: 404 }
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof Error && err.message === "Paddle is not configured") {
      return NextResponse.json(
        { error: "Paddle isn't configured yet — nothing to manage on this environment." },
        { status: 503 }
      );
    }
    console.error("Portal error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}