import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { schedules, getSchedule } from "@/lib/schedules";
import type { ScheduleEntry, ScheduleSection } from "@/lib/schedules";

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

function inlineFormat(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-childA underline decoration-childA/40 underline-offset-2 hover:text-ink">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>");
}

function TimelineTable({ timeline, label }: { timeline: ScheduleEntry[]; label?: string }) {
  return (
    <div className="border border-surface2 rounded-xl overflow-hidden">
      <div className="bg-surface px-6 py-4 flex items-center justify-between border-b border-surface2">
        <span className="font-display text-ink text-sm">{label ?? "Sample routine"}</span>
        <span className="text-xs text-ink-muted font-mono">Public preview</span>
      </div>

      <div className="divide-y divide-surface2">
        {timeline.map((item, index) => {
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
  );
}

function NotesList({ notes }: { notes: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      {notes.map((note, idx) => (
        <p
          key={idx}
          className="text-sm italic leading-relaxed text-ink-muted"
          dangerouslySetInnerHTML={{ __html: inlineFormat(note) }}
        />
      ))}
    </div>
  );
}

function SectionsList({ sections }: { sections: ScheduleSection[] }) {
  return (
    <div className="flex flex-col gap-6">
      {sections.map((section, idx) => (
        <div
          key={idx}
          id={section.id}
          className="border border-surface2 rounded-xl bg-surface/40 p-6 scroll-mt-24"
        >
          {section.badge && (
            <span className="text-xs font-mono uppercase tracking-widest text-childA px-2 py-0.5 rounded-full bg-childA/15 border border-childA/40">
              {section.badge}
            </span>
          )}
          <h2 className="font-display text-ink text-xl mt-3 mb-3">
            {section.title}
          </h2>
          {section.lead && (
            <p
              className="text-sm leading-relaxed text-ink-muted mb-4"
              dangerouslySetInnerHTML={{ __html: inlineFormat(section.lead) }}
            />
          )}
          {section.bullets && (
            <ul className="list-disc pl-6 flex flex-col gap-3">
              {section.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-ink-muted"
                  dangerouslySetInnerHTML={{ __html: inlineFormat(bullet) }}
                />
              ))}
            </ul>
          )}
          {section.paragraphs &&
            section.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed text-ink-muted mb-3"
                dangerouslySetInnerHTML={{ __html: inlineFormat(paragraph) }}
              />
            ))}
        </div>
      ))}
    </div>
  );
}

