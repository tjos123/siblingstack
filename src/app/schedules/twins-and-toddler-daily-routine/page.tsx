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
