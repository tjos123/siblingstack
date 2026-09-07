import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Twins and Toddler Daily Routine | Sibling Stack",
  description:
    "How to manage infant twins alongside an older toddler. Daily schedule, double wake windows, feeding organization, and sleep safety tactics.",
  alternates: {
    canonical: "https://www.siblingstack.com/schedules/twins-and-toddler-daily-routine",
  },
  openGraph: {
    title: "Twins and Toddler Daily Routine | Sibling Stack",
    description:
      "How to manage infant twins alongside an older toddler.",
    url: "https://www.siblingstack.com/schedules/twins-and-toddler-daily-routine",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "article",
  },
};

const timeline = [
  { time: "06:30", task: "Twin feeding #1 (tandem feed)", note: "Feed both twins together using a twin nursing pillow or twin bouncer seats." },
  { time: "07:15", task: "Toddler wake & breakfast", note: "Place twins in safe playpen/floor mat while serving toddler breakfast." },
  { time: "08:00", task: "Twin nap #1", note: "Put twins down together to keep their sleep cycles strictly synced." },
  { time: "10:00", task: "Morning activity block", note: "Twin wake & feed, then joint activity with toddler." },
  { time: "11:30", task: "Lunch (all three)", note: "Toddler in high chair, twins fed separately or tandem." },
  { time: "12:30", task: "TRIPLE OVERLAP NAP", note: "Twins nap #2 and toddler afternoon nap occur simultaneously.", highlight: true },
  { time: "14:30", task: "Afternoon reset", note: "Toddler wakes first; twins may still be sleeping. Quiet play." },
  { time: "15:30", task: "Snack & outdoor time", note: "Stroller walk or park outing with all three." },
  { time: "17:00", task: "Dinner (all three)", note: "Toddler dinner first, then twin feed." },
  { time: "18:30", task: "Toddler bedtime", note: "Toddler goes down first so parents can focus on double twin night routines." },
  { time: "19:30", task: "Twins bedtime", note: "Final tandem feed and night sleep initiation for twins." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Twins and Toddler Daily Routine",
  description: "Systematic schedule for managing infant twins and an older toddler.",
};

export default function TwinsAndToddlerPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div
        className="px-6 pt-10 pb-10"
        style={{
          background: "linear-gradient(180deg, #25201a 0%, #1c1815 100%)",
          borderBottom: "1px solid #E54B4B25",
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
            <span className="text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ color: "#E54B4B", background: "#E54B4B15", border: "1px solid #E54B4B40" }}>
              Infant Twins + Toddler
            </span>
          </div>

          <h1 className="font-display text-3xl text-ink leading-tight mb-4" style={{ maxWidth: "26ch" }}>
            Twins and Toddler Daily Routine
          </h1>

          <p className="text-lg leading-relaxed text-ink-muted" style={{ maxWidth: "50ch" }}>
            The golden rule of managing twins with a toddler: if one twin wakes, wake
            the other twin. Keep infant sleep synchronized or you will never get a break.
          </p>

          <p className="text-sm leading-relaxed text-ink-muted mt-5" style={{ maxWidth: "60ch" }}>
            Twin-plus-toddler households run into a version of every problem singleton-plus-toddler households have, but doubled — and the toddler&apos;s needs are the part that gets squeezed first when things are tight. The tandem-sync method below is the standard approach for the newborn stage; the sections after the timeline cover what happens when it doesn&apos;t go that cleanly, and how to protect the toddler&apos;s place in the day.
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="px-6 pt-10 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="border border-surface2 rounded-xl overflow-hidden">
            <div className="bg-surface px-6 py-4 flex items-center justify-between border-b border-surface2">
              <span className="font-display text-ink text-sm">3-child master timeline</span>
              <span className="text-xs text-ink-muted font-mono">Twin sync method</span>
            </div>

            <div className="divide-y divide-surface2">
              {timeline.map((item, index) => (
                <div key={index} className="px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                  <div className="sm:w-28 flex-shrink-0 font-mono text-sm text-childA font-medium pt-0.5">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${item.highlight ? "text-childA" : "text-ink"}`}>
                      {item.task}
                    </span>
                    <p className="text-xs text-ink-muted mt-1">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="p-5 rounded-xl border border-[#E54B4B30] bg-[#E54B4B08]">
            <p className="text-sm font-medium text-[#E54B4B] mb-2">Twin safety tip</p>
            <p className="text-xs text-ink-muted leading-relaxed">
              Never attempt to put twins to sleep on separate schedules. If Twin A
              wakes up to feed at 2:00 AM, wake Twin B and feed them immediately
              after. This preserves a joint wake window throughout the daytime.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-10 pb-2">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div className="border border-surface2 rounded-xl bg-surface/40 p-6">
            <span className="text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ color: "#E54B4B", background: "#E54B4B15", border: "1px solid #E54B4B40" }}>
              🛠 Troubleshooting
            </span>
            <h2 className="font-display text-ink text-xl mt-3 mb-3">
              When tandem sync doesn&apos;t work for your twins
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              &quot;Wake one when the other wakes&quot; is the standard starting advice, and it&apos;s the right default — but it doesn&apos;t fit every twin pair. Twins can have genuinely different temperaments, feeding needs, or sleep drives, and some families find that forcing strict synchronization causes more crying and disruption than it saves. If you&apos;ve tried tandem waking consistently for a couple of weeks and it&apos;s clearly working against you rather than for you, letting the twins run 15–30 minutes offset from each other — rather than perfectly synced — is a legitimate alternative some families land on. There&apos;s no single right answer here; go with whichever produces more actual sleep for the house.
            </p>
          </div>

          <div className="border border-surface2 rounded-xl bg-surface/40 p-6">
            <span className="text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ color: "#E54B4B", background: "#E54B4B15", border: "1px solid #E54B4B40" }}>
              👀 Watch For
            </span>
            <h2 className="font-display text-ink text-xl mt-3 mb-3">
              Protecting the toddler&apos;s place in a twins-first household
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted mb-2">
              It&apos;s easy for a toddler&apos;s needs to become the flexible part of the day when there are two infants to manage — worth naming directly since it&apos;s the actual risk in this specific pairing more than in a single-baby household. A few things that help:
            </p>
            <ul className="list-disc pl-6 flex flex-col gap-3">
              <li className="text-sm leading-relaxed text-ink-muted">
                <strong>A &quot;divide and conquer&quot; approach when there are two adults available</strong> — one takes the toddler, one takes the twins, on a rotating basis so the toddler gets real one-on-one time rather than always being the third priority.
              </li>
              <li className="text-sm leading-relaxed text-ink-muted">
                <strong>A predictable toddler-only pocket of the day</strong>, even short, that doesn&apos;t move regardless of what the twins are doing — the reliability matters more than the length.
              </li>
              <li className="text-sm leading-relaxed text-ink-muted">
                <strong>Letting the toddler &quot;help&quot; with age-appropriate twin-care tasks</strong> (handing you a burp cloth, picking an outfit) — many families find this reduces jealousy-driven acting out more effectively than trying to shield the toddler from the twins&apos; care altogether.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 pb-2">
        <div className="max-w-2xl mx-auto flex flex-col gap-5">
          <h2 className="font-display text-xl text-ink">FAQ</h2>
          <div>
            <h3 className="text-ink font-medium text-sm mb-1.5">
              Is it really necessary to feed both twins at the exact same time?
            </h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              Not to the minute — a 15–20 minute window between them is generally fine and is what most tandem-feeding advice actually means in practice, not a simultaneous latch. The goal is avoiding a full cycle offset (one twin&apos;s whole feed-wake-sleep cycle running opposite the other&apos;s), not perfect synchrony.
            </p>
          </div>
          <div>
            <h3 className="text-ink font-medium text-sm mb-1.5">
              How do we handle the toddler wanting attention during a twin feed?
            </h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              Floor-level tandem feeding (nursing pillow or two bouncers, sitting on the floor) keeps you at the toddler&apos;s height and reachable for a book or conversation during the feed itself, rather than the toddler being shut out of a separate room for it.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 pb-2">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-4">
            More routines
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/schedules/2-under-2-schedule"
              className="text-sm text-childB hover:text-ink transition-colors"
            >
              2 Under 2: newborn + toddler (two naps or one)
            </Link>
            <Link
              href="/schedules/dueling-naps"
              className="text-sm text-childB hover:text-ink transition-colors"
            >
              Dueling naps: baby on 2 naps, toddler on 1
            </Link>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 pb-2">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-4">
            Try a matching tool
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/tools/nap-sync-calculator"
              className="text-sm text-childA underline decoration-childA/40 underline-offset-2 hover:text-ink transition-colors"
            >
              Nap Sync Calculator
            </Link>
            <Link
              href="/tools/calculator"
              className="text-sm text-childA underline decoration-childA/40 underline-offset-2 hover:text-ink transition-colors"
            >
              Wake Window / Age-gap Calculator
            </Link>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 pb-10">
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

      <div className="px-6 py-10">
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
              Ready to automate multi-child schedules?
            </h2>
            <p className="text-ink-muted text-sm leading-relaxed mb-5">
              Build a personalized timeline for 2, 3, or more siblings inside
              Sibling Stack.
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
    </main>
  );
}
