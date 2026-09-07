"use client";

import { useState } from "react";
import Link from "next/link";

type Q2 = "newborn" | "baby" | "toddler-9-18" | "toddler-18";
type Q3 = "napping" | "no-nap";
type Q4 = "2-naps" | "1-nap";
type Q5 = "home" | "school";

type Answers = {
  twins?: boolean;
  q2?: Q2;
  q3?: Q3;
  q4?: Q4;
  q5?: Q5;
};

const Q2_OPTIONS: { value: Q2; label: string }[] = [
  { value: "newborn", label: "Newborn (0–3 months)" },
  { value: "baby", label: "Baby (3–9 months)" },
  { value: "toddler-9-18", label: "Toddler (9–18 months)" },
  { value: "toddler-18", label: "Toddler (18+ months)" },
];

const Q3_OPTIONS: { value: Q3; label: string }[] = [
  { value: "napping", label: "Still napping" },
  {
    value: "no-nap",
    label: "Dropped or dropping the nap entirely (usually 3+ years)",
  },
];

const Q4_OPTIONS: { value: Q4; label: string }[] = [
  { value: "2-naps", label: "Still taking 2 naps a day" },
  { value: "1-nap", label: "Down to 1 nap a day" },
];

const Q5_OPTIONS: { value: Q5; label: string }[] = [
  { value: "home", label: "Home all day" },
  { value: "school", label: "In school or daycare part-time" },
];

type Match = {
  href: string;
  name: string;
  tag: string;
  variant?: string;
  closest?: boolean;
};

function getMatch(a: Answers): Match | null {
  if (a.twins) {
    return {
      href: "/schedules/twins-and-toddler-daily-routine",
      name: "Twins and Toddler Daily Routine",
      tag: "Infant Twins + Toddler",
    };
  }

  if (a.q2 === "newborn" || a.q2 === "baby") {
    if (a.q3 === "napping") {
      return a.q2 === "newborn"
        ? {
            href: "/schedules/2-under-2-schedule",
            name: "2 Under 2: Newborn + Toddler",
            tag: "Newborn + Toddler",
          }
        : {
            href: "/schedules/3-month-old-and-toddler-nap-schedule",
            name: "3-Month-Old and Toddler Nap Schedule",
            tag: "3-Month-Old + Toddler",
          };
    }
    return {
      href:
        a.q5 === "school"
          ? "/schedules/newborn-and-preschooler#school-hours"
          : "/schedules/newborn-and-preschooler#home-all-day",
      name: "Newborn + Preschooler Schedule",
      tag: "Newborn + Preschooler",
      variant:
        a.q5 === "school"
          ? "Preschooler in school or daycare part-time"
          : "Preschooler home all day",
    };
  }

  if (a.q2 === "toddler-9-18") {
    if (a.q3 === "napping") {
      return a.q4 === "2-naps"
        ? {
            href: "/schedules/dueling-naps",
            name: "Dueling Naps",
            tag: "Baby on 2 Naps + Toddler on 1",
          }
        : {
            href: "/schedules/two-toddlers-sync",
            name: "Two Toddlers Synced",
            tag: "Both on One Nap",
          };
    }
    return {
      href: "/schedules/quiet-time-sync",
      name: "Quiet Time Sync",
      tag: "One Drops the Nap, One Still Naps",
      closest: true,
    };
  }

  return a.q3 === "napping"
    ? {
        href: "/schedules/two-toddlers-sync",
        name: "Two Toddlers Synced",
        tag: "Both on One Nap",
      }
    : {
        href: "/schedules/quiet-time-sync",
        name: "Quiet Time Sync",
        tag: "One Drops the Nap, One Still Naps",
      };
}

function nextQuestion(a: Answers): string | null {
  if (a.twins === undefined) return "q1";
  if (a.twins === true) return null;
  if (a.q2 === undefined) return "q2";
  if (a.q3 === undefined) return "q3";
  const needQ4 = a.q2 === "toddler-9-18" && a.q3 === "napping";
  const needQ5 =
    a.q3 === "no-nap" && (a.q2 === "newborn" || a.q2 === "baby");
  if (needQ4 && a.q4 === undefined) return "q4";
  if (needQ5 && a.q5 === undefined) return "q5";
  return null;
}

function stepNumber(current: string): number {
  switch (current) {
    case "q1":
      return 1;
    case "q2":
      return 2;
    case "q3":
      return 3;
    default:
      return 4; // q4 / q5 are always the last question
  }
}

