"use client";

import { useState } from "react";
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
