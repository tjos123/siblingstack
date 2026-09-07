"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";

const TRANSITION_OPTIONS = [
  { value: 0, label: "Two naps → one nap" },
  { value: 1, label: "One nap → no nap" },
];

const FREQUENCY_OPTIONS = [
  { value: 0, label: "Rarely (0–1 times a week)" },
  { value: 1, label: "Sometimes (2–4 times a week)" },
  { value: 2, label: "Almost every day" },
];

const MOOD_OPTIONS = [
  { value: 0, label: "Rough — clearly overtired, hard evening" },
  { value: 1, label: "Manageable — a little cranky but okay" },
  { value: 2, label: "Actually fine, sometimes even better" },
];

const NIGHT_OPTIONS = [
  { value: 0, label: "Unchanged" },
  { value: 1, label: "Harder to settle at bedtime, or earlier morning waking" },
  { value: 2, label: "Sleeping later / longer than usual" },
];

const CONSISTENCY_OPTIONS = [
  { value: 0, label: "Less than a week" },
  { value: 1, label: "1–2 weeks" },
  { value: 2, label: "3+ weeks" },
];

const QUESTIONS = [
  {
    id: "q1",
    label: "Which transition are you asking about?",
    options: TRANSITION_OPTIONS,
  },
  {
    id: "q2",
    label:
      "How often does your toddler resist or fight the nap in question?",
    options: FREQUENCY_OPTIONS,
  },
  {
    id: "q3",
    label:
      "When they do skip or fight that nap, how's their mood the rest of the day?",
    options: MOOD_OPTIONS,
  },
  {
    id: "q4",
    label: "How's nighttime sleep been the last two weeks?",
    options: NIGHT_OPTIONS,
  },
  {
    id: "q5",
    label:
      "How long has this pattern been consistent (not just a rough day or two)?",
    options: CONSISTENCY_OPTIONS,
  },
];

