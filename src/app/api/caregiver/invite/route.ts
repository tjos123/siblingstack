// src/app/api/caregiver/invite/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { SUBSCRIPTION_ENABLED } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    // Verify the caller is authenticated via their JWT
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Validate the JWT with a user-scoped client
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
    const { householdId, email } = await req.json() as { householdId?: string; email?: string };

    if (!householdId || !email) {
      return NextResponse.json({ error: "householdId and email required" }, { status: 400 });
    }

    // Server-side premium check — same pattern as the old Cloud Function
    if (SUBSCRIPTION_ENABLED) {
      const { data: profile } = await db.from("users").select("premium_status").eq("id", user.id).single();
      if (profile?.premium_status !== "premium") {
        return NextResponse.json({ error: "Premium feature" }, { status: 403 });
      }
    }

    // Confirm requester is a caregiver of this household
    const { data: caregiver } = await db
      .from("household_caregivers")
      .select("user_id")
      .eq("household_id", householdId)
      .eq("user_id", user.id)
      .single();

    if (!caregiver) {
      return NextResponse.json({ error: "Not a member of this household" }, { status: 403 });
    }

    // Look up the invited user by email
    const { data: invitedUsers } = await db
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .limit(1);

    if (!invitedUsers?.length) {
      return NextResponse.json(
        { error: "No account found with that email — they'll need to sign up first." },
        { status: 404 }
      );
    }

    const invitedUid = invitedUsers[0].id;

    // Add to the household_caregivers junction table
    const { error: insertError } = await db
      .from("household_caregivers")
      .upsert({ household_id: householdId, user_id: invitedUid }, { ignoreDuplicates: true });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Invite error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
