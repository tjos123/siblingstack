"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
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
          <p className="text-ink-muted leading-relaxed mt-4">
            Putting two overtired, wired kids down at the exact same moment is a
            common way bedtime falls apart — one feeds off the other&apos;s
            energy, or the calmer one gets pulled into the more fussy one&apos;s
            meltdown. Staggering by even 10–15 minutes, starting with whichever
            kid is closer to overtired, tends to go more smoothly than a
            simultaneous bedtime. This tool uses tonight&apos;s actual fatigue
            signals, not just a fixed schedule, to tell you which kid goes first.
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

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-3">
            Why fatigue level matters more than a fixed rule
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed">
            A generic rule like &quot;always put the younger one down first&quot;
            ignores the actual variable that matters: which kid is closer to
            overtired <em>tonight</em>. A toddler who skipped their nap today may
            need to go down before a calmer infant, even though the
            &quot;usual&quot; order would say otherwise. That&apos;s why this tool
            asks about tonight&apos;s mood rather than just ages — the answer
            should change night to night.
          </p>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-3">
            What to do with the second child while the first settles
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="text-ink-muted leading-relaxed">
              <strong className="text-ink">If you&apos;re solo parenting:</strong>{" "}
              set the second child up with a low-stimulation, self-directed
              activity (books, quiet toys) in a separate space for the 10–15
              minutes it takes to settle the first — not screen time right before
              their own bedtime, which can work against their own wind-down.
            </li>
            <li className="text-ink-muted leading-relaxed">
              <strong className="text-ink">If there are two adults
              available:</strong>{" "}
              split it — one parent handles the first child&apos;s full routine
              while the other keeps the second child calm and separate, then swap.
            </li>
            <li className="text-ink-muted leading-relaxed">
              <strong className="text-ink">If the second child is upset about
              being &quot;left out&quot; of the routine:</strong>{" "}
              a short, consistent transition phrase (&quot;your turn is next,
              right after&quot;) tends to reduce protest more than trying to
              explain the full reasoning each night.
            </li>
          </ul>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-4">FAQ</h2>
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-ink font-medium text-sm mb-1">
                What if both kids show the same fatigue level?
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                Default to whichever child normally takes longer to settle —
                starting the slower one first means you&apos;re not racing the
                second child&apos;s bedtime while still mid-routine with the
                first.
              </p>
            </div>
            <div>
              <p className="text-ink font-medium text-sm mb-1">
                Does the order matter if they sleep in separate rooms?
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                Less than if they share a room, but it still helps — a calmer
                bedtime routine with one child at a time is generally smoother
                even without the risk of one waking the other.
              </p>
            </div>
            <div>
              <p className="text-ink font-medium text-sm mb-1">
                Should the order always be the same, or does it really change
                nightly?
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                It genuinely changes — a child who had a rough nap or skipped it
                entirely may need to go first even if they&apos;re not usually
                first in your routine. That&apos;s the specific problem this tool
                solves that a fixed household rule can&apos;t.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-3">
            Once bedtime&apos;s sorted, what about naps?
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed">
            If naps are the harder part of your day rather than bedtime, the{" "}
            <Link
              href="/tools/nap-sync-calculator"
              className="text-childB underline underline-offset-3 hover:text-ink transition-colors"
            >
              sibling nap sync calculator
            </Link>{" "}
            solves for daytime overlap the same way this tool solves for
            tonight&apos;s bedtime order.
          </p>
        </div>

        <div className="border-t border-surface2 pt-8">
          <Link
            href="/irish-twins-guide"
            className="inline-flex items-center gap-2 text-sm text-childB hover:text-ink transition-colors"
          >
            <span aria-hidden="true">←</span>
            Irish twins: the complete guide
          </Link>
        </div>
      </div>
    </main>
  );
}
