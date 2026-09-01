import type { ReactNode } from "react";
import Link from "next/link";
import AuthRedirect from "./AuthRedirect";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Sibling Stack",
  description:
    "Track both kids' sleep and feed windows on one timeline. Spot schedule conflicts before they catch you. Built for two kids close in age.",
  alternates: { canonical: "https://www.siblingstack.com" },
  openGraph: {
    title: "Sibling Stack",
    description:
      "Track both kids' sleep and feed windows on one timeline. Spot schedule conflicts before they catch you. Built for two kids close in age.",
    url: "https://www.siblingstack.com",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <AuthRedirect />
      <SiteHeader />
      <main className="min-h-screen px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-mono text-childA uppercase tracking-widest mb-4">
              Free — no card required
            </p>
            <h1 className="font-display text-4xl text-ink leading-tight mb-5">
              Two kids.<br />One timeline.<br />Finally.
            </h1>
            <p className="text-ink-muted text-lg leading-relaxed mb-8 max-w-lg">
              Sibling Stack shows both your kids&apos; sleep and feed windows side by
              side — so you can see conflicts before they catch you, not after.
              Built for the specific chaos of two kids close enough in age that
              their schedules actually overlap.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                href="/sign-up"
                className="inline-block bg-childA text-bg font-medium rounded-md py-2.5 px-5 text-sm text-center hover:opacity-90 transition-opacity"
              >
                Track two schedules on one dashboard
              </Link>
              <Link
                href="/irish-twins-guide"
                className="inline-block text-childB hover:text-ink border border-surface2 rounded-md py-2.5 px-5 text-sm text-center transition-colors"
              >
                Expecting kids close in age? Read the guide
              </Link>
            </div>
            <p className="text-ink-muted text-xs mt-3">
              Free forever. No card required.
            </p>
          </div>

          <div className="mb-16 border-t border-surface2 pt-10">
            <h2 className="font-display text-xl text-ink mb-6">How it works</h2>
            <div className="flex flex-col gap-5">
              {[
                {
                  step: "1",
                  label: "Add your kids",
                  detail:
                    "Set up a profile for each child with their name and birth date. Sibling Stack works whether they're three months apart or three years apart — the scheduling challenges are real either way.",
                },
                {
                  step: "2",
                  label: "Log as you go",
                  detail:
                    "Tap to record sleep, feeding, and diaper changes throughout the day. Each event is timestamped and color-coded per kid so you can see at a glance who did what and when.",
                },
                {
                  step: "3",
                  label: "Spot conflicts before they hit",
                  detail:
                    "Both timelines appear side by side on one dashboard. When a nap window overlaps with a feeding, the conflict is highlighted visually so you can plan around it instead of getting caught off guard.",
                },
              ].map(({ step, label, detail }) => (
                <div key={step} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-surface2 text-ink-muted text-xs font-mono flex items-center justify-center shrink-0 mt-0.5 border border-surface3">
                    {step}
                  </span>
                  <div>
                    <p className="text-ink font-medium text-sm">{label}</p>
                    <p className="text-ink-muted text-sm mt-0.5 leading-relaxed">
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16 border-t border-surface2 pt-10">
            <h2 className="font-display text-xl text-ink mb-6">Everything in one place</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Dual-timeline dashboard",
                  detail:
                    "Both kids on one view. See where sleep and feed windows collide the moment you open the app, not after the chaos starts.",
                },
                {
                  label: "Conflict detection",
                  detail:
                    "Every overlap is flagged and bridged visually between the two lanes so the pattern is obvious even at 3am.",
                },
                {
                  label: "Trend reports",
                  detail:
                    "Is the shared nap window growing or shrinking week over week? Trend reports surface the change before the schedule breaks.",
                },
                {
                  label: "Predictions",
                  detail:
                    "Based on both kids' real patterns, not generic advice — with honest confidence, never false precision.",
                },
              ].map(({ label, detail }) => (
                <div
                  key={label}
                  className="border border-surface2 rounded-lg p-4 bg-surface/40"
                >
                  <p className="text-ink font-medium text-sm mb-1.5">{label}</p>
                  <p className="text-ink-muted text-sm leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-surface2 pt-10 mb-16">
            <h2 className="font-display text-xl text-ink mb-2">
              Guides, gear, and free tools
            </h2>
            <p className="text-ink-muted text-sm mb-6">
              Pick a lane — schedules, gear, or a free calculator.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/schedules"
                className="block border border-surface2 rounded-lg p-4 bg-surface/40 hover:border-childB transition-colors"
              >
                <span className="text-lg">🍼</span>
                <p className="text-ink font-medium text-sm mt-2 mb-1.5">
                  Schedules &amp; Routines
                </p>
                <p className="text-ink-muted text-sm leading-relaxed">
                  2-under-2, 18-month &amp; newborn, nap sync — shareable schedule
                  templates.
                </p>
              </Link>
              <Link
                href="/blog"
                className="block border border-surface2 rounded-lg p-4 bg-surface/40 hover:border-childB transition-colors"
              >
                <span className="text-lg">🛒</span>
                <p className="text-ink font-medium text-sm mt-2 mb-1.5">
                  Gear &amp; Strollers
                </p>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Double strollers, car seats, carriers, and what you don&apos;t
                  need to buy twice.
                </p>
              </Link>
              <Link
                href="/tools"
                className="block border border-surface2 rounded-lg p-4 bg-surface/40 hover:border-childB transition-colors"
              >
                <span className="text-lg">🧮</span>
                <p className="text-ink font-medium text-sm mt-2 mb-1.5">
                  Free Calculators
                </p>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Wake window, nap sync, and bedtime stagger — free and instant.
                </p>
              </Link>
            </div>
            <Link
              href="/irish-twins-guide"
              className="inline-block mt-6 text-childB hover:text-ink text-sm font-medium"
            >
              Expecting kids close in age? Start with the Irish Twins guide →
            </Link>
          </div>

          <footer className="border-t border-surface2 pt-6 flex flex-wrap gap-4 text-xs text-ink-muted font-mono">
            <Link href="/privacy" className="hover:text-ink">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms of use
            </Link>
            <Link href="/sign-up" className="hover:text-ink">
              Create account
            </Link>
            <Link href="/sign-in" className="hover:text-ink">
              Sign in
            </Link>
            <span>© {new Date().getFullYear()} Sibling Stack</span>
          </footer>
        </div>
      </main>
    </>
  );
}