function QuestionStep({
  question,
  options,
  onSelect,
}: {
  question: string;
  options: { value: string | boolean; label: string }[];
  onSelect: (value: string | boolean) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-3">
        {question}
      </label>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onSelect(option.value)}
            className="text-left border rounded-lg px-4 py-3 text-sm transition-colors border-surface2 bg-surface text-ink-muted hover:border-childA/50 hover:text-ink"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ScheduleQuiz() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});

  const current = started ? nextQuestion(answers) : null;
  const match = getMatch(answers);
  const showResult = current === null && answers.twins !== undefined;

  const select = (value: string | boolean, field: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const goBack = () => {
    if (current === "q1") {
      setStarted(false);
      return;
    }
    setAnswers((prev) => {
      const clear = {
        q2: { twins: undefined, q2: undefined, q3: undefined, q4: undefined, q5: undefined },
        q3: { q2: undefined, q3: undefined, q4: undefined, q5: undefined },
        q4: { q3: undefined, q4: undefined, q5: undefined },
        q5: { q3: undefined, q5: undefined },
      }[current as string] ?? {};
      return { ...prev, ...clear };
    });
  };

  const restart = () => {
    setAnswers({});
    setStarted(false);
  };

  const stepNum = current ? stepNumber(current) : 0;

  const stepOpts: {
    question: string;
    options: { value: string | boolean; label: string }[];
    field: string;
  } | null =
    current === "q1"
      ? {
          question:
            "Are you managing twins or multiples, plus an older sibling?",
          options: [
            { value: true, label: "Yes — twins or multiples" },
            { value: false, label: "No — just two kids" },
          ],
          field: "twins",
        }
      : current === "q2"
        ? {
            question: "How old is your younger child?",
            options: Q2_OPTIONS,
            field: "q2",
          }
        : current === "q3"
          ? {
              question:
                "How old is your older child, and are they still napping?",
              options: Q3_OPTIONS,
              field: "q3",
            }
          : current === "q4"
            ? {
                question:
                  "Is your younger child still taking 2 naps a day, or down to 1?",
                options: Q4_OPTIONS,
                field: "q4",
              }
            : current === "q5"
              ? {
                  question:
                    "Is your older child home all day, or in school/daycare part-time?",
                  options: Q5_OPTIONS,
                  field: "q5",
                }
              : null;

  return (
    <div className="border border-surface2 rounded-xl p-6 sm:p-8">
      <span className="text-xs font-mono uppercase tracking-widest text-childA px-2 py-0.5 rounded-full bg-childA/15 border border-childA/40 inline-block mb-3">
        Free to use
      </span>
      <h2 className="font-display text-xl text-ink mb-2">
        Which schedule am I?
      </h2>
      <p className="text-ink-muted text-sm leading-relaxed mb-6">
        Not sure which routine fits your family? Answer a few quick questions
        and we&apos;ll point you to the schedule that matches your kids&apos;
        ages and nap status.
      </p>

      {!started ? (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="inline-block bg-childA text-bg font-medium rounded-md py-2.5 px-5 text-sm hover:opacity-90 transition-opacity"
        >
          Find my schedule
        </button>
      ) : stepOpts ? (
        <div>
          <QuestionStep
            question={stepOpts.question}
            options={stepOpts.options}
            onSelect={(value) => select(value, stepOpts.field)}
          />
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              ← Back
            </button>
            <span className="text-xs text-ink-muted font-mono">
              Question {stepNum}
            </span>
          </div>
        </div>
      ) : showResult && match ? (
        <div className="bg-surface border border-surface2 rounded-xl p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-childA mb-2">
            Your match
          </p>
          <p className="text-sm text-ink-muted leading-relaxed mb-3">
            Based on your answers, here&apos;s your match:
          </p>
          <div className="flex flex-col gap-2 mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-childA px-2 py-0.5 rounded-full bg-childA/15 border border-childA/40 self-start">
              {match.tag}
            </span>
            <h3 className="font-display text-lg text-ink leading-snug">
              {match.name}
            </h3>
            {match.variant && (
              <p className="text-sm text-ink-muted">{match.variant}</p>
            )}
            {match.closest && (
              <p className="text-sm text-ink-muted leading-relaxed">
                Closest match — this schedule assumes an 18–22-month-old, so
                expect to adapt timings for a younger toddler.
              </p>
            )}
          </div>
          <Link
            href={match.href}
            className="inline-block bg-childA text-bg font-medium rounded-md py-2.5 px-5 text-sm hover:opacity-90 transition-opacity mb-6"
          >
            View this schedule →
          </Link>

          <div className="border-t border-surface2 pt-5">
            <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-3">
              Also useful for your situation
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/schedules/bedtime-stagger-guide"
                className="text-sm text-childB hover:text-ink transition-colors"
              >
                Staggering bedtime between siblings →
              </Link>
              <Link
                href="/blog/crib-and-bassinet-setup-two-babies-one-room"
                className="text-sm text-childB hover:text-ink transition-colors"
              >
                Sharing a room without waking each other up →
              </Link>
            </div>
          </div>

          <div className="border-t border-surface2 pt-5 mt-5 flex items-center justify-between">
            <a
              href="#all-schedules"
              className="text-sm text-childA underline decoration-childA/40 underline-offset-2 hover:text-ink transition-colors"
            >
              Not quite right? See all schedules
            </a>
            <button
              type="button"
              onClick={restart}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}