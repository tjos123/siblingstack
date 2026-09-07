import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "3-Month-Old and Toddler Nap Schedule | Sibling Stack",
  description:
    "How to structure naps for a 3-month-old on a 4-nap routine and a toddler on a 1-nap routine. Maximize overlapping sleep windows.",
  alternates: {
    canonical: "https://www.siblingstack.com/schedules/3-month-old-and-toddler-nap-schedule",
  },
  openGraph: {
    title: "3-Month-Old and Toddler Nap Schedule | Sibling Stack",
    description:
      "How to structure naps for a 3-month-old on a 4-nap routine and a toddler on a 1-nap routine.",
    url: "https://www.siblingstack.com/schedules/3-month-old-and-toddler-nap-schedule",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "article",
  },
};

const naps = [
  { name: "Infant nap #1", time: "08:30 – 09:30", babyWindow: "75–90 min wake window", status: "Toddler awake / breakfast time" },
  { name: "Infant nap #2", time: "11:00 – 12:00", babyWindow: "90 min wake window", status: "Toddler lunch prep time" },
  { name: "OVERLAPPING NAP", time: "13:00 – 14:30", babyWindow: "Infant nap #3 + toddler nap", status: "Golden hour — both kids sleeping", highlight: true },
  { name: "Infant nap #4", time: "16:30 – 17:00", babyWindow: "Short catnap", status: "Toddler quiet play" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "3-Month-Old and Toddler Nap Schedule",
  description: "Syncing a 3-month-old baby wake window with a toddler single afternoon nap.",
};

export default function ThreeMonthOldToddlerPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div
        className="px-6 pt-10 pb-10"
        style={{
          background: "linear-gradient(180deg, #25201a 0%, #1c1815 100%)",
          borderBottom: "1px solid #5FA39A25",
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
            <span className="text-xs font-mono uppercase tracking-widest text-childB px-2 py-0.5 rounded-full bg-childB/15 border border-childB/40">
              3-Month-Old + Toddler (1–3 Yrs)
            </span>
          </div>

          <h1 className="font-display text-3xl text-ink leading-tight mb-4" style={{ maxWidth: "28ch" }}>
            3-Month-Old and Toddler Nap Schedule
          </h1>

          <p className="text-lg leading-relaxed text-ink-muted" style={{ maxWidth: "50ch" }}>
            At 3 months, infants transition toward 60–90 minute wake windows. This guide
            shows how to align nap #3 with your toddler&apos;s single afternoon nap.
          </p>

          <p className="text-sm leading-relaxed text-ink-muted mt-5" style={{ maxWidth: "60ch" }}>
            Three months is a pivot point, not an arbitrary age to pick: it&apos;s when most
            infants&apos; wake windows stretch out of the newborn range (30–45 min) into the
            60–90 minute range, which is what makes a <em>predictable</em> multi-nap structure
            possible for the first time — and what makes lining nap #3 up with a
            toddler&apos;s single nap a realistic target instead of luck.
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="px-6 pt-10 pb-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-xl text-ink mb-5">Nap breakdown</h2>

          <div className="flex flex-col gap-4">
            {naps.map((nap, i) => (
              <div
                key={i}
                className={`p-5 rounded-xl border ${
                  nap.highlight
                    ? "border-childA/30 bg-childA/5"
                    : "border-surface2 bg-surface"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <span className="text-ink font-medium text-sm">
                    {nap.name}
                    {nap.highlight && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-childA/15 text-childA">
                        Golden hour
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-sm text-childA">{nap.time}</span>
                </div>
                <p className="text-xs text-ink-muted mb-1">Wake window rule: {nap.babyWindow}</p>
                <p className="text-xs font-medium text-ink-muted">Status: {nap.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pt-10 pb-2">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div className="border border-surface2 rounded-xl bg-surface/40 p-6">
            <span className="text-xs font-mono uppercase tracking-widest text-childA px-2 py-0.5 rounded-full bg-childA/15 border border-childA/40">
              🎯 Focus
            </span>
            <h2 className="font-display text-ink text-xl mt-3 mb-3">
              Why nap #3 is the one worth planning around
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              The first two infant naps of the day are usually the most volatile — wake
              windows are shorter and more variable right after a long night&apos;s sleep. By the
              third wake window of the day, timing tends to be more consistent, which is
              exactly why it&apos;s the nap most likely to reliably line up with a toddler&apos;s
              early-afternoon nap. Don&apos;t put pressure on naps #1 and #2 to be predictable;
              put the planning effort into #3.
            </p>
          </div>

          <div className="border border-surface2 rounded-xl bg-surface/40 p-6">
            <span className="text-xs font-mono uppercase tracking-widest text-childA px-2 py-0.5 rounded-full bg-childA/15 border border-childA/40">
              🛠 Troubleshooting
            </span>
            <h2 className="font-display text-ink text-xl mt-3 mb-3">
              What throws the golden hour off
            </h2>
            <ul className="list-disc pl-6 flex flex-col gap-3">
              <li className="text-sm leading-relaxed text-ink-muted">
                <strong>A short nap #2.</strong> If the infant&apos;s second nap runs short, the
                third wake window starts earlier than planned and the &quot;golden hour&quot; can land
                mid-morning instead of early afternoon — check nap #2&apos;s length before
                assuming something&apos;s wrong with nap #3&apos;s timing.
              </li>
              <li className="text-sm leading-relaxed text-ink-muted">
                <strong>The 4-month regression, arriving early.</strong> Some babies show early
                signs of the wake-window jump associated with the 4-month sleep regression as
                early as 3.5 months — if the whole structure above suddenly stops working after
                weeks of consistency, this is the most common cause, not a mistake in the
                schedule.
              </li>
              <li className="text-sm leading-relaxed text-ink-muted">
                <strong>Toddler nap resistance days.</strong> If the toddler&apos;s single nap
                doesn&apos;t happen, don&apos;t try to force the infant&apos;s nap #3 to compensate — let
                each side run on its own timing that day and expect the overlap to resume the
                next day.
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
              What if my 3-month-old still needs 4–5 short naps instead of the 4 shown here?
            </h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              Totally normal at this age — some babies aren&apos;t consolidated into longer naps
              yet. Use the wake-window rule (60–90 min) rather than the specific nap count as
              your anchor; the number of naps will keep shifting for a few more months.
            </p>
          </div>
          <div>
            <h3 className="text-ink font-medium text-sm mb-1.5">
              Should I wake the baby from nap #3 if the toddler wakes up first?
            </h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              No — let the baby finish nap #3 naturally where possible. Have a quiet,
              low-supervision activity ready for the toddler for whatever gap remains, rather
              than cutting the infant nap short to keep both kids on the same clock.
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
              Free tool
            </p>
            <h2 className="font-display text-xl text-ink mb-2">
              Calculate your exact nap times automatically
            </h2>
            <p className="text-ink-muted text-sm leading-relaxed mb-5">
              Try the free wake window calculator — no login required.
            </p>
            <Link
              href="/tools/calculator"
              className="inline-block bg-childA text-bg font-medium rounded-md py-2.5 px-5 text-sm hover:opacity-90 transition-opacity"
            >
              Open calculator
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
