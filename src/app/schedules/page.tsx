import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { schedules } from "@/lib/schedules";
import ScheduleQuiz from "./ScheduleQuiz";

const extraSchedules = [
  {
    slug: "3-month-old-and-toddler-nap-schedule",
    ageGroup: "3-Month-Old + Toddler (1–3 Yrs)",
    title: "3-Month-Old and Toddler Nap Schedule",
    description:
      "How to structure naps for a 3-month-old on a 4-nap routine and a toddler on a 1-nap routine. Maximize overlapping sleep windows.",
  },
  {
    slug: "twins-and-toddler-daily-routine",
    ageGroup: "Infant Twins + Toddler",
    title: "Twins and Toddler Daily Routine",
    description:
      "How to manage infant twins alongside an older toddler — daily schedule, double wake windows, feeding organization, and sleep safety tactics.",
  },
  {
    slug: "bedtime-stagger-guide",
    ageGroup: "Bedtime",
    title: "Staggering Bedtime Between Siblings: The Complete Guide",
    description:
      "Why staggering bedtime usually beats putting both kids down at once, how big a gap to leave, and what to do with the second child while the first one settles.",
  },
  {
    slug: "newborn-and-preschooler",
    ageGroup: "Newborn + Preschooler",
    title: "Newborn and Preschooler Schedule",
    description:
      "When there's no nap overlap to find — sample routines for a newborn and preschooler whether the older child is home all day or in school part-time.",
  },
];

export const metadata = {
  title: "Schedule Templates — Sibling Stack",
  description:
    "Pre-made daily schedule templates for families with two kids close in age. Find a routine that fits your kids' ages and customize it for your family.",
  alternates: {
    canonical: "https://www.siblingstack.com/schedules",
  },
  openGraph: {
    title: "Schedule Templates — Sibling Stack",
    description:
      "Pre-made daily schedule templates for families with two kids close in age.",
    url: "https://www.siblingstack.com/schedules",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

export default function SchedulesPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <SiteHeader />
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-ink-muted hover:text-ink transition-colors">
              Home
            </Link>
            <span className="text-surface2">›</span>
            <span className="text-ink-muted">Schedules</span>
          </nav>

          <h1 className="font-display text-3xl text-ink mt-5 mb-2">
            Schedule templates
          </h1>
          <p className="text-ink-muted leading-relaxed">
            Pre-made daily routines for two kids close in age. Pick the one
            closest to your kids&apos; ages, see how the day actually flows, then
            sign up to customize and track it live.
          </p>
        </div>

        <div className="mb-12" id="quiz">
          <ScheduleQuiz />
        </div>

        <div className="flex flex-col gap-4 scroll-mt-24" id="all-schedules">
          {[...schedules, ...extraSchedules].map((schedule) => (
            <Link
              key={schedule.slug}
              href={`/schedules/${schedule.slug}`}
              className="block group"
            >
              <article className="border border-surface2 rounded-xl p-6 hover:border-childA transition-colors">
                <span className="text-xs font-mono uppercase tracking-widest text-childA mb-3 block">
                  {schedule.ageGroup}
                </span>
                <h2 className="font-display text-lg text-ink leading-snug mb-2 group-hover:text-childA transition-colors">
                  {schedule.title}
                </h2>
                <p className="text-ink-muted text-sm leading-relaxed line-clamp-2">
                  {schedule.description}
                </p>
                <span className="text-sm font-medium text-childA mt-4 inline-flex items-center gap-1.5 transition-all group-hover:gap-2.5">
                  View schedule
                </span>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-surface2">
          <p className="font-display text-lg text-ink mb-3">About these templates</p>
          <p className="text-ink-muted text-sm leading-relaxed max-w-lg">
            Every schedule here is a starting point — not a prescription. Your kids
            will follow their own version of any routine. These templates give you a
            realistic structure to begin with, then Sibling Stack helps you adapt
            based on what actually happens day to day.
          </p>
        </div>
      </div>
    </main>
  );
}
