"use client";

import { useState } from "react";
import Link from "next/link";

type Mood = "calm" | "rubbing_eyes" | "crying";

export default function BedtimeStaggerCalculator() {
  const [child1Name, setChild1Name] = useState("Newborn/baby");
  const [child2Name, setChild2Name] = useState("Toddler");
  const [child1Mood, setChild1Mood] = useState<Mood>("rubbing_eyes");
  const [child2Mood, setChild2Mood] = useState<Mood>("calm");
  const [recommendation, setRecommendation] = useState<{
    first: string;
    firstTime: string;
    second: string;
    secondTime: string;
    reason: string;
  } | null>(null);

  const calculateStagger = () => {
    if (child1Mood === "crying" || (child1Mood === "rubbing_eyes" && child2Mood === "calm")) {
      setRecommendation({
        first: child1Name,
        firstTime: "6:45 PM",
        second: child2Name,
        secondTime: "7:30 PM",
        reason: `${child1Name} is showing signs of high overtiredness or fussiness. Putting them down first prevents a cortisol spike that disrupts night sleep.`,
      });
    } else {
      setRecommendation({
        first: child2Name,
        firstTime: "7:00 PM",
        second: child1Name,
        secondTime: "7:45 PM",
        reason: `${child2Name} requires a structured bedtime routine first. Keep ${child1Name} in a safe bassinet or carrier during toddler bedtime books.`,
      });
    }
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

          <span className="text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-full mb-4 inline-block" style={{ color: "#9A7EC8", background: "#9A7EC815", border: "1px solid #9A7EC840" }}>
            Bedtime order decision tool
          </span>

          <h1 className="font-display text-3xl text-ink mb-2">
            Bedtime stagger calculator
          </h1>
          <p className="text-ink-muted leading-relaxed">
            Never put both kids down at the exact same minute. Answer two simple
            questions to know which child to put to sleep first tonight.
          </p>
        </div>

        <div className="border border-surface2 rounded-xl p-6 sm:p-8 mb-12">
          <div className="flex flex-col gap-6">
            <div className="p-4 bg-surface rounded-xl border border-surface2">
              <h3 className="text-ink font-medium text-sm mb-3">Child #1 (younger child)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">Name / label</label>
                  <input
                    type="text"
                    value={child1Name}
                    onChange={(e) => setChild1Name(e.target.value)}
                    className="w-full bg-bg border border-surface2 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-childA"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">Current mood / fatigue</label>
                  <select
                    value={child1Mood}
                    onChange={(e) => setChild1Mood(e.target.value as Mood)}
                    className="w-full bg-bg border border-surface2 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-childA"
                  >
                    <option value="calm">Calm & content</option>
                    <option value="rubbing_eyes">Rubbing eyes / yawning</option>
                    <option value="crying">Fussy / crying (overtired)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface rounded-xl border border-surface2">
              <h3 className="text-ink font-medium text-sm mb-3">Child #2 (older child)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">Name / label</label>
                  <input
                    type="text"
                    value={child2Name}
                    onChange={(e) => setChild2Name(e.target.value)}
                    className="w-full bg-bg border border-surface2 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-childA"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">Current mood / fatigue</label>
                  <select
                    value={child2Mood}
                    onChange={(e) => setChild2Mood(e.target.value as Mood)}
                    className="w-full bg-bg border border-surface2 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-childA"
                  >
                    <option value="calm">Calm & content</option>
                    <option value="rubbing_eyes">Rubbing eyes / yawning</option>
                    <option value="crying">Fussy / crying (overtired)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={calculateStagger}
              className="w-full bg-childA text-bg font-medium rounded-md py-3 text-sm hover:opacity-90 transition-opacity"
            >
              Determine tonight&apos;s bedtime order
            </button>

            {recommendation && (
              <div className="bg-surface border border-surface2 rounded-xl p-6">
                <p className="text-sm font-medium text-ink mb-3">Recommended bedtime order</p>

                <div className="flex flex-col gap-2 mb-4">
                  <div className="p-3 bg-bg rounded-lg border border-surface2 flex justify-between items-center">
                    <span className="text-ink font-medium text-sm">1st: {recommendation.first}</span>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-childA/15 text-childA">
                      Target: {recommendation.firstTime}
                    </span>
                  </div>
                  <div className="p-3 bg-bg rounded-lg border border-surface2 flex justify-between items-center">
                    <span className="text-ink font-medium text-sm">2nd: {recommendation.second}</span>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-surface text-ink-muted">
                      Target: {recommendation.secondTime}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-ink-muted leading-relaxed">
                  <span className="font-medium text-ink">Why this order?</span> {recommendation.reason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