export default function SchedulePage({ params }: { params: { slug: string } }) {
  const schedule = getSchedule(params.slug);
  if (!schedule) notFound();

  const timeline = schedule.stages?.[0]?.timeline ?? schedule.timeline ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: schedule.title,
    description: schedule.description,
    step: timeline.map((item, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: `${item.time} — ${item.activity}`,
      text: item.note || item.activity,
    })),
  };

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
              {schedule.ageGroup}
            </span>
          </div>

          <h1 className="font-display text-3xl text-ink leading-tight mb-4" style={{ maxWidth: "26ch" }}>
            {schedule.title}
          </h1>

          <p className="text-lg leading-relaxed text-ink-muted" style={{ maxWidth: "50ch" }}>
            {schedule.description}
          </p>

          {schedule.intro && (
            <div className="mt-5 flex flex-col gap-4">
              {schedule.introTitle && (
                <h2 className="font-display text-ink text-xl">
                  {schedule.introTitle}
                </h2>
              )}
              {schedule.intro.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-sm leading-relaxed text-ink-muted"
                  style={{ maxWidth: "60ch" }}
                  dangerouslySetInnerHTML={{ __html: inlineFormat(paragraph) }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {schedule.stages && schedule.stages.length > 0 ? (
        <div className="px-6 pt-10 pb-2">
          <div className="max-w-2xl mx-auto flex flex-col gap-12">
            {schedule.stages.map((stage, idx) => (
              <section key={idx} id={stage.id} className="scroll-mt-24 flex flex-col gap-6">
                <div>
                  <h2 className="font-display text-2xl text-ink mb-3">
                    {stage.title}
                  </h2>
                  {stage.intro?.map((p, pi) => (
                    <p
                      key={pi}
                      className="text-sm leading-relaxed text-ink-muted"
                      style={{ maxWidth: "60ch" }}
                      dangerouslySetInnerHTML={{ __html: inlineFormat(p) }}
                    />
                  ))}
                </div>
                <TimelineTable timeline={stage.timeline} label={stage.timelineLabel} />
                {stage.notes && stage.notes.length > 0 && <NotesList notes={stage.notes} />}
                {stage.sections && stage.sections.length > 0 && <SectionsList sections={stage.sections} />}
              </section>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="px-6 pt-10 pb-4">
            <div className="max-w-2xl mx-auto">
              <TimelineTable timeline={schedule.timeline ?? []} />
            </div>
          </div>

          {schedule.notes && schedule.notes.length > 0 && (
            <div className="px-6 pt-4 pb-0">
              <div className="max-w-2xl mx-auto">
                <NotesList notes={schedule.notes} />
              </div>
            </div>
          )}

          {schedule.sections && schedule.sections.length > 0 && (
            <div className="px-6 pt-10 pb-2">
              <div className="max-w-2xl mx-auto">
                <SectionsList sections={schedule.sections} />
              </div>
            </div>
          )}
        </>
      )}

      {schedule.bedtimeGuide && (
        <div className="px-6 pt-8 pb-2">
          <div className="max-w-2xl mx-auto border border-surface2 rounded-xl bg-surface/40 p-6 scroll-mt-24">
            <h2 className="font-display text-ink text-xl mb-2">
              Sorting out bedtime?
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted mb-4">
              Which child goes first, how big a gap to leave, and what to do
              with the second child while the first settles — the full
              reasoning is in the bedtime stagger guide.
            </p>
            <Link
              href="/schedules/bedtime-stagger-guide"
              className="inline-block text-sm text-childA underline decoration-childA/40 underline-offset-2 hover:text-ink transition-colors"
            >
              Read the bedtime stagger guide →
            </Link>
          </div>
        </div>
      )}

      {schedule.faq && schedule.faq.length > 0 && (
        <div className="px-6 pt-8 pb-2">
          <div className="max-w-2xl mx-auto flex flex-col gap-5">
            <h2 className="font-display text-xl text-ink">FAQ</h2>
            {schedule.faq.map((item, idx) => (
              <div key={idx}>
                <h3 className="text-ink font-medium text-sm mb-1.5" dangerouslySetInnerHTML={{ __html: inlineFormat(item.question) }} />
                <p
                  className="text-sm leading-relaxed text-ink-muted"
                  dangerouslySetInnerHTML={{ __html: inlineFormat(item.answer) }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {schedule.next && (
        <div className="px-6 pt-8 pb-2">
          <div className="max-w-2xl mx-auto border border-surface2 rounded-xl bg-surface/40 p-6 scroll-mt-24">
            <h2 className="font-display text-ink text-xl mb-2">
              {schedule.next.title}
            </h2>
            {schedule.next.lead && (
              <p className="text-sm leading-relaxed text-ink-muted mb-4">
                {schedule.next.lead}
              </p>
            )}
            <ul className="flex flex-col gap-2.5">
              {schedule.next.items.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-sm text-childA underline decoration-childA/40 underline-offset-2 hover:text-ink transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {schedule.related && schedule.related.length > 0 && (
        <div className="px-6 pt-8 pb-2">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-4">
              More routines
            </p>
            <div className="flex flex-col gap-2.5">
              {schedule.related.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="text-sm text-childB hover:text-ink transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {schedule.tools && schedule.tools.length > 0 && (
        <div className="px-6 pt-8 pb-2">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-4">
              Try a matching tool
            </p>
            <div className="flex flex-col gap-2.5">
              {schedule.tools.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="text-sm text-childA underline decoration-childA/40 underline-offset-2 hover:text-ink transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

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