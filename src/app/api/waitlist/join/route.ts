// src/app/api/waitlist/join/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const source = String(body?.source ?? "unknown").slice(0, 100);

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const db = serverSupabase();
    // Upsert so duplicate signups succeed silently
    const { error } = await db.from("waitlist").upsert(
      { email, source, subscribed_at: new Date().toISOString(), unsubscribed: false },
      { onConflict: "email", ignoreDuplicates: true }
    );

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist join error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
