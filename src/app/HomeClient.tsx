"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import EmailCaptureForm from "@/components/EmailCaptureForm";

export default function HomeClient() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading, router]);

  if (loading) return null;
  if (user) return null;

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-2xl mx-auto">

        <nav className="flex items-center justify-between mb-20">
          <span className="font-display text-lg text-ink">Sibling Stack</span>
          <div className="flex gap-5 text-sm">
            <Link href="/blog" className="text-ink-muted hover:text-ink">
              Articles
            </Link>
            <Link href="/sign-in" className="text-childA underline">
              Sign in
            </Link>
          </div>
        </nav>

        <div className="mb-14">
          <p className="text-xs font-mono text-childA uppercase tracking-widest mb-4">
            Free — no card required
          </p>
          <h1 className="font-display text-4xl text-ink leading-tight mb-5">
            Two kids.<br />
            One timeline.<br />
            Finally.
          </h1>
          <p className="text-ink-muted text-lg leading-relaxed mb-8 max-w-lg">
            Sibling Stack shows both your kids' sleep and feed windows side by
            side — so you can see conflicts before they catch you, not after.
            Built for the specific chaos of two kids close enough in age that
            their schedules actually overlap.
          </p>
          <div className="flex flex-col gap-3">
            <EmailCaptureForm source="landing-hero" />
            <p className="text-ink-muted text-xs">
              or{" "}
              <Link href="/sign-up" className="text-childB underline">
                create a free account
              </Link>{" "}
              and start tracking now.
            </p>
          </div>
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

        <div className="grid grid-cols-1 gap-5 mb-16 border-t border-surface2 pt-10">
          <h2 className="font-display text-xl text-ink mb-6">Everything in one place</h2>
          {[
            {
              label: "Dual-timeline dashboard",
              detail:
                "Both kids on one view. See where sleep and feed windows collide the moment you open the app, not after the chaos starts. No switching between profiles or juggling separate tabs.",
            },
            {
              label: "Conflict detection",
              detail:
                "Every overlap is flagged and bridged visually between the two lanes so the pattern is obvious at 3am. You see not just that something overlaps, but exactly which events are about to collide.",
            },
            {
              label: "Trend reports",
              detail:
                "Is your shared nap window growing or shrinking week over week? The only way to know is to look at more than just today. Trend reports surface week-over-week changes so you can adapt before the schedule breaks.",
            },
            {
              label: "Predictions",
              detail:
                "Based on both kids' real patterns, not generic advice. Confidence is stated honestly — no false precision. When the prediction says 70%, you know it means 70%, not a guess dressed up as certainty.",
            },
          ].map(({ label, detail }) => (
            <div key={label} className="flex gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-childA mt-2 shrink-0" />
              <div>
                <p className="text-ink font-medium text-sm">{label}</p>
                <p className="text-ink-muted text-sm mt-0.5 leading-relaxed">
                  {detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-surface2 pt-10 mb-16">
          <p className="text-ink-muted text-sm mb-3">
            While you're here — guides written for exactly your situation:
          </p>
          <Link
            href="/blog"
            className="text-childB underline text-sm"
          >
            Browse the articles →
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
  );
}
