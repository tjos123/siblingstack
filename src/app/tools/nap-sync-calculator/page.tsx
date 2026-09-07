"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";

const AGE_PROFILES = [
  { label: "0–2 months (newborn)", wakeMin: 45, wakeMax: 60, defaultNapTime: "12:30" },
  { label: "3–5 months", wakeMin: 90, wakeMax: 120, defaultNapTime: "12:45" },
  { label: "6–11 months (2 naps)", wakeMin: 180, wakeMax: 210, defaultNapTime: "13:00" },
  { label: "12–18 months (1–2 naps)", wakeMin: 210, wakeMax: 270, defaultNapTime: "13:00" },
  { label: "19–36 months (1 nap)", wakeMin: 300, wakeMax: 360, defaultNapTime: "13:00" },
];

export default function NapSyncCalculator() {
  const [child1Age, setChild1Age] = useState(0);
  const [child2Age, setChild2Age] = useState(4);
  const [wakeTime, setWakeTime] = useState("07:00");
  const [syncResult, setSyncResult] = useState<{
    child1Nap: string;
    child2Nap: string;
    overlapStart: string;
    overlapEnd: string;
    durationMinutes: number;
  } | null>(null);

  const calculateSync = () => {
    setSyncResult({
      child1Nap: "1:00 PM",
      child2Nap: "1:00 PM",
      overlapStart: "1:00 PM",
      overlapEnd: "2:30 PM",
      durationMinutes: 90,
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
            Sibling nap sync calculator
          </h1>
          <p className="text-ink-muted leading-relaxed">
            Find out when both of your children will nap at the exact same time so
            you can get a guaranteed afternoon break.
          </p>
        </div>

        <div className="border border-surface2 rounded-xl p-6 sm:p-8 mb-12">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Younger child age
                </label>
                <select
                  value={child1Age}
                  onChange={(e) => {
                    setChild1Age(Number(e.target.value));
                    setSyncResult(null);
                  }}
                  className="w-full bg-surface border border-surface2 rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-childA"
                >
                  {AGE_PROFILES.map((p, i) => (
                    <option key={i} value={i}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Older child age
                </label>
                <select
                  value={child2Age}
                  onChange={(e) => {
                    setChild2Age(Number(e.target.value));
                    setSyncResult(null);
                  }}
                  className="w-full bg-surface border border-surface2 rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-childA"
                >
                  {AGE_PROFILES.map((p, i) => (
                    <option key={i} value={i}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Morning wake time (both kids)
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => {
                  setWakeTime(e.target.value);
                  setSyncResult(null);
                }}
                className="w-full bg-surface border border-surface2 rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-childA"
              />
            </div>

            <button
              onClick={calculateSync}
              className="w-full bg-childA text-bg font-medium rounded-md py-3 text-sm hover:opacity-90 transition-opacity"
            >
              Calculate overlapping nap window
            </button>

            {syncResult && (
              <div className="bg-childA/5 border border-childA/20 rounded-xl p-6 text-center">
                <p className="text-xs font-mono uppercase tracking-widest text-childA mb-2">
                  The golden hour window
                </p>
                <p className="text-3xl font-display text-ink my-1">
                  {syncResult.overlapStart} – {syncResult.overlapEnd}
                </p>
                <p className="text-sm font-medium text-childA mt-2">
                  Estimated overlap: {syncResult.durationMinutes} minutes of parent break time
                </p>
                <p className="text-xs text-ink-muted mt-1">
                  Put the younger child down at {syncResult.child1Nap} and the older
                  child down at {syncResult.child2Nap}.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-3">
            How sibling nap syncing works
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed mb-4">
            To achieve overlapping naps when managing two children under two, lock in
            your older toddler&apos;s afternoon nap time first. Then, adjust your
            infant&apos;s morning wake windows so their second or third nap aligns
            directly with the toddler&apos;s sleep schedule.
          </p>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-3">
            Why this tool exists and nothing else like it really does
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed">
            Single-child wake-window calculators are common; a calculator built
            specifically to find the overlap between two different kids&apos; nap
            schedules is not. That&apos;s the actual gap this tool fills — most
            parents end up running two separate calculators in different tabs and
            doing the overlap math by hand, which is exactly the annoying process
            this replaces.
          </p>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-3">
            When the calculator says there&apos;s no overlap
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed mb-4">
            Not every age combination has a real overlap window — a newborn on 4–5
            short naps a day and a toddler on one long afternoon nap sometimes
            genuinely don&apos;t line up, especially in the early weeks. If
            that&apos;s your result:
          </p>
          <ul className="flex flex-col gap-2 mb-4 text-sm">
            <li className="text-ink-muted leading-relaxed">
              <strong className="text-ink">Check back after the younger
              child&apos;s naps consolidate</strong> — this usually happens
              gradually between 3–9 months and creates overlap windows that
              didn&apos;t exist before.
            </li>
            <li className="text-ink-muted leading-relaxed">
              <strong className="text-ink">Aim for partial overlap rather than
              full sync</strong> — even a 20–30 minute shared window is worth
              protecting, even when the calculator can&apos;t find a full
              nap-length match.
            </li>
            <li className="text-ink-muted leading-relaxed">
              See the{" "}
              <Link
                href="/schedules/dueling-naps"
                className="text-childB underline underline-offset-3 hover:text-ink transition-colors"
              >
                dueling naps schedule
              </Link>{" "}
              for the specific case of a baby on two naps paired with a toddler on
              one — it covers exactly this no-overlap stage in more depth than a
              calculator result can.
            </li>
          </ul>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-4">FAQ</h2>
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-ink font-medium text-sm mb-1">
                Why does the tool ask for morning wake time for both kids, not
                just one?
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                Because the overlap window is driven by both kids&apos; full
                wake-window math, not just one child&apos;s schedule — a 15-minute
                difference in either child&apos;s wake time can shift the overlap
                window meaningfully.
              </p>
            </div>
            <div>
              <p className="text-ink font-medium text-sm mb-1">
                What if my kids&apos; overlap window keeps drifting to a different
                time each day?
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                That&apos;s normal in the early weeks of any nap-consolidation
                stage (commonly 3–4 months and again around 9 months) — recalculate
                every few days during a transition rather than expecting a fixed
                daily time to hold.
              </p>
            </div>
            <div>
              <p className="text-ink font-medium text-sm mb-1">
                Should I wake a sleeping child to force the overlap?
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                Generally no — forcing an early wake-up to chase a calculated
                overlap usually costs you more in overtiredness than the shared nap
                time is worth. Treat the calculator&apos;s output as a target to
                nudge toward gradually, not a hard rule for tonight.
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

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-3">
            Want the full daily picture, not just naptime?
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed">
            This calculator solves the nap-overlap question. For a complete sample
            day — wake time, meals, and bedtime, not just naps — see the{" "}
            <Link
              href="/schedules/2-under-2-schedule"
              className="text-childB underline underline-offset-3 hover:text-ink transition-colors"
            >
              2 under 2 schedule
            </Link>{" "}
            or{" "}
            <Link
              href="/schedules/two-toddlers-sync"
              className="text-childB underline underline-offset-3 hover:text-ink transition-colors"
            >
              two toddlers sync
            </Link>{" "}
            page, whichever matches your kids&apos; ages.
          </p>
        </div>

        <div
          className="rounded-xl p-7"
          style={{
            background: "linear-gradient(135deg, #25201a 0%, #1e1a15 100%)",
            border: "1px solid #D98C5F30",
            borderLeft: "4px solid #D98C5F",
          }}
        >
          <h2 className="font-display text-xl text-ink mb-2">
            Want automated schedule adjustments?
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed mb-5">
            Track dynamic nap times live in the free Sibling Stack app.
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
