// src/app/api/pdf/route.ts
// Generates a clean, single-page pediatrician summary PDF for a
// household and date range. Server-side generation via pdfkit.
import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { createClient } from "@supabase/supabase-js";
import { serverSupabase } from "@/lib/supabase";
import { SUBSCRIPTION_ENABLED, isProUser } from "@/lib/config";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  sleep: "Sleep",
  feed: "Feed",
  diaper: "Diaper change",
  milestone: "Milestone",
  note: "Note",
};

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

    const db = serverSupabase();
    const params = req.nextUrl.searchParams;
    const householdId = params.get("householdId");
    const start = params.get("start");
    const end = params.get("end");

    if (!householdId || !start || !end) {
      return NextResponse.json({ error: "householdId, start, end required" }, { status: 400 });
    }

    // Verify membership
    const { data: caregiver } = await db
      .from("household_caregivers")
      .select("user_id")
      .eq("household_id", householdId)
      .eq("user_id", user.id)
      .single();

    if (!caregiver) {
      return NextResponse.json({ error: "Not a member of this household" }, { status: 403 });
    }

    // Server-side Pro gate
    if (SUBSCRIPTION_ENABLED) {
      const { data: household } = await db
        .from("households")
        .select("plan_tier")
        .eq("id", householdId)
        .single();
      if (!isProUser(household?.plan_tier)) {
        return NextResponse.json({ error: "Premium feature" }, { status: 403 });
      }
    }

    const startMs = Number(start);
    const endMs = Number(end);
    const startIso = new Date(startMs).toISOString();
    const endIso = new Date(endMs).toISOString();

    const { data: children } = await db
      .from("children")
      .select("id, name, birth_date, color_tag")
      .eq("household_id", householdId)
      .order("birth_date", { ascending: true });

    const { data: events } = await db
      .from("events")
      .select("id, child_id, type, start_time, end_time, notes")
      .eq("household_id", householdId)
      .gte("start_time", startIso)
      .lt("start_time", endIso)
      .order("start_time", { ascending: true });

    // ── PDF generation ──────────────────────────────────────────────
    const doc = new PDFDocument({ size: "LETTER", margin: 48 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    const done = new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

    doc.font("Helvetica-Bold").fontSize(18).fillColor("#1C1815").text("Sibling Stack — Visit Summary", { align: "left" });
    doc.moveDown(0.2);
    doc.font("Helvetica").fontSize(10).fillColor("#8A8178").text(formatDateRange(startMs, endMs));
    doc.moveDown(0.8);

    const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
    const ageFmt = (birthDate: string) => {
      const years = (new Date().getTime() - new Date(`${birthDate}T00:00:00`).getTime()) / (365.25 * 24 * 3600 * 1000);
      if (years < 1) return `${Math.max(0, Math.round(years * 12))} mo`;
      return `${Math.round(years)} yrs`;
    };

    for (const child of (children ?? [])) {
      doc.font("Helvetica-Bold").fontSize(13).fillColor("#1C1815")
        .text(`${child.name} — ${ageFmt(child.birth_date)}`);
      doc.moveDown(0.2);

      const childEvents = (events ?? []).filter((e) => e.child_id === child.id);
      if (childEvents.length === 0) {
        doc.font("Helvetica").fontSize(10).fillColor("#8A8178").text("No events logged in this period.");
        doc.moveDown(0.6);
        continue;
      }

      doc.font("Helvetica").fontSize(10).fillColor("#1C1815");
      for (const e of childEvents) {
        const startTime = new Date(e.start_time).getTime();
        const timeRange = e.end_time
          ? `${fmt.format(startTime)}–${fmt.format(new Date(e.end_time).getTime())}`
          : `${fmt.format(startTime)} (ongoing)`;
        const line = `${timeRange}   ${TYPE_LABEL[e.type] ?? e.type}${e.notes ? `   — ${e.notes}` : ""}`;

        if (doc.y > 720) { doc.addPage(); }
        doc.text(line);
        doc.moveDown(0.1);
      }
      doc.moveDown(0.5);
    }

    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(8).fillColor("#B5AA9A")
      .text(`Generated ${new Date().toLocaleString()} — Sibling Stack. Not a medical diagnosis.`);

    doc.end();
    const buffer = await done;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="sibling-stack-visit-summary.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function formatDateRange(startMs: number, endMs: number): string {
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
  const endAdjusted = new Date(endMs - 1);
  if (startMs >= endMs - 86400000) return fmt.format(new Date(startMs));
  return `${fmt.format(new Date(startMs))} – ${fmt.format(endAdjusted)}`;
}