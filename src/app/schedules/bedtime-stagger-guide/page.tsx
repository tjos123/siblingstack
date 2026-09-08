import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Staggering Bedtime Between Siblings: The Complete Guide — Sibling Stack",
  description:
    "How to stagger bedtime between two kids close in age — how much time to leave, which kid goes first, and what to do with the second child while you settle the first.",
  alternates: { canonical: "https://www.siblingstack.com/schedules/bedtime-stagger-guide" },
  openGraph: {
    title: "Staggering Bedtime Between Siblings: The Complete Guide",
    description:
      "How to stagger bedtime between two kids close in age — how much time to leave, which kid goes first, and what to do with the second child while you settle the first.",
    url: "https://www.siblingstack.com/schedules/bedtime-stagger-guide",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "article",
  },
};

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

export default function BedtimeStaggerGuidePage() {
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
              Guide
            </span>
          </div>

          <h1 className="font-display text-3xl text-ink leading-tight mb-4" style={{ maxWidth: "26ch" }}>
            Staggering Bedtime Between Siblings
          </h1>
          <p className="text-lg leading-relaxed text-ink-muted" style={{ maxWidth: "50ch" }}>
            How to stagger bedtime between two kids close in age — how much time to
            leave, which kid goes first, and what to do with the second child while
            you settle the first.
          </p>

          <div className="mt-6 border border-childA/20 rounded-lg p-4 bg-childA/5">
            <p className="text-sm leading-relaxed text-ink-muted">
              Want tonight&apos;s specific answer instead of the full guide? The{" "}
              <Link
                href="/tools/bedtime-stagger-calculator"
                className="text-childB underline underline-offset-3 hover:text-ink transition-colors"
              >
                bedtime stagger calculator
              </Link>{" "}
              gives you a fast read based on tonight&apos;s fatigue signals.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-10 pb-2">
        <div className="max-w-2xl mx-auto flex flex-col gap-12">
          <Section title="Why staggering usually beats a simultaneous bedtime">
            <p className="text-ink-muted text-sm leading-relaxed">
              Putting two kids down at the exact same moment sounds efficient, but
              it&apos;s one of the more common ways bedtime falls apart — an
              overtired toddler&apos;s meltdown pulls a calmer infant out of their
              own wind-down, or a parent ends up splitting attention between two
              kids mid-routine instead of giving either one a real settle. A
              stagger of even 10–20 minutes, done consistently, tends to produce a
              calmer bedtime for both kids than trying to sync it.
            </p>
          </Section>

          <Section title="How much of a gap to leave">
            <p className="text-ink-muted text-sm leading-relaxed mb-4">
              There&apos;s no universal number, but most families land somewhere
              in the 15–30 minute range:
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="text-ink-muted leading-relaxed">
                <strong className="text-ink">Shorter gaps (10–15 min)</strong>{" "}
                work well when one caregiver is handling both kids and the older
                child can start their own wind-down (books, pajamas) largely
                independently while the younger one is settled first.
              </li>
              <li className="text-ink-muted leading-relaxed">
                <strong className="text-ink">Longer gaps (25–30+ min)</strong>{" "}
                tend to work better when the younger child needs a longer settle
                (nursing/bottle to sleep, more resistance) and you want the older
                child fully asleep, not mid-routine, before starting the second
                one.
              </li>
            </ul>
          </Section>

          <Section title="Which child goes first — the actual decision factors">
            <p className="text-ink-muted text-sm leading-relaxed mb-4">
              Age isn&apos;t the deciding factor; <strong className="text-ink">tonight&apos;s
              fatigue level</strong> is. A toddler who skipped their nap may need
              to go down before a calmer infant, even if your usual order is the
              reverse. Watch for:
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="text-ink-muted leading-relaxed">
                Rubbing eyes, yawning, or glazing over → closer to the ideal
                window, go first
              </li>
              <li className="text-ink-muted leading-relaxed">
                Wired, hyper, or resisting more than usual → may already be past
                the window and needs settling before it gets worse
              </li>
              <li className="text-ink-muted leading-relaxed">
                Calm and content → can comfortably wait the extra 15–20 minutes
              </li>
            </ul>
          </Section>

          <Section title="What to do with the second child during the first one's settle">
            <ul className="flex flex-col gap-3 text-sm">
              <li className="text-ink-muted leading-relaxed">
                <strong className="text-ink">Solo parenting:</strong> set up a
                short, low-stimulation independent activity (books, quiet toy, not
                a screen right before their own bedtime) in a separate space for
                the duration.
              </li>
              <li className="text-ink-muted leading-relaxed">
                <strong className="text-ink">Two adults available:</strong> split
                the routines entirely — one parent per child — then swap or
                reconvene once both are down.
              </li>
              <li className="text-ink-muted leading-relaxed">
                <strong className="text-ink">Second child resists being
                &quot;left out&quot;:</strong> a short, consistent phrase repeated
                every night (&quot;your turn is right after&quot;) tends to reduce
                protest more than re-explaining the reasoning each time.
              </li>
            </ul>
          </Section>

          <Section title="If they share a room">
            <p className="text-ink-muted text-sm leading-relaxed">
              Staggering gets more complicated when both kids sleep in the same
              space — see the{" "}
              <Link
                href="/gear/crib-and-bassinet-setup-two-babies-one-room"
                className="text-childB underline underline-offset-3 hover:text-ink transition-colors"
              >
                room-sharing sleep guide
              </Link>{" "}
              for the specific approach to settling one child without waking the
              other.
            </p>
          </Section>

          <div className="border-t border-surface2 pt-8 mb-12">
            <h2 className="font-display text-xl text-ink mb-4">FAQ</h2>
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-ink font-medium text-sm mb-1.5">
                  Do I need to stagger every single night, even when both kids seem
                  calm?
                </h3>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Not strictly, but consistency helps more than flexibility here —
                  kids settle faster into a routine they can predict, so staggering
                  even on calm nights tends to pay off over time rather than only
                  doing it on hard nights.
                </p>
              </div>
              <div>
                <h3 className="text-ink font-medium text-sm mb-1.5">
                  What if staggering means the second child&apos;s bedtime keeps
                  creeping later?
                </h3>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Anchor the <em>first</em> child&apos;s bedtime firmly and let the
                  stagger gap flex, rather than letting both bedtimes drift later
                  together — if the second child&apos;s bedtime is consistently
                  more than 45 minutes past their ideal window, shorten the gap
                  rather than starting the first child&apos;s routine earlier.
                </p>
              </div>
              <div>
                <h3 className="text-ink font-medium text-sm mb-1.5">
                  Is it better to always stagger in the same order, or does it need
                  to change nightly?
                </h3>
                <p className="text-ink-muted text-sm leading-relaxed">
                  It genuinely changes based on the day — see the{" "}
                  <Link
                    href="/tools/bedtime-stagger-calculator"
                    className="text-childB underline underline-offset-3 hover:text-ink transition-colors"
                  >
                    bedtime stagger calculator
                  </Link>{" "}
                  for a tonight-specific read rather than defaulting to a fixed
                  household rule.
                </p>
              </div>
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
              Want to track tonight&apos;s order live?
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
    </main>
  );
}