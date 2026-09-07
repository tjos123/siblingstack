"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

type Who = "newborn" | "preschooler" | "both";

type RoutineRow = {
  time: string;
  activity: string;
  who: Who;
};

const WHO_META: Record<
  Who,
  { bg: string; text: string; label: string }
> = {
  both: { bg: "bg-childA/15", text: "text-childA", label: "Both" },
  newborn: { bg: "bg-childB/15", text: "text-childB", label: "Newborn" },
  preschooler: {
    bg: "#9A7EC815",
    text: "text-[#9A7EC8]",
    label: "Preschooler",
  },
};

const HOME_ALL_DAY_ROUTINE: RoutineRow[] = [
  { time: "7:00", activity: "Both wake up", who: "both" },
  { time: "7:30", activity: "Breakfast together", who: "both" },
  { time: "8:30", activity: "Newborn's first nap", who: "newborn" },
  { time: "8:30–9:30", activity: "Protected one-on-one time with preschooler", who: "preschooler" },
  { time: "9:30", activity: "Newborn up, feed", who: "newborn" },
  { time: "10:00", activity: "Morning activity or outing — newborn naps on the go", who: "both" },
  { time: "12:00", activity: "Lunch together", who: "both" },
  { time: "13:00", activity: "Rest time (preschooler, in their room — no sleep expected) + newborn's longer nap", who: "both" },
  { time: "14:15", activity: "Rest time ends; snack", who: "both" },
  { time: "14:30–16:30", activity: "Afternoon activity, playdate, or errands", who: "both" },
  { time: "17:30", activity: "Dinner", who: "both" },
  { time: "18:30", activity: "Preschooler's bedtime routine", who: "preschooler" },
  { time: "19:00", activity: "Newborn's bedtime-adjacent wind-down (no fixed bedtime yet)", who: "newborn" },
];

const SCHOOL_DAY_ROUTINE: RoutineRow[] = [
  { time: "7:00", activity: "Both wake up, breakfast", who: "both" },
  { time: "8:00", activity: "Drop-off / school departure", who: "preschooler" },
  { time: "8:15 onward", activity: "Newborn's morning naps and feeds run on their own timing — no toddler-adjacent scheduling needed", who: "newborn" },
  { time: "12:00", activity: "Newborn's midday nap — your best solo window of the day", who: "newborn" },
  { time: "15:00", activity: "Pickup", who: "preschooler" },
  { time: "15:15–16:00", activity: "The reunion window — protected one-on-one time before anything else happens", who: "preschooler" },
  { time: "16:00–17:30", activity: "Free play / errands, newborn along for the ride", who: "both" },
  { time: "17:30", activity: "Dinner", who: "both" },
  { time: "18:30", activity: "Preschooler's bedtime routine (often earlier than home-all-day days — school is tiring)", who: "preschooler" },
  { time: "19:00", activity: "Newborn's bedtime-adjacent wind-down", who: "newborn" },
];

