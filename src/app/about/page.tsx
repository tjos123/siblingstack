import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "About — Sibling Stack",
  description:
    "Sibling Stack is created by James T. Reilly, father of Irish twins, and written for parents whose kids are close enough in age that everything overlaps at once.",
  alternates: { canonical: "https://www.siblingstack.com/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <SiteHeader />
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-ink-muted text-sm underline">
          ← Sibling Stack
        </Link>

        <h1 className="font-display text-3xl text-ink mt-6 mb-4">About</h1>

        <div className="flex gap-4 items-start rounded-xl p-6 border border-surface2 bg-surface1/60 mb-8">
          <span className="w-12 h-12 rounded-full flex items-center justify-center font-display text-base text-ink shrink-0 border border-surface3 bg-surface1">
            JR
          </span>
          <div>
            <p className="text-sm text-ink font-medium mb-1">James T. Reilly</p>
            <p className="text-sm text-ink-muted">Father of Irish twins · Founder, Sibling Stack</p>
          </div>
        </div>

        <div className="prose-sibling">
          <p>
            Sibling Stack exists because most parenting advice assumes you&apos;re
            managing one baby at a time. If your kids are close enough in age
            that their naps, mealtimes, and gear decisions overlap at once, the
            standard guides stop applying — and most advice sites stop being
            useful.
          </p>

          <p>
            I started Sibling Stack the year our second child arrived, when I
            realized how few resources were built for the specific logistics of a
            two-under-two household: double strollers sized for different stages,
            schedules that give one adult an actual break, subscriptions that
            make financial sense when volume doubles overnight, and the decision
            of what to buy twice and what to hand down.
          </p>

          <p>
            Everything here is written from that position — tested against our
            own kids, kept honest about what works and what doesn&apos;t, and updated
            as they grow. Reviews on this site are independent: affiliate
            relationships never change what we recommend or how we score a
            product.
          </p>

          <h2>What this site covers</h2>
          <ul>
            <li>
              <Link href="/reviews" className="text-childB underline underline-offset-3 hover:text-ink transition-colors">
                In-depth reviews
              </Link>{" "}
              — Lovevery play kits, meal subscriptions, diaper delivery, and gear,
              organized around two kids at different stages.
            </li>
            <li>
              <Link href="/schedules" className="text-childB underline underline-offset-3 hover:text-ink transition-colors">
                Schedules and routines
              </Link>{" "}
              — nap sync, bedtime stagger, and templates built for overlapping
              sleep windows.
            </li>
            <li>
              <Link href="/tools" className="text-childB underline underline-offset-3 hover:text-ink transition-colors">
                Free calculators
              </Link>{" "}
              — wake windows, feeding offsets, and nap-sync planning.
            </li>
          </ul>

          <h2>How reviews are reviewed</h2>
          <p>
            Health-adjacent guides are reviewed by named professionals before
            publication. Every page that needs one shows the reviewer&apos;s name,
            role, and exactly what they checked, so you can weigh the credential
            against the claim.
          </p>
        </div>
      </div>
    </main>
  );
}