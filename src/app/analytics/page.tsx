"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, FileDown, CalendarDays } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useHousehold } from "@/lib/use-household";
import { listEventsInRange } from "@/lib/db/events";
import { startOfDay, addDays, formatDayLabel } from "@/lib/time";
import { track } from "@/lib/analytics";
import { isProUser } from "@/lib/config";
import { computeDailyOverlaps, summarizeTrends } from "@/lib/trends";
import Canonical from "@/components/Canonical";
import ProUpgradeModal from "@/components/ProUpgradeModal";
import AppHeader from "@/components/app/AppHeader";
import type { ScheduleEvent } from "@/types/models";

const FREE_WINDOW_DAYS = 7;
const PRO_WINDOW_DAYS = 30;

interface RangeOption {
  label: string;
  days: number;
  pro: boolean;
}

const RANGES: RangeOption[] = [
  { label: "7 days", days: 7, pro: false },
  { label: "30 days", days: 30, pro: true },
  { label: "90 days", days: 90, pro: true },
  { label: "Custom", days: 0, pro: true },
];

function ChartBars({
  daily,
  field,
  color,
}: {
  daily: { dayStart: number; sleepMinutes: number; feedMinutes: number }[];
  field: "sleepMinutes" | "feedMinutes";
  color: string;
}) {
  const max = Math.max(...daily.map((d) => d[field]), 1);
  return (
    <div>
      <div className="flex items-end gap-[3px] h-24">
        {daily.map((d) => (
          <div
            key={d.dayStart}
            className="flex-1 rounded-sm"
            style={{
              height: `${Math.max((d[field] / max) * 100, 4)}%`,
              backgroundColor: color,
              opacity: d[field] === 0 ? 0.15 : 1,
            }}
            title={`${formatDayLabel(d.dayStart)}: ${d[field]} min`}
          />
        ))}
      </div>
      <div className="flex justify-between text-ink-muted text-[10px] font-mono mt-1">
        <span>{daily.length ? formatDayLabel(daily[0].dayStart) : ""}</span>
        <span>{daily.length ? formatDayLabel(daily[daily.length - 1].dayStart) : ""}</span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { loading: householdLoading, householdId, children, planTier } = useHousehold();
  const [proModalOpen, setProModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<RangeOption>(RANGES[0]);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [customStart, setCustomStart] = useState(() => addDays(startOfDay(), -30));

  const isPro = isProUser(planTier);

  useEffect(() => {
    if (!authLoading && !user) router.push("/sign-in");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!householdLoading && householdId) track("analytics_view");
  }, [householdLoading, householdId]);

  const loadEvents = useCallback(async () => {
    if (!householdId) return;
    setEventsLoading(true);
    const windowEnd = startOfDay() + 86_400_000;

    let days = selectedRange.days;
    let start = addDays(startOfDay(), -days);
    if (selectedRange.label === "Custom") {
      start = customStart;
      days = Math.round((windowEnd - start) / 86_400_000);
    }
    // Free users always capped at 7 days regardless of selected range
    const effectiveStart = isPro ? start : addDays(startOfDay(), -FREE_WINDOW_DAYS);

    const data = await listEventsInRange(householdId, effectiveStart, windowEnd);
    setEvents(data);
    setEventsLoading(false);
  }, [householdId, selectedRange, customStart, isPro]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  function handleRangeClick(range: RangeOption) {
    track("analytics_range_clicked", { range: range.label });
    if (range.pro && !isPro) {
      setProModalOpen(true);
      return;
    }
    setSelectedRange(range);
  }

  const older = children[0];
  const younger = children[1];

  const daily = older && younger
    ? computeDailyOverlaps(
        older.id,
        younger.id,
        events,
        isPro
          ? selectedRange.label === "Custom"
            ? customStart
            : addDays(startOfDay(), -selectedRange.days)
          : addDays(startOfDay(), -FREE_WINDOW_DAYS),
        startOfDay() + 86_400_000
      )
    : [];
  const trends = summarizeTrends(daily);

  const sleepTrend = trends.find((t) => t.type === "sleep");
  const feedTrend = trends.find((t) => t.type === "feed");

  function handleFridgeChart() {
    track("fridge_chart_clicked");
    if (!isPro) {
      setProModalOpen(true);
      return;
    }
    router.push("/print/routine");
  }

  async function handlePdfExport() {
    track("pdf_export_clicked");
    if (!isPro || !householdId) {
      setProModalOpen(true);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const end = startOfDay() + 86_400_000;
    const start = isPro
      ? selectedRange.label === "Custom"
        ? customStart
        : addDays(startOfDay(), -selectedRange.days)
      : addDays(startOfDay(), -FREE_WINDOW_DAYS);

    try {
      const res = await fetch(
        `/api/pdf?householdId=${householdId}&start=${start}&end=${end}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.error === "Premium feature") { setProModalOpen(true); return; }
        throw new Error("PDF generation failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sibling-stack-visit-summary.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // fall back silently; the modal handles the paywall case above
    }
  }

  if (authLoading || householdLoading) {
    return (
      <>
        <Canonical url="https://www.siblingstack.com/analytics" />
        <main className="min-h-screen px-6 py-8"><div className="h-7 w-36 bg-surface2 rounded animate-pulse" /></main>
      </>
    );
  }

  if (!user) return null;

  if (!householdId || children.length < 2) {
    return (
      <>
        <Canonical url="https://www.siblingstack.com/analytics" />
        <main className="min-h-screen px-6 py-8 max-w-3xl mx-auto">
          <p className="text-ink-muted text-sm">
            Set up your kids first — head to the timeline to get started.
          </p>
          <a href="/app" className="text-childA underline text-sm mt-2 inline-block">
            Go to timeline →
          </a>
        </main>
      </>
    );
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 py-6">
      <Canonical url="https://www.siblingstack.com/analytics" />
      <AppHeader />
      <div className="max-w-3xl mx-auto mt-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="font-display text-xl text-ink">Analytics &amp; Reports</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleFridgeChart}
              className="flex items-center gap-2 text-sm border border-childA text-childA rounded-md py-2 px-4 hover:bg-childA/10 transition-colors"
            >
              <CalendarDays size={15} />
              Daily Routine Fridge Chart
            </button>
            <button
              onClick={handlePdfExport}
              className="flex items-center gap-2 text-sm border border-childB text-childB rounded-md py-2 px-4 hover:bg-childB/10 transition-colors"
            >
              <FileDown size={15} />
              Generate Pediatrician Report
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => handleRangeClick(range)}
              className={`flex items-center gap-1.5 text-sm rounded-md py-1.5 px-3 transition-colors ${
                selectedRange.label === range.label && (isPro || !range.pro)
                  ? "bg-surface text-ink border border-surface3"
                  : "text-ink-muted border border-surface2 hover:text-ink"
              }`}
            >
              {range.label}
              {range.pro && !isPro && <Lock size={11} className="text-ink-muted" />}
            </button>
          ))}
        </div>

        {selectedRange.label === "Custom" && isPro && (
          <div className="mb-6 flex items-center gap-3">
            <label className="text-sm text-ink-muted">From</label>
            <input
              type="date"
              value={formatDateInput(customStart)}
              onChange={(e) => {
                if (e.target.value) setCustomStart(new Date(`${e.target.value}T00:00:00`).getTime());
              }}
              className="bg-bg border border-surface2 rounded-md px-3 py-1.5 text-sm text-ink outline-none focus:border-childA"
            />
          </div>
        )}

        {!isPro && (
          <p className="text-ink-muted text-xs mb-6">
            Showing the last 7 days on the free plan.{" "}
            <button onClick={() => setProModalOpen(true)} className="text-childA underline">
              Upgrade for 30-day trends, custom ranges, and unlimited history.
            </button>
          </p>
        )}

        {eventsLoading ? (
          <p className="text-ink-muted font-mono text-sm text-center py-12">Crunching numbers…</p>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-surface rounded-md p-4">
              <h3 className="font-display text-base text-ink mb-1">
                Shared nap time{" "}
                {sleepTrend && sleepTrend.direction !== "flat" && (
                  <span className="text-childB text-sm font-body">
                    {sleepTrend.direction === "up" ? "↑ up" : "↓ down"} {Math.abs(sleepTrend.changePercent)}%
                  </span>
                )}
              </h3>
              <div className="mt-3">
                <ChartBars daily={daily} field="sleepMinutes" color="#5FA39A" />
              </div>
              <p className="text-ink-muted text-xs mt-2">
                ~{sleepTrend?.averageMinutesPerDay ?? 0} min/day average over this window
              </p>
            </div>

            <div className="bg-surface rounded-md p-4">
              <h3 className="font-display text-base text-ink mb-1">
                Overlapping feeds{" "}
                {feedTrend && feedTrend.direction !== "flat" && (
                  <span className="text-conflict text-sm font-body">
                    {feedTrend.direction === "up" ? "↑ up" : "↓ down"} {Math.abs(feedTrend.changePercent)}%
                  </span>
                )}
              </h3>
              <div className="mt-3">
                <ChartBars daily={daily} field="feedMinutes" color="#E54B4B" />
              </div>
              <p className="text-ink-muted text-xs mt-2">
                ~{feedTrend?.averageMinutesPerDay ?? 0} min/day average over this window
              </p>
            </div>

            {!isPro && (
              <div className="bg-surface rounded-md p-5 text-center">
                <Lock size={16} className="mx-auto text-ink-muted mb-2" />
                <p className="text-ink-muted text-sm">
                  Unlock 30-day history, custom ranges, predictions, and one-click
                  pediatrician PDF exports with Pro.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <ProUpgradeModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
    </main>
  );
}

function formatDateInput(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}