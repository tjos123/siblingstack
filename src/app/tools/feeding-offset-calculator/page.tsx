"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";

const AGE_OPTIONS = [
  "0–2 months",
  "3–5 months",
  "6–11 months",
  "12–24 months",
  "2–4 years",
];

const AGE_FEED_DEFAULTS = [8, 6, 5, 4, 4];

const OLDER_MEALS_DEFAULT = 5;

const SPAN_MINUTES = 12 * 60;

type Slot = {
  min: number;
  younger: boolean;
  older: boolean;
  collision: boolean;
};

function makeTimes(wakeTime: string, count: number): number[] {
  const [h, m] = wakeTime.split(":").map(Number);
  const base = h * 60 + m;
  const step = Math.round(SPAN_MINUTES / Math.max(count, 1));
  const times: number[] = [];
  for (let i = 0; i < count; i++) {
    times.push(base + i * step);
  }
  return times;
}

function formatTime(min: number): string {
  const d = new Date(0, 0, 1, 0, Math.max(0, min));
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function FeedingOffsetCalculator() {
  const [youngerAge, setYoungerAge] = useState(0);
  const [youngerFeeds, setYoungerFeeds] = useState(AGE_FEED_DEFAULTS[0]);
  const [olderAge, setOlderAge] = useState(3);
  const [olderMeals, setOlderMeals] = useState(OLDER_MEALS_DEFAULT);
  const [wakeTime, setWakeTime] = useState("07:00");
  const [result, setResult] = useState<{
    slots: Slot[];
    collisionCount: number;
  } | null>(null);

  const calculateOffset = () => {
    const youngerTimes = makeTimes(wakeTime, youngerFeeds);
    const olderTimes = makeTimes(wakeTime, olderMeals);

    const byMin = new Map<number, { younger: boolean; older: boolean }>();
    youngerTimes.forEach((min) => {
      const entry = byMin.get(min) ?? { younger: false, older: false };
      entry.younger = true;
      byMin.set(min, entry);
    });
    olderTimes.forEach((min) => {
      const entry = byMin.get(min) ?? { younger: false, older: false };
      entry.older = true;
      byMin.set(min, entry);
    });

    const keys = [...byMin.keys()].sort((a, b) => a - b);
    const slots: Slot[] = keys.map((min) => {
      const entry = byMin.get(min)!;
      return {
        min,
        younger: entry.younger,
        older: entry.older,
        collision: entry.younger && entry.older,
      };
    });

    setResult({
      slots,
      collisionCount: slots.filter((s) => s.collision).length,
    });
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <SiteHeader />
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm mb-5">
            <Link href="/" className="text-ink-muted hover:text-ink transition-colors">
              Home
            </Link>
            <span className="text-surface2">›</span>
            <Link href="/tools" className="text-ink-muted hover:text-ink transition-colors">
              Tools
            </Link>
          </nav>

          <span className="text-xs font-mono uppercase tracking-widest text-childA px-2 py-0.5 rounded-full bg-childA/15 border border-childA/40 mb-4 inline-block">
            Free interactive tool
          </span>

          <h1 className="font-display text-3xl text-ink mb-2">
            Feeding schedule offset calculator
          </h1>
          <p className="text-ink-muted leading-relaxed">
            If you&apos;re solo-feeding two kids, doing it at the exact same time
            usually means one of them waits. This tool suggests a workable stagger
            based on both kids&apos; ages and feeding frequency, so you can plan
            around it instead of improvising every day.
          </p>
          <p className="text-ink-muted leading-relaxed mt-3">
            Feed timing and nap timing interact — pair this with the{" "}
            <Link
              href="/tools/wake-window-calculator"
              className="text-childB underline underline-offset-3 hover:text-ink transition-colors"
            >
              wake window calculator
            </Link>{" "}
            to see how feeding slots fit around each child&apos;s sleep windows.
          </p>
        </div>

        <div className="border border-surface2 rounded-xl p-6 sm:p-8 mb-12">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Younger child&apos;s age
                </label>
                <select
                  value={youngerAge}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setYoungerAge(idx);
                    setYoungerFeeds(AGE_FEED_DEFAULTS[idx]);
                    setResult(null);
                  }}
                  className="w-full bg-surface border border-surface2 rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-childA"
                >
                  {AGE_OPTIONS.map((label, i) => (
                    <option key={i} value={i}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Younger child&apos;s feeds per day
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={youngerFeeds}
                  onChange={(e) => {
                    setYoungerFeeds(Number(e.target.value));
                    setResult(null);
                  }}
                  className="w-full bg-surface border border-surface2 rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-childA"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Older child&apos;s age
                </label>
                <select
                  value={olderAge}
                  onChange={(e) => {
                    setOlderAge(Number(e.target.value));
                    setResult(null);
                  }}
                  className="w-full bg-surface border border-surface2 rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-childA"
                >
                  {AGE_OPTIONS.map((label, i) => (
                    <option key={i} value={i}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Older child&apos;s meals + snacks per day
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={olderMeals}
                  onChange={(e) => {
                    setOlderMeals(Number(e.target.value));
                    setResult(null);
                  }}
                  className="w-full bg-surface border border-surface2 rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-childA"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Morning wake time (shared)
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => {
                  setWakeTime(e.target.value);
                  setResult(null);
                }}
                className="w-full bg-surface border border-surface2 rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-childA"
              />
            </div>

            <button
              onClick={calculateOffset}
              className="w-full bg-childA text-bg font-medium rounded-md py-3 text-sm hover:opacity-90 transition-opacity"
            >
              Calculate suggested offset schedule
            </button>

            {result && (
              <div className="bg-surface border border-surface2 rounded-xl p-6">
                <p className="text-xs font-mono uppercase tracking-widest text-childA mb-1">
                  Suggested feeding offset
                </p>
                <p className="text-sm text-ink mb-4">
                  {result.slots.length} feeding slots across the day —{" "}
                  {result.collisionCount === 0
                    ? "no feeds land at the same time."
                    : `${result.collisionCount} slot${result.collisionCount === 1 ? "" : "s"} would collide.`}
                </p>

                <div className="border border-surface2 rounded-lg overflow-hidden mb-4">
                  <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-bg border-b border-surface2 text-xs font-mono uppercase tracking-widest text-ink-muted">
                    <span>Time</span>
                    <span>Younger child</span>
                    <span>Older child</span>
                  </div>
                  {result.slots.map((slot, i) => (
                    <div
                      key={`${slot.min}-${i}`}
                      className={`grid grid-cols-3 gap-2 px-4 py-2 text-sm ${
                        slot.collision
                          ? "bg-childA/10 border-l-2 border-childA"
                          : i % 2 === 0
                            ? "bg-surface"
                            : ""
                      }`}
                    >
                      <span className="text-ink font-medium">{formatTime(slot.min)}</span>
                      <span className="text-ink-muted">
                        {slot.younger ? "Feed" : "—"}
                      </span>
                      <span className="text-ink-muted">
                        {slot.older ? "Meal / snack" : "—"}
                      </span>
                    </div>
                  ))}
                </div>

                {result.collisionCount > 0 && (
                  <p className="text-xs text-ink-muted leading-relaxed mb-4">
                    Where a slot collides, start the younger child&apos;s feed 15
                    minutes earlier (or later) to give each child their own
                    one-on-one window instead of two simultaneous feeds.
                  </p>
                )}

                <p className="text-xs text-ink-muted leading-relaxed">
                  Want the deeper how-to? See the{" "}
                  <Link
                    href="/blog/high-chair-roundup"
                    className="text-childB underline underline-offset-3 hover:text-ink transition-colors"
                  >
                    high chair roundup
                  </Link>{" "}
                  and the{" "}
                  <Link
                    href="/blog/feeding-schedule-two-different-ages"
                    className="text-childB underline underline-offset-3 hover:text-ink transition-colors"
                  >
                    feeding schedule for two different ages
                  </Link>{" "}
                  guide.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-3">
            Why simultaneous feeds are harder than they sound
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed">
            Two kids needing to eat at the same moment isn&apos;t just
            inconvenient — for a solo caregiver it usually means one child eating
            with reduced attention (propped bottle, distracted toddler) or a
            longer wait for whoever goes second. A 15–20 minute offset, even a
            small one, is often enough to give each child actual one-on-one
            attention during the feed rather than splitting focus.
          </p>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-3">
            Floor-level feeding for the overlap you can&apos;t avoid
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed">
            Some overlap is unavoidable, especially with an infant on a tight
            feeding schedule. When it happens, feeding at floor level (nursing
            pillow or bottle, sitting on the floor rather than a chair across the
            room) keeps you reachable to the older child for a book or
            conversation during the feed, rather than the older one being shut
            out of the room for it.
          </p>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-4">FAQ</h2>
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-ink font-medium text-sm mb-1">
                What if my toddler&apos;s meal times aren&apos;t fixed?
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                Use their general blocks (breakfast, lunch, dinner, 1–2 snacks)
                rather than exact clock times — the tool is meant to suggest a
                workable stagger, not lock in a rigid schedule a toddler
                won&apos;t actually follow.
              </p>
            </div>
            <div>
              <p className="text-ink font-medium text-sm mb-1">
                Does this account for growth spurts changing infant feeding
                frequency?
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                Not automatically — if your infant&apos;s feeding frequency jumps
                for a few days (common during a growth spurt, often around 3
                weeks, 6 weeks, and 3 months), re-run the calculator with the
                higher feed count rather than expecting the original offset to
                hold.
              </p>
            </div>
            <div>
              <p className="text-ink font-medium text-sm mb-1">
                My kids&apos; feeding times genuinely can&apos;t be staggered —
                is that a problem?
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                Not necessarily — some days won&apos;t allow it, and that&apos;s
                fine. The goal is a workable default for most days, not an
                every-single-feed guarantee.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <Link
            href="/irish-twins-guide"
            className="inline-flex items-center gap-2 text-sm text-childB hover:text-ink transition-colors"
          >
            <span aria-hidden="true">←</span>
            Irish twins: the complete guide
          </Link>
        </div>

        <div
          className="rounded-xl p-7"
          style={{
            background: "linear-gradient(135deg, #25201a 0%, #1e1a15 100%)",
            border: "1px solid #D98C5F30",
            borderLeft: "4px solid #D98C5F",
          }}
        >
          <p className="text-xs font-mono uppercase tracking-widest mb-3 text-childA">
            Free to use
          </p>
          <h2 className="font-display text-xl text-ink mb-2">
            Managing two feed schedules at once?
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed mb-5">
            The Sibling Stack app shows both kids&apos; feed windows on one
            timeline so you can see tomorrow&apos;s collisions before they happen.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-childA text-bg font-medium rounded-md py-2.5 px-5 text-sm hover:opacity-90 transition-opacity"
          >
            Create your account
          </Link>
        </div>
      </div>
    </main>
  );
}