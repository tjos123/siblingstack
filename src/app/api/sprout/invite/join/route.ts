// src/app/api/sprout/invite/join/route.ts
//
// Redeem a signed household-invite code. Validates the signature server-side,
// links the signed-in user to the inviter's household as a caregiver, and
// ensures the shared baby row exists (inserted via the service role so there's
// no baby-not-found race when the invitee's device syncs immediately).
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { serverSupabase } from "@/lib/supabase";
import { verifyInvite } from "@/lib/sprout-invite-code";
import type { BabySex } from "@/sprout/lib/types";

export const runtime = "nodejs";

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

    const body = (await req.json().catch(() => null)) as { code?: string } | null;
    const code = body?.code?.trim();
    if (!code) {
      return NextResponse.json({ error: "Invite link is required" }, { status: 400 });
    }

    const invite = verifyInvite(code);
    if (!invite) {
      return NextResponse.json(
        { error: "This invite link is invalid or expired. Ask for a fresh one." },
        { status: 400 }
      );
    }

    const db = serverSupabase();

    // Household must still exist.
    const { data: household } = await db
      .from("households")
      .select("id")
      .eq("id", invite.hh)
      .maybeSingle();
    if (!household) {
      return NextResponse.json(
        { error: "This invite link is invalid or expired. Ask for a fresh one." },
        { status: 400 }
      );
    }

    // Add the invitee as a caregiver. ignoreDuplicates keeps an existing row
    // (e.g. if they were already a member, possibly as admin) untouched.
    const { error: memError } = await db
      .from("household_caregivers")
      .upsert(
        { household_id: invite.hh, user_id: user.id, role: "caregiver" },
        { ignoreDuplicates: true }
      );
    if (memError) throw memError;

    // Ensure the baby row exists for the household so the invitee's next sync
    // (which pulls by household_id) finds it. If it already exists, verify it
    // belongs to the same household to avoid hijacking an unrelated baby id.
    const { data: existingBaby } = await db
      .from("sprout_babies")
      .select("id, household_id")
      .eq("id", invite.b)
      .maybeSingle();
    if (existingBaby) {
      if (existingBaby.household_id !== invite.hh) {
        return NextResponse.json(
          { error: "This invite link is invalid or expired. Ask for a fresh one." },
          { status: 400 }
        );
      }
    } else {
      const { error: babyError } = await db.from("sprout_babies").insert({
        id: invite.b,
        household_id: invite.hh,
        name: invite.n,
        birth_date: invite.bd,
        avatar_emoji: invite.a,
        color: invite.c,
        sex: invite.s,
      });
      if (babyError) throw babyError;
    }

    return NextResponse.json({
      householdId: invite.hh,
      baby: {
        id: invite.b,
        name: invite.n,
        birthDate: invite.bd,
        avatarEmoji: invite.a,
        color: invite.c,
        sex: invite.s as BabySex | null,
      },
    });
  } catch (err) {
    console.error("Sprout invite join error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}