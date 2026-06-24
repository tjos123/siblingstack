"use client";

import { useEffect } from "react";
import { useInsights } from "@/lib/use-insights";
import { formatMinuteOfDay } from "@/lib/time";
import { track } from "@/lib/analytics";
import type { Child } from "@/types/models";

interface Props {
  householdId: string;
  childA: Child;
  childB: Child;
}

const CONFIDENCE_NOTE: Record<string, string> = {
  high: "Both kids have been pretty consistent — this is a solid bet.",
  medium: "Patterns are somewhat consistent — treat this as a likely window, not a guarantee.",
  low: "Schedules are still pretty variable — this is a rough guess, not a confident prediction.",
};

function TrendBars({ daily, field, color }: { daily: { dayStart: number; sleepMinutes: number; feedMinutes: number }[]; field: "sleepMinutes" | "feedMinutes"; color: string }) {
  const max = Math.max(...daily.map((d) => d[field]), 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {daily.map((d) => (
        <div
          key={d.dayStart}
          className="flex-1 rounded-sm"
          style={{
            height: `${Math.max((d[field] / max) * 100, 4)}%`,
            backgroundColor: color,
            opacity: d[field] === 0 ? 0.15 : 1,
          }}
          title={`${d[field]} min`}
        />
      ))}
    </div>
  );
}

export default function InsightsPanel({ householdId, childA, childB }: Props) {
  const { loading, hasEnoughData, daily, trends, predictions } = useInsights(
    householdId,
    childA.id,
    childB.id
  );

  useEffect(() => {
    if (!loading && hasEnoughData) {
      track("insights_viewed");
    }
  }, [loading, hasEnoughData]);

  if (loading) {
    return (
      <div className="bg-surface rounded-md p-4">
        <p className="text-ink-muted text-sm font-mono">Loading trends…</p>
      </div>
    );
  }

  if (!hasEnoughData) {
    return (
      <div className="bg-surface rounded-md p-4">
        <h3 className="font-display text-base text-ink mb-1">Trends &amp; predictions</h3>
        <p className="text-ink-muted text-sm">
          Still building your trends — check back once you've logged a few more days. Patterns
          need at least about a week of data to mean anything.
        </p>
      </div>
    );
  }

  const sleepTrend = trends.find((t) => t.type === "sleep");
  const feedTrend = trends.find((t) => t.type === "feed");

  return (
    <div className="bg-surface rounded-md p-4 flex flex-col gap-5">
      <h3 className="font-display text-base text-ink">Trends &amp; predictions</h3>

      {/* Sleep overlap — framed positively, since simultaneous naps are the goal, not a problem */}
      <div>
        <p className="text-sm text-ink mb-1">
          😌 Shared nap time{" "}
          {sleepTrend && sleepTrend.direction !== "flat" && (
            <span className="text-childB">
              is {sleepTrend.direction === "up" ? "up" : "down"} {Math.abs(sleepTrend.changePercent)}% this week
            </span>
          )}
        </p>
        <TrendBars daily={daily} field="sleepMinutes" color="#5FA39A" />
        <p className="text-ink-muted text-xs mt-1">
          ~{sleepTrend?.averageMinutesPerDay ?? 0} min/day average over the last 2 weeks
        </p>
      </div>

      {/* Feed overlap — framed as the logistically harder one to manage */}
      <div>
        <p className="text-sm text-ink mb-1">
          🍼 Overlapping feeds{" "}
          {feedTrend && feedTrend.direction !== "flat" && (
            <span className="text-conflict">
              {feedTrend.direction === "up" ? "up" : "down"} {Math.abs(feedTrend.changePercent)}% this week
            </span>
          )}
        </p>
        <TrendBars daily={daily} field="feedMinutes" color="#E54B4B" />
        <p className="text-ink-muted text-xs mt-1">
          ~{feedTrend?.averageMinutesPerDay ?? 0} min/day average over the last 2 weeks
        </p>
      </div>

      {/* Predictions */}
      {predictions.length > 0 && (
        <div>
          <p className="text-sm text-ink mb-2 font-medium">Predicted for tomorrow</p>
          <ul className="flex flex-col gap-2">
            {predictions.map((p, i) => (
              <li key={i} className="text-sm">
                <p className="text-ink">
                  {p.type === "sleep" ? "Naps" : "Feeds"} tend to overlap around{" "}
                  <span className="font-mono">{formatMinuteOfDay(Math.max(p.childAPredictedStart, p.childBPredictedStart))}</span>{" "}
                  (~{p.overlapMinutes} min)
                </p>
                <p className="text-ink-muted text-xs">{CONFIDENCE_NOTE[p.confidence]}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
