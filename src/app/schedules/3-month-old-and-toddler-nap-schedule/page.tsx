import Link from "next/link";

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
