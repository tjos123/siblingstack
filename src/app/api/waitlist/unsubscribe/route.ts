// src/app/api/waitlist/unsubscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";
import { createHmac } from "crypto";

function makeToken(email: string, secret: string) {
  return createHmac("sha256", secret)
    .update(email.toLowerCase())
    .digest("hex")
    .slice(0, 24);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = String(searchParams.get("email") ?? "").toLowerCase();
  const token = String(searchParams.get("token") ?? "");
  const secret = process.env.UNSUBSCRIBE_SECRET ?? "";

  if (!email || token !== makeToken(email, secret)) {
    return new NextResponse("Invalid or expired unsubscribe link.", { status: 400 });
  }

  const db = serverSupabase();
  await db.from("waitlist").update({ unsubscribed: true }).eq("email", email);

  return new NextResponse(
    "You've been unsubscribed. Sorry to see you go — and congrats on the kids.",
    { status: 200, headers: { "Content-Type": "text/plain" } }
  );
}
