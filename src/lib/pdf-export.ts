// src/lib/pdf-export.ts
//
// Generates a simple, readable PDF summary of both kids' events for a
// pediatrician visit. Runs entirely client-side via jsPDF — no Cloud
// Function needed since the data's already in the browser and there's
// no sensitive operation happening, just formatting.

import jsPDF from "jspdf";
import { formatClockTime, formatDayLabel, formatAge } from "@/lib/time";
import type { Child, ScheduleEvent } from "@/types/models";

const TYPE_LABEL: Record<string, string> = {
  sleep: "Sleep",
  feed: "Feed",
  diaper: "Diaper change",
  milestone: "Milestone",
  note: "Note",
};

export function exportVisitSummaryPdf(
  children: Child[],
  events: ScheduleEvent[],
  dayStart: number
): void {
  const doc = new jsPDF();
  const marginX = 14;
  let y = 18;

  doc.setFontSize(16);
  doc.text("Sibling Stack — Visit Summary", marginX, y);
  y += 7;

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(formatDayLabel(dayStart), marginX, y);
  doc.setTextColor(0);
  y += 10;

  for (const child of children) {
    doc.setFontSize(13);
    doc.text(`${child.name} — ${formatAge(child.birthDate)}`, marginX, y);
    y += 6;

    const childEvents = events
      .filter((e) => e.childId === child.id)
      .sort((a, b) => a.startTime - b.startTime);

    if (childEvents.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text("No events logged today.", marginX + 2, y);
      doc.setTextColor(0);
      y += 8;
      continue;
    }

    doc.setFontSize(10);
    for (const e of childEvents) {
      const timeRange = e.endTime
        ? `${formatClockTime(e.startTime)}\u2013${formatClockTime(e.endTime)}`
        : `${formatClockTime(e.startTime)} (ongoing)`;
      const line = `${timeRange}   ${TYPE_LABEL[e.type] ?? e.type}${e.notes ? `   — ${e.notes}` : ""}`;
      doc.text(line, marginX + 2, y);
      y += 5.5;

      if (y > 280) {
        doc.addPage();
        y = 18;
      }
    }
    y += 6;
  }

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    `Generated ${new Date().toLocaleString()} — Sibling Stack`,
    marginX,
    290
  );

  doc.save(`sibling-stack-visit-summary-${dayStart}.pdf`);
}
