"use client";

import { useState } from "react";
import Link from "next/link";

const AGE_WAKE_WINDOWS = [
  { label: "0–1 months", minMinutes: 45, maxMinutes: 60, naps: "4–5 naps" },
  { label: "2–3 months", minMinutes: 60, maxMinutes: 90, naps: "3–4 naps" },
  { label: "4–5 months", minMinutes: 90, maxMinutes: 135, naps: "3 naps" },
  { label: "6–8 months", minMinutes: 120, maxMinutes: 180, naps: "2–3 naps" },
  { label: "9–12 months", minMinutes: 180, maxMinutes: 240, naps: "2 naps" },
  { label: "13–18 months", minMinutes: 210, maxMinutes: 300, naps: "1–2 naps" },
  { label: "19–24 months", minMinutes: 300, maxMinutes: 360, naps: "1 nap" },
];

export default function WakeWindowCalculator() {
  const [selectedAge, setSelectedAge] = useState(2);
  const [wakeTime, setWakeTime] = useState("07:00");
  const [calculatedNap, setCalculatedNap] = useState<string | null>(null);

  const calculateSleepTime = () => {
    const [hours, minutes] = wakeTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);

    const targetAge = AGE_WAKE_WINDOWS[selectedAge];
    const avgMinutes = Math.round((targetAge.minMinutes + targetAge.maxMinutes) / 2);

    date.setMinutes(date.getMinutes() + avgMinutes);

    const napTimeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCalculatedNap(napTimeStr);
  };

  const target = AGE_WAKE_WINDOWS[selectedAge];

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

          <h1 className="font-display text-3xl text-ink mb-2">
            Wake window calculator
          </h1>
          <p className="text-ink-muted leading-relaxed">
            Enter your baby&apos;s age and wake time to find the recommended time
            for their next nap — so you can put them down before overtiredness
            sets in.
          </p>
        </div>

        <div className="border border-surface2 rounded-xl p-6 sm:p-8 mb-12">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Baby&apos;s age
              </label>
              <select
                value={selectedAge}
                onChange={(e) => {
                  setSelectedAge(Number(e.target.value));
                  setCalculatedNap(null);
                }}
                className="w-full bg-surface border border-surface2 rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-childA"
              >
                {AGE_WAKE_WINDOWS.map((item, index) => (
                  <option key={index} value={index}>
                    {item.label} ({item.naps})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Time baby woke up
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => {
                  setWakeTime(e.target.value);
                  setCalculatedNap(null);
                }}
                className="w-full bg-surface border border-surface2 rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-childA"
              />
            </div>

            <button
              onClick={calculateSleepTime}
              className="w-full bg-childA text-bg font-medium rounded-md py-3 text-sm hover:opacity-90 transition-opacity"
            >
              Calculate next nap time
            </button>

            {calculatedNap && (
              <div className="bg-surface rounded-xl p-5 text-center border border-surface2">
                <p className="text-xs font-mono uppercase tracking-widest text-childA mb-2">
                  Recommended next nap
                </p>
                <p className="text-3xl font-display text-ink mb-1">{calculatedNap}</p>
                <p className="text-xs text-ink-muted">
                  Based on a {target.minMinutes}–{target.maxMinutes} minute wake window
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-3">
            What are wake windows?
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed mb-4">
            A wake window is the duration of time a baby can stay awake comfortably
            between naps without becoming overtired. Tracking these windows helps
            reduce fussiness at nap transitions and improves nighttime sleep quality.
          </p>
          <p className="text-ink-muted text-sm leading-relaxed">
            Every baby is different — these ranges are general guidelines. If your
            baby consistently seems overtired or under-tired at the recommended times,
            adjust by 15–30 minutes in either direction and see what works.
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
        <p className="text-xs font-mono uppercase tracking-widest mb-3 text-childA">
          Free to use
        </p>
        <h2 className="font-display text-xl text-ink mb-2">
          Managing two kids&apos; sleep windows at once?
        </h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-5">
          Sibling Stack shows both your kids&apos; wake windows on one timeline
          so you can see where they overlap and plan around conflicts.
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
