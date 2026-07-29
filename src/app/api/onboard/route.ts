import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { serverSupabase } from "@/lib/supabase";

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

    const body = await req.json();
    const { householdName, childA, childB } = body as {
      householdName: string;
      childA: { name: string; birthDate: string; colorTag: string };
      childB: { name: string; birthDate: string; colorTag: string };
    };

    if (!householdName || !childA?.name || !childA?.birthDate || !childB?.name || !childB?.birthDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = serverSupabase();

    const { error: profileErr } = await db
      .from("users")
      .upsert(
        { id: user.id, email: user.email ?? "", premium_status: "free" },
        { onConflict: "id", ignoreDuplicates: true }
      );
    if (profileErr) throw profileErr;

    const { data: household, error: hErr } = await db
      .from("households")
      .insert({ name: householdName, owner_id: user.id })
      .select("id")
      .single();
    if (hErr) throw hErr;

    const { error: cErr } = await db
      .from("household_caregivers")
      .insert({ household_id: household.id, user_id: user.id });
    if (cErr) throw cErr;

    const { error: childErr1 } = await db.from("children").insert({
      household_id: household.id,
      name: childA.name,
      birth_date: childA.birthDate,
      color_tag: childA.colorTag,
    });
    if (childErr1) throw childErr1;

    const { error: childErr2 } = await db.from("children").insert({
      household_id: household.id,
      name: childB.name,
      birth_date: childB.birthDate,
      color_tag: childB.colorTag,
    });
    if (childErr2) throw childErr2;

    return NextResponse.json({ householdId: household.id });
  } catch (err) {
    console.error("Onboard error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
