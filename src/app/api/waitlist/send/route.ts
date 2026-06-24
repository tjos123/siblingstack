// src/app/api/waitlist/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";
import { createHmac } from "crypto";

function makeToken(email: string, secret: string) {
  return createHmac("sha256", secret)
    .update(email.toLowerCase())
    .digest("hex")
    .slice(0, 24);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, subject, htmlBody, fromEmail } = body as {
      secret?: string;
      subject?: string;
      htmlBody?: string;
      fromEmail?: string;
    };

    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    if (!subject || !htmlBody || !fromEmail) {
      return NextResponse.json({ error: "subject, htmlBody, fromEmail required" }, { status: 400 });
    }

    const db = serverSupabase();
    const { data: subscribers } = await db
      .from("waitlist")
      .select("email")
      .eq("unsubscribed", false);

    if (!subscribers?.length) {
      return NextResponse.json({ sent: 0 });
    }

    const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET ?? "";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
    let sentCount = 0;

    for (const { email } of subscribers) {
      const token = makeToken(email, unsubscribeSecret);
      const unsubUrl = `${appUrl}/api/waitlist/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
      const personalizedHtml = `${htmlBody}
        <p style="font-size:12px;color:#888;margin-top:24px;">
          You're getting this because you joined the Sibling Stack waitlist.
          <a href="${unsubUrl}">Unsubscribe</a>.
        </p>`;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: fromEmail, to: email, subject, html: personalizedHtml }),
      });

      if (res.ok) sentCount++;
    }

    return NextResponse.json({ sent: sentCount, total: subscribers.length });
  } catch (err) {
    console.error("Send error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