function RoutineTable({ rows }: { rows: RoutineRow[] }) {
  return (
    <div className="border border-surface2 rounded-xl overflow-hidden">
      <div className="bg-surface px-6 py-4 flex items-center justify-between border-b border-surface2">
        <span className="font-display text-ink text-sm">Sample routine</span>
        <span className="text-xs text-ink-muted font-mono">Public preview</span>
      </div>

      <div className="divide-y divide-surface2">
        {rows.map((row, index) => {
          const meta = WHO_META[row.who];
          return (
            <div
              key={index}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0"
            >
              <div className="sm:w-28 flex-shrink-0 font-mono text-sm text-childA font-medium pt-0.5">
                {row.time}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-ink font-medium text-sm">{row.activity}</span>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${meta.bg} ${meta.text}`}>
                    {meta.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-surface2 pt-8 mb-12">
      <h2 className="font-display text-xl text-ink mb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function NewbornAndPreschoolerPage() {
  const [mode, setMode] = useState<"home" | "school">("home");

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash;
      if (hash === "#school-hours") setMode("school");
      else if (hash === "#home-all-day") setMode("home");
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    const id = mode === "school" ? "school-hours" : "home-all-day";
    if (window.location.hash === `#${id}`) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [mode]);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div
        className="px-6 pt-10 pb-10"
        style={{
          background: "linear-gradient(180deg, #25201a 0%, #1c1815 100%)",
          borderBottom: "1px solid #D98C5F25",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-ink-muted hover:text-ink transition-colors">
              Sibling Stack
            </Link>
            <span className="text-surface2">›</span>
            <Link href="/schedules" className="text-ink-muted hover:text-ink transition-colors">
              Schedules
            </Link>
          </nav>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-mono uppercase tracking-widest text-childA px-2 py-0.5 rounded-full bg-childA/15 border border-childA/40">
              Newborn + Preschooler
            </span>
          </div>

          <h1 className="font-display text-3xl text-ink leading-tight mb-4" style={{ maxWidth: "26ch" }}>
            Newborn + Preschooler Schedule
          </h1>
          <p className="text-lg leading-relaxed text-ink-muted" style={{ maxWidth: "50ch" }}>
            When there&apos;s no nap overlap to find — how a newborn&apos;s
            unpredictable early weeks work around a preschooler who needs real
            engagement all day.
          </p>
        </div>
      </div>

      <div className="px-6 pt-10 pb-2">
        <div className="max-w-2xl mx-auto flex flex-col gap-12">
          <div>
            <p className="text-sm leading-relaxed text-ink-muted mb-4">
              Every other pairing on this site is built around finding a shared
              nap window — but if your older child is a preschooler who&apos;s
              already dropped their nap, that entire organizing idea doesn&apos;t
              apply here. There&apos;s no overlap to find. The real question at
              this age gap is different: how do you get through a newborn&apos;s
              unpredictable early weeks while a preschooler needs real engagement,
              conversation, and activity for most of their waking day? This page
              is built around that question instead.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <button
                type="button"
                onClick={() => {
                  setMode("home");
                  window.history?.replaceState(null, "", "#home-all-day");
                }}
                className={`text-left border rounded-xl p-4 transition-colors ${
                  mode === "home"
                    ? "border-childA bg-childA/10"
                    : "border-surface2 bg-surface/40 hover:border-childA/50"
                }`}
              >
                <p className={`text-sm font-medium ${mode === "home" ? "text-ink" : "text-ink-muted"}`}>
                  Preschooler home all day
                </p>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  No school or daycare yet — full-day coverage
                </p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("school");
                  window.history?.replaceState(null, "", "#school-hours");
                }}
                className={`text-left border rounded-xl p-4 transition-colors ${
                  mode === "school"
                    ? "border-childA bg-childA/10"
                    : "border-surface2 bg-surface/40 hover:border-childA/50"
                }`}
              >
                <p className={`text-sm font-medium ${mode === "school" ? "text-ink" : "text-ink-muted"}`}>
                  Preschooler in school/daycare part-time
                </p>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  A different rhythm — solo newborn hours, then a reunion
                </p>
              </button>
            </div>

            {mode === "home" ? (
              <div id="home-all-day" className="scroll-mt-24">
                <h2 className="font-display text-2xl text-ink mb-3">
                  If Your Preschooler Is Home All Day
                </h2>
                <p className="text-sm leading-relaxed text-ink-muted mb-6">
                  This is the harder version — you&apos;re managing a
                  newborn&apos;s around-the-clock needs while also being your
                  preschooler&apos;s main source of activity, conversation, and
                  engagement for the entire day, with no built-in break. The
                  schedule below leans on the one thing that does map from the
                  toddler-era pages: a &quot;rest time&quot; block, even without
                  sleep attached to it.
                </p>
                <RoutineTable rows={HOME_ALL_DAY_ROUTINE} />

                <div className="mt-12 flex flex-col gap-12">
                  <Section title="Why rest time matters even more here than at younger ages">
                    <p className="text-ink-muted text-sm leading-relaxed">
                      Most 4-year-olds who&apos;ve dropped the nap still benefit
                      from a genuine slow-down block — and at this specific age
                      gap, it&apos;s doing double duty: it gives the preschooler
                      downtime and gives you a predictable window to handle the
                      newborn without also entertaining an older child at the same
                      time. Keep it consistent even on days the preschooler
                      protests it; the predictability is the point, not compliance.
                    </p>
                  </Section>

                  <Section title="What actually falls apart at this stage">
                    <p className="text-ink-muted text-sm leading-relaxed mb-4">
                      The newborn&apos;s unpredictable early weeks collide with a
                      preschooler&apos;s need for real conversation — not just
                      proximity. A preschooler parked in front of a
                      newborn&apos;s feeding session for the tenth time that day
                      isn&apos;t getting what they actually need. Build in
                      dedicated blocks (even 15–20 minutes) where the preschooler
                      has your full attention, separate from newborn care.
                    </p>
                    <ul className="flex flex-col gap-3 text-sm">
                      <li className="text-ink-muted leading-relaxed">
                        Preschoolers this age can and will &quot;help&quot; —
                        handing you a burp cloth, picking the newborn&apos;s
                        outfit, &quot;reading&quot; to the baby. Many families
                        find this reduces jealousy-driven acting out more than
                        trying to shield the preschooler from newborn care
                        entirely.
                      </li>
                      <li className="text-ink-muted leading-relaxed">
                        The newborn&apos;s naps won&apos;t run on a
                        preschooler-friendly schedule for weeks. Don&apos;t try to
                        build the day around the newborn&apos;s exact nap times
                        the way you would with a younger sibling — anchor the day
                        around the preschooler&apos;s routine (meals, rest time,
                        bedtime) and let the newborn&apos;s care flex around it
                        instead.
                      </li>
                    </ul>
                  </Section>
                </div>
              </div>
            ) : (
              <div id="school-hours" className="scroll-mt-24">
                <h2 className="font-display text-2xl text-ink mb-3">
                  If Your Preschooler Is in School or Daycare Part-Time
                </h2>
                <p className="text-sm leading-relaxed text-ink-muted mb-6">
                  This version has a different shape entirely: you get a genuine
                  stretch of solo newborn time during school hours, followed by a
                  compressed, high-stakes afternoon reunion window where a
                  preschooler who&apos;s been &quot;on&quot; all day at school
                  meets a parent who&apos;s been solo with a newborn all day —
                  both arriving a little depleted at the same moment.
                </p>
                <RoutineTable rows={SCHOOL_DAY_ROUTINE} />

                <div className="mt-12 flex flex-col gap-12">
                  <Section title="Protect the reunion window on purpose">
                    <p className="text-ink-muted text-sm leading-relaxed">
                      The 30–45 minutes right after pickup is the highest-friction
                      point of this schedule, not the morning. A preschooler
                      coming off a full day of structure and social effort often
                      needs connection before anything else — snack, chores, even
                      the newborn&apos;s needs, where they can wait a few minutes.
                      Whoever&apos;s on newborn duty at pickup time, hand the baby
                      off if you can, even briefly, so the reunion isn&apos;t
                      competing with a feed.
                    </p>
                  </Section>

                  <Section title="Don't schedule anything demanding right after pickup">
                    <p className="text-ink-muted text-sm leading-relaxed">
                      Errands, appointments, or activities requiring the
                      preschooler&apos;s cooperation tend to go worse in this
                      window than any other time of day — they&apos;re often
                      running on empty by pickup, even if they seem fine. Save
                      demanding tasks for the morning solo-newborn stretch
                      instead, and treat the after-school hours as recovery time
                      for both kids.
                    </p>
                  </Section>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-surface2 pt-8 mb-12">
            <h2 className="font-display text-xl text-ink mb-4">FAQ</h2>
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-ink font-medium text-sm mb-1.5">
                  My preschooler still naps some days — does this page still apply?
                </h3>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Yes — occasional napping well into age 4–5 is normal. Use
                  whichever section (home-all-day or school-hours) matches your
                  situation, and treat any day they do nap as a bonus, not
                  something to plan around.
                </p>
              </div>
              <div>
                <h3 className="text-ink font-medium text-sm mb-1.5">
                  Is it normal for my preschooler to regress (potty accidents,
                  baby talk, clinginess) after the newborn arrives?
                </h3>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Yes, this is one of the most common adjustment patterns at any
                  sibling age gap, and it&apos;s not a sign anything&apos;s wrong
                  — it usually settles within a few weeks as the preschooler
                  adjusts, especially with consistent one-on-one time protected in
                  the routine.
                </p>
              </div>
              <div>
                <h3 className="text-ink font-medium text-sm mb-1.5">
                  Should I try to align the newborn&apos;s nap schedule with my
                  preschooler&apos;s school hours?
                </h3>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Not deliberately — a newborn&apos;s nap timing in the first
                  couple of months isn&apos;t reliably schedulable yet. Let it run
                  on its own pattern during school hours rather than trying to
                  force structure onto it.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-surface2 pt-8 mb-12">
            <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-4">
              Related
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/schedules/bedtime-stagger-guide"
                className="text-sm text-childB hover:text-ink transition-colors"
              >
                Managing bedtime for two kids at very different stages? See the
                bedtime stagger guide.
              </Link>
              <Link
                href="/blog/crib-and-bassinet-setup-two-babies-one-room"
                className="text-sm text-childB hover:text-ink transition-colors"
              >
                If your preschooler and newborn end up sharing a room at any
                point, the room-sharing sleep guide covers that separately.
              </Link>
            </div>
          </div>

          <div className="px-6 pt-6 pb-10" style={{ marginLeft: "-1.5rem", marginRight: "-1.5rem" }}>
            <div className="max-w-2xl mx-auto border-t border-surface2 pt-6">
              <Link
                href="/irish-twins-guide"
                className="inline-flex items-center gap-2 text-sm text-childB hover:text-ink transition-colors"
              >
                <span aria-hidden="true">←</span>
                Irish twins: the complete guide
              </Link>
            </div>
          </div>

          <div className="px-6 py-10" style={{ marginLeft: "-1.5rem", marginRight: "-1.5rem" }}>
            <div className="max-w-2xl mx-auto">
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
                  Want to track this live instead of adapting it by hand?
                </h2>
                <p className="text-ink-muted text-sm leading-relaxed mb-5">
                  Sibling Stack tracks both kids&apos; feeds and sleeps on one
                  timeline and surfaces where the day is drifting.
                </p>
                <Link
                  href="/sign-up"
                  className="inline-block bg-childA text-bg font-medium rounded-md py-2.5 px-5 text-sm hover:opacity-90 transition-opacity"
                >
                  Create your account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}