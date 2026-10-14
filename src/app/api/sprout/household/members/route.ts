// src/app/api/sprout/household/members/route.ts
//
// List the caregivers of a household for the Sprout tracker's "Family" box,
// each with a display name and role (the raw email is never returned). Read
// through the service role because the users table's RLS only lets an account
// read its own row, so a plain client query can't see the other members. The
// caller must be a member of the household they ask about.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { serverSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

interface MemberRow {
  user_id: string;
  role: string | null;
  users: { email: string | null; display_name: string | null } | null;
}

// Display name shown to the family. Falls back to the part of the email before
// the "@" so members still have something readable before they rename
// themselves (the real address is never returned to the client).
function displayNameFor(row: MemberRow): string {
  const named = row.users?.display_name?.trim();
  if (named) return named;
  const email = row.users?.email ?? "";
  const local = email.split("@")[0]?.trim();
  return local || "Family member";
}

export async function GET(req: NextRequest) {
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

    const householdId = req.nextUrl.searchParams.get("householdId");
    if (!householdId) {
      return NextResponse.json({ error: "householdId is required" }, { status: 400 });
    }

    const db = serverSupabase();

    // The caller must belong to the household they're asking about.
    const { data: membership } = await db
      .from("household_caregivers")
      .select("role")
      .eq("household_id", householdId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!membership) {
      return NextResponse.json({ error: "Not a member of this household" }, { status: 403 });
    }

    // Owner is always an admin (households.owner_id may predate the role column).
    const { data: household } = await db
      .from("households")
      .select("owner_id")
      .eq("id", householdId)
      .maybeSingle();
    const ownerId = household?.owner_id ?? null;

    const { data: rows, error: rowsError } = await db
      .from("household_caregivers")
      .select("user_id, role, users ( email, display_name )")
      .eq("household_id", householdId);
    if (rowsError) throw rowsError;

    const members = ((rows ?? []) as unknown as MemberRow[]).map((row) => {
      const isOwner = row.user_id === ownerId;
      return {
        userId: row.user_id,
        name: displayNameFor(row),
        role: (isOwner ? "admin" : row.role) ?? "caregiver",
      };
    });

    // Alphabetical by name so the list order is stable.
    members.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ members });
  } catch (err) {
    console.error("Sprout household members error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
