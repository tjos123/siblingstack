"use client";

// /print/routine — Auto-formatted, printable daily routine chart
// (Pro feature #6). Generates a clean, fridge-ready one-per-day chart:
// each child gets a color-coded block with their events and a quick
// summary. Prints via window.print() with print-specific styles in
// globals.css (.print-routine).

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { useHousehold } from "@/lib/use-household";
import { useDayEvents } from "@/lib/use-day-events";
import { startOfDay, formatDayLabel, formatClockTime, formatAge } from "@/lib/time";
import { track } from "@/lib/analytics";
import { isProUser } from "@/lib/config";
import ProUpgradeModal from "@/components/ProUpgradeModal";
import type { ScheduleEvent } from "@/types/models";

const TYPE_LABEL: Record<string, string> = {
  sleep: "Sleep",
  feed: "Feed",
  diaper: "Diaper",
  milestone: "Milestone",
  note: "Note",
};

const TYPE_COLOR: Record<string, string> = {
  sleep: "#5FA39A",
  feed: "#D98C5F",
  diaper: "#E54B4B",
  milestone: "#C4A7E7",
  note: "#99907F",
};

export default function PrintRoutinePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { loading: householdLoading, householdId, children, planTier } = useHousehold();

  const [dayStart, setDayStart] = useState<number>(() => startOfDay());
  const [proModalOpen, setProModalOpen] = useState(false);

  const { events, loading: eventsLoading } = useDayEvents(householdId, dayStart);

  const isPro = isProUser(planTier);

  useEffect(() => {
    if (!authLoading && !user) router.push("/sign-in");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!householdLoading && householdId) track("fridge_chart_view");
  }, [householdLoading, householdId]);

  if (authLoading || householdLoading) {
    return (
      <main className="min-h-screen px-6 py-8">
        <div className="h-7 w-48 bg-surface2 rounded animate-pulse" />
      </main>
    );
  }

  if (!user) return null;

  if (isPro && (!householdId || children.length < 2)) {
    return (
      <main className="min-h-screen px-6 py-8 max-w-3xl mx-auto">
        <p className="text-ink-muted text-sm">
          Set up your kids first — head to the timeline to get started.
        </p>
        <a href="/app" className="text-childA underline text-sm mt-2 inline-block">
          Go to timeline →
        </a>
      </main>
    );
  }

  // Free tier: show the upgrade gate instead of the printable chart
  if (!isPro) {
    return (
      <main className="min-h-screen px-6 py-8 flex items-center justify-center">
        <div className="max-w-sm w-full text-center no-print">
          <div className="bg-surface rounded-md p-6">
            <h1 className="font-display text-lg text-ink mb-2">Fridge Charts are Pro</h1>
            <p className="text-ink-muted text-sm mb-4">
              Auto-formatted, printable daily routine charts for the fridge — upgraded is one tap away.
            </p>
            <button
              onClick={() => { track("fridge_chart_paywall_shown"); setProModalOpen(true); }}
              className="w-full bg-childA text-bg text-sm font-medium rounded-md py-2"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
        <ProUpgradeModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
      </main>
    );
  }

  const older = children[0];
  const younger = children[1];

  function childEvents(childId: string): ScheduleEvent[] {
    return events
      .filter((e) => e.childId === childId)
      .sort((a, b) => a.startTime - b.startTime);
  }

  function summarize(childId: string) {
    const list = childEvents(childId);
    const sleepMin = list.filter((e) => e.type === "sleep").reduce((sum, e) => {
      return sum + ((e.endTime ?? Date.now()) - e.startTime) / 60000;
    }, 0);
    const feeds = list.filter((e) => e.type === "feed").length;
    const diapers = list.filter((e) => e.type === "diaper").length;
    return {
      sleepHours: Math.round((sleepMin / 60) * 10) / 10,
      feeds,
      diapers,
      total: list.length,
    };
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 py-6">
      {/* Toolbar — hidden when printing */}
      <div className="max-w-3xl mx-auto mb-4 no-print flex items-center justify-between">
        <button
          onClick={() => router.push("/analytics")}
          className="text-ink-muted text-sm underline"
        >
          ← Back to Analytics
        </button>
        <button
          onClick={() => { track("fridge_chart_printed"); window.print(); }}
          className="flex items-center gap-2 bg-childA text-bg text-sm font-medium rounded-md py-2 px-4"
        >
          <Printer size={15} />
          Print / Save as PDF
        </button>
      </div>

      {/* Date picker — hidden when printing */}
      <div className="max-w-3xl mx-auto mb-6 no-print">
        <label className="text-xs text-ink-muted block mb-1">Chart for</label>
        <input
          type="date"
          value={toDateInput(dayStart)}
          onChange={(e) => {
            if (e.target.value) setDayStart(new Date(`${e.target.value}T00:00:00`).getTime());
          }}
          className="bg-bg border border-surface2 rounded-md px-3 py-1.5 text-sm text-ink outline-none focus:border-childA"
        />
      </div>

      {/* The printable chart */}
      {eventsLoading ? (
        <p className="text-ink-muted font-mono text-sm text-center py-12 max-w-3xl mx-auto">Building chart…</p>
      ) : (
        <div className="print-routine max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 print-hide-bg">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
              Daily Routine
            </p>
            <h1 className="font-display text-2xl text-ink">
              {formatDayLabel(dayStart)}
            </h1>
          </div>

          {/* Side-by-side child columns (stack on narrow screens) */}
          <div className="grid grid-cols-2 gap-4 print-grid-2">
            {[
              { child: older, accent: "#D98C5F" },
              { child: younger, accent: "#5FA39A" },
            ].map(({ child, accent }) => {
              const list = childEvents(child.id);
              const summary = summarize(child.id);
              return (
                <div key={child.id} className="rounded-lg p-4" style={{ border: `2px solid ${accent}` }}>
                  <div className="mb-3">
                    <h2 className="font-display text-lg text-ink">{child.name}</h2>
                    <p className="text-xs text-ink-muted font-mono">{formatAge(child.birthDate)}</p>
                  </div>

                  {list.length === 0 ? (
                    <p className="text-sm text-ink-muted">No events logged.</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {list.map((e) => (
                        <li key={e.id} className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: TYPE_COLOR[e.type] ?? "#99907F" }} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-ink font-medium leading-tight">
                              {TYPE_LABEL[e.type] ?? e.type}
                            </p>
                            <p className="font-mono text-xs text-ink-muted leading-tight">
                              {e.endTime
                                ? `${formatClockTime(e.startTime)}–${formatClockTime(e.endTime)}`
                                : `${formatClockTime(e.startTime)}–now`}
                            </p>
                            {e.notes && <p className="text-xs text-ink-muted truncate">{e.notes}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-4 pt-3 border-t border-surface2 flex gap-4">
                    <span className="text-xs font-mono">
                      <span className="text-ink">{summary.sleepHours}</span>
                      <span className="text-ink-muted">h sleep</span>
                    </span>
                    <span className="text-xs font-mono">
                      <span className="text-ink">{summary.feeds}</span>
                      <span className="text-ink-muted"> feeds</span>
                    </span>
                    <span className="text-xs font-mono">
                      <span className="text-ink">{summary.diapers}</span>
                      <span className="text-ink-muted"> changes</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-ink-muted mt-8 print-foot">
            Generated by Sibling Stack — siblingstack.com
          </p>
        </div>
      )}

      <ProUpgradeModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
    </main>
  );
}

function toDateInput(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}