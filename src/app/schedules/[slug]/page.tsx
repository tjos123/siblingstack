import { notFound } from "next/navigation";
import Link from "next/link";
import { schedules, getSchedule } from "@/lib/schedules";
import type { ScheduleEntry } from "@/lib/schedules";

export function generateStaticParams() {
  return schedules.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const schedule = getSchedule(params.slug);
  if (!schedule) return {};
  return {
    title: `${schedule.title} — Sibling Stack`,
    description: schedule.description,
    alternates: {
      canonical: `https://www.siblingstack.com/schedules/${params.slug}`,
    },
    openGraph: {
      title: schedule.title,
      description: schedule.description,
      url: `https://www.siblingstack.com/schedules/${params.slug}`,
      siteName: "Sibling Stack",
      locale: "en_US",
      type: "article",
    },
  };
}

const TYPE_COLORS: Record<ScheduleEntry["type"], { bg: string; text: string; label: string }> = {
  both:   { bg: "bg-childA/15", text: "text-childA",   label: "Both" },
  baby:   { bg: "bg-childB/15", text: "text-childB",   label: "Baby" },
  toddler: { bg: "#9A7EC815",   text: "text-[#9A7EC8]", label: "Toddler" },
};

export default function SchedulePage({ params }: { params: { slug: string } }) {
  const schedule = getSchedule(params.slug);
  if (!schedule) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: schedule.title,
    description: schedule.description,
    step: schedule.timeline.map((item, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: `${item.time} — ${item.activity}`,
      text: item.note || item.activity,
    })),
  };

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
              {schedule.ageGroup}
            </span>
          </div>

          <h1 className="font-display text-3xl text-ink leading-tight mb-4" style={{ maxWidth: "26ch" }}>
            {schedule.title}
          </h1>

          <p className="text-lg leading-relaxed text-ink-muted" style={{ maxWidth: "50ch" }}>
            {schedule.description}
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
              <span className="font-display text-ink text-sm">Sample routine</span>
              <span className="text-xs text-ink-muted font-mono">Public preview</span>
            </div>

            <div className="divide-y divide-surface2">
              {schedule.timeline.map((item, index) => {
                const colors = TYPE_COLORS[item.type];
                return (
                  <div key={index} className="px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
                    <div className="sm:w-28 flex-shrink-0 font-mono text-sm text-childA font-medium pt-0.5">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-ink font-medium text-sm">{item.activity}</span>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                          {colors.label}
                        </span>
                      </div>
                      {item.note && (
                        <p className="text-sm text-ink-muted mt-1">{item.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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
              Want to customize this routine live?
            </h2>
            <p className="text-ink-muted text-sm leading-relaxed mb-5">
              Track nap times in real time, receive automatic wake window alerts,
              and sync across multiple caregivers — all on one timeline.
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
