// src/app/api/sprout/invite/route.ts
//
// Mint a signed household-invite code for the Sprout baby tracker.
// Only an admin caregiver of the household may mint. The code binds
// the inviter's household + baby id so the invitee joins the same family.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { serverSupabase } from "@/lib/supabase";
import { signInvite } from "@/lib/sprout-invite-code";
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

    const body = (await req.json().catch(() => null)) as {
      householdId?: string;
      babyId?: string;
      name?: string;
      birthDate?: string;
      avatarEmoji?: string;
      color?: string;
      sex?: string;
    } | null;
    if (!body?.householdId || !body.babyId || !body.name || !body.birthDate) {
      return NextResponse.json(
        { error: "householdId, babyId, name and birthDate are required" },
        { status: 400 }
      );
    }

    const db = serverSupabase();

    const { data: caregiver } = await db
      .from("household_caregivers")
      .select("role")
      .eq("household_id", body.householdId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!caregiver) {
      return NextResponse.json({ error: "Not a member of this household" }, { status: 403 });
    }
    if (caregiver.role !== "admin") {
      return NextResponse.json({ error: "Only admins can invite caregivers" }, { status: 403 });
    }

    const code = signInvite({
      householdId: body.householdId,
      babyId: body.babyId,
      name: body.name,
      birthDate: body.birthDate,
      avatarEmoji: typeof body.avatarEmoji === "string" ? body.avatarEmoji : "🌱",
      color: typeof body.color === "string" ? body.color : "sage",
      sex: ["female", "male"].includes(body.sex ?? "") ? (body.sex as BabySex) : null,
    });

    return NextResponse.json({ code });
  } catch (err) {
    console.error("Sprout invite mint error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}