export default function NapTransitionQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    outcome: "not-yet" | "starting" | "ready";
    transition: "two-to-one" | "one-to-none";
  } | null>(null);

  const isComplete = QUESTIONS.every((q) => answers[q.id] !== undefined);

  const getResult = () => {
    if (!isComplete) return;
    const weighted =
      (answers.q2 ?? 0) +
      (answers.q3 ?? 0) +
      (answers.q4 ?? 0) * 2 +
      (answers.q5 ?? 0) * 2;
    const outcome =
      weighted <= 4 ? "not-yet" : weighted >= 9 ? "ready" : "starting";
    const transition = answers.q1 === 0 ? "two-to-one" : "one-to-none";
    setResult({ outcome, transition });
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
            Free interactive quiz
          </span>

          <h1 className="font-display text-3xl text-ink mb-2">
            Is my toddler ready to drop a nap?
          </h1>
          <p className="text-ink-muted leading-relaxed">
            Age ranges are a starting point, not an answer — some toddlers are
            ready to consolidate naps at 13 months, others not until past 20.
            Answer these questions about the last two weeks (not just today) to
            get a clearer read than the age chart alone.
          </p>
          <p className="text-ink-muted leading-relaxed mt-3">
            Not sure the current nap timing is even right yet? Check the{" "}
            <Link
              href="/tools/wake-window-calculator"
              className="text-childB underline underline-offset-3 hover:text-ink transition-colors"
            >
              wake window calculator
            </Link>{" "}
            first — a nap can look &quot;resisted&quot; when it&apos;s simply
            mistimed.
          </p>
        </div>

        <div className="border border-surface2 rounded-xl p-6 sm:p-8 mb-12">
          <div className="flex flex-col gap-6">
            {QUESTIONS.map((question, index) => (
              <div key={question.id}>
                <label className="block text-sm font-medium text-ink mb-3">
                  {index + 1}. {question.label}
                </label>
                <div className="flex flex-col gap-2">
                  {question.options.map((option) => {
                    const selected = answers[question.id] === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: option.value,
                          }));
                          setResult(null);
                        }}
                        className={`text-left border rounded-lg px-4 py-3 text-sm transition-colors ${
                          selected
                            ? "border-childA bg-childA/10 text-ink"
                            : "border-surface2 bg-surface text-ink-muted hover:border-childA/50 hover:text-ink"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={getResult}
              disabled={!isComplete}
              className={`w-full bg-childA text-bg font-medium rounded-md py-3 text-sm transition-opacity ${
                isComplete ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"
              }`}
            >
              Get my readiness result
            </button>

            {result && (
              <div className="bg-surface border border-surface2 rounded-xl p-6">
                {result.outcome === "not-yet" && (
                  <>
                    <p className="text-xs font-mono uppercase tracking-widest text-childA mb-2">
                      Result: not yet
                    </p>
                    <p className="text-sm text-ink-muted leading-relaxed mb-4">
                      The resistance is likely a phase, not readiness — hold the
                      current nap schedule steady for another 1–2 weeks before
                      changing anything. Changing too early based on a few rough
                      days is the most common mistake at this stage.
                    </p>
                  </>
                )}
                {result.outcome === "starting" && (
                  <>
                    <p className="text-xs font-mono uppercase tracking-widest text-childA mb-2">
                      Result: starting to transition
                    </p>
                    <p className="text-sm text-ink-muted leading-relaxed mb-4">
                      This is the in-between window — most toddlers take 2–6
                      weeks to fully transition, not a single clean cutover day.
                      Start nudging nap timing gradually rather than dropping the
                      nap outright.
                    </p>
                  </>
                )}
                {result.outcome === "ready" && (
                  <>
                    <p className="text-xs font-mono uppercase tracking-widest text-childA mb-2">
                      Result: ready
                    </p>
                    <p className="text-sm text-ink-muted leading-relaxed mb-4">
                      The consistency and the nighttime-sleep signal together are
                      the strongest indicators of real readiness, not just a rough
                      patch. Time to actively shift the schedule — see the linked
                      transition guide below for the specific version that matches
                      this stage.
                    </p>
                    <div className="flex flex-col gap-2">
                      {result.transition === "two-to-one" ? (
                        <Link
                          href="/schedules/dueling-naps"
                          className="text-sm text-childB underline underline-offset-3 hover:text-ink transition-colors"
                        >
                          Start with the dueling naps schedule →
                        </Link>
                      ) : (
                        <Link
                          href="/schedules/quiet-time-sync"
                          className="text-sm text-childB underline underline-offset-3 hover:text-ink transition-colors"
                        >
                          Start with the quiet time sync schedule →
                        </Link>
                      )}
                      <Link
                        href="/tools/wake-window-calculator"
                        className="text-sm text-childB underline underline-offset-3 hover:text-ink transition-colors"
                      >
                        Recheck current nap timing with the wake window calculator →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-3">
            Why nighttime sleep is the signal that actually matters
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed">
            Daytime nap resistance alone is a weak signal — plenty of toddlers
            fight a nap they still need. What tends to separate a real transition
            from a temporary phase is what happens at night: consistently harder
            bedtime settling, earlier morning waking, or longer overall night
            sleep are the more reliable tells that the nap itself has started
            competing with nighttime sleep drive, rather than the toddler just
            having an off week.
          </p>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-3">
            Don&apos;t force a transition based on age alone
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed">
            The most common mistake isn&apos;t waiting too long — it&apos;s
            dropping a nap early because a specific birthday or age bracket
            suggested it &quot;should&quot; be time. A toddler who&apos;s still
            genuinely restorative-napping and gets pushed off the nap early often
            ends up more overtired, not more independent. Let the pattern, not
            the calendar, decide.
          </p>
        </div>

        <div className="border-t border-surface2 pt-8 mb-12">
          <h2 className="font-display text-xl text-ink mb-4">FAQ</h2>
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-ink font-medium text-sm mb-1">
                My toddler fights the nap but still eventually falls asleep —
                does that count as resistance?
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                Yes, if it&apos;s happening most days — the fight itself (even
                with eventual sleep) is often the earlier signal, showing up
                before full refusal does.
              </p>
            </div>
            <div>
              <p className="text-ink font-medium text-sm mb-1">
                Can a toddler go back to needing the old nap schedule after
                showing &quot;ready&quot; signs?
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                Yes, especially around illness, travel, or a developmental leap —
                a temporary regression back to the old schedule for a week or two
                isn&apos;t unusual and doesn&apos;t mean the transition assessment
                was wrong.
              </p>
            </div>
            <div>
              <p className="text-ink font-medium text-sm mb-1">
                What if the answers point in different directions?
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                Weight question 5 (consistency) and question 4 (nighttime sleep)
                most heavily — those two are the strongest signals; nap-time
                resistance alone is the weakest one on its own.
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
            Managing two kids&apos; sleep schedules at once?
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed mb-5">
            The Sibling Stack app tracks both kids&apos; sleep on one timeline so
            you can see where the dropping-nap wobble is pushing the rest of the
            day.
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