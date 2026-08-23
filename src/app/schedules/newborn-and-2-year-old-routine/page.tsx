import Link from "next/link";

export const metadata = {
  title: "Newborn and 2-Year-Old Daily Schedule | Sibling Stack",
  description:
    "A realistic daily schedule for a newborn (0–2 months) and a 2-year-old toddler. How to manage 2-nap vs 1-nap routines without losing your mind.",
  alternates: {
    canonical: "https://www.siblingstack.com/schedules/newborn-and-2-year-old-routine",
  },
  openGraph: {
    title: "Newborn and 2-Year-Old Daily Schedule | Sibling Stack",
    description:
      "A realistic daily schedule for a newborn (0–2 months) and a 2-year-old toddler.",
    url: "https://www.siblingstack.com/schedules/newborn-and-2-year-old-routine",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "article",
  },
};

const schedule = [
  { time: "07:00", label: "Morning wake-up", baby: "Nurse/bottle feed", toddler: "Breakfast & milk", focus: "High-chair setup keeps toddler safe while feeding baby." },
  { time: "08:15", label: "Morning nap", baby: "Nap #1 (60–75 min)", toddler: "1-on-1 playtime", focus: "Quality time with toddler while infant is down." },
  { time: "10:00", label: "Mid-morning outing", baby: "Feed & stroller nap", toddler: "Park / outdoor play", focus: "Burn toddler energy before lunch." },
  { time: "11:30", label: "Lunch time", baby: "Tummy time / awake", toddler: "Lunch & storytime", focus: "Transition toddler into low-energy state." },
  { time: "13:00", label: "THE GOLDEN HOUR", baby: "Nap #3 (90 min)", toddler: "Single afternoon nap", focus: "Both kids sleep simultaneously." },
  { time: "15:30", label: "Afternoon reset", baby: "Feed & play", toddler: "Snack & sensory bin", focus: "Low-prep sensory bin keeps toddler occupied." },
  { time: "17:30", label: "Dinner prep", baby: "Nap #4 (30-min catnap)", toddler: "Dinner & independent play", focus: "Babywearing in wrap while cooking." },
  { time: "19:30", label: "Toddler bedtime", baby: "Quiet floor time", toddler: "Bath, books, bed", focus: "Focus on toddler routine first." },
  { time: "20:15", label: "Newborn bedtime", baby: "Final feed & bed", toddler: "Asleep", focus: "Infant goes down for initial stretch of night sleep." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Newborn and 2-Year-Old Daily Schedule",
  description: "Daily routine for balancing a newborn with a 2-year-old toddler.",
  step: [
    { "@type": "HowToStep", position: 1, name: "7:00 AM — Morning Wake & Breakfast", text: "Feed newborn while toddler eats breakfast in high chair." },
    { "@type": "HowToStep", position: 2, name: "8:15 AM — Newborn Nap #1", text: "Newborn sleeps; 1-on-1 focused activity with toddler." },
    { "@type": "HowToStep", position: 3, name: "1:00 PM — Overlapping Afternoon Nap", text: "Toddler nap and newborn nap #3 align for quiet time." },
    { "@type": "HowToStep", position: 4, name: "7:30 PM — Staggered Bedtime", text: "Toddler bedtime at 7:30 PM, followed by newborn at 8:15 PM." },
  ],
};

export default function NewbornTwoYearOldPage() {
  return (
    <main className="min-h-screen">
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
              Newborn (0–2 Mo) + 2-Year-Old
            </span>
          </div>

          <h1 className="font-display text-3xl text-ink leading-tight mb-4" style={{ maxWidth: "28ch" }}>
            Newborn and 2-Year-Old Daily Schedule
          </h1>

          <p className="text-lg leading-relaxed text-ink-muted" style={{ maxWidth: "50ch" }}>
            Managing an unpredictable newborn alongside an active 2-year-old requires protecting the toddler&apos;s afternoon nap while letting infant wake windows stay flexible.
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
              <span className="font-display text-ink text-sm">Master timeline</span>
              <span className="text-xs text-ink-muted font-mono">Public template</span>
            </div>

            <div className="divide-y divide-surface2">
              {schedule.map((item, index) => (
                <div key={index} className="px-6 py-4 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                    <div className="sm:w-28 flex-shrink-0 font-mono text-sm text-childA font-medium pt-0.5">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <span className="text-ink font-medium text-sm">{item.label}</span>
                      <div className="flex flex-col sm:flex-row gap-2 mt-1.5">
                        <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-childB/15 text-childB">
                          Baby: {item.baby}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-md font-medium" style={{ background: "#9A7EC815", color: "#9A7EC8" }}>
                          Toddler: {item.toddler}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted mt-1.5 italic">{item.focus}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              Sync these schedules live
            </h2>
            <p className="text-ink-muted text-sm leading-relaxed mb-5">
              Custom wake window alerts, live schedule adjustments, and
              multi-caregiver syncing — all on one timeline.
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
