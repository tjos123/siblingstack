"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import EmailCaptureForm from "@/components/EmailCaptureForm";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Signed-in users skip the landing page entirely and go straight to the dashboard
  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading, router]);

  if (loading) return null;
  if (user) return null;

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-2xl mx-auto">

        {/* Nav */}
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

        {/* Hero */}
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

        {/* Feature strip */}
        <div className="grid grid-cols-1 gap-5 mb-16 border-t border-surface2 pt-10">
          {[
            {
              label: "Dual-timeline dashboard",
              detail:
                "Both kids on one view. See where sleep and feed windows collide the moment you open the app, not after the chaos starts.",
            },
            {
              label: "Conflict detection",
              detail:
                "Every overlap — flagged. Not just listed, but bridged visually between the two lanes so the pattern is obvious at 3am.",
            },
            {
              label: "Trend reports",
              detail:
                "Is your shared nap window growing or shrinking week over week? The only way to know is to look at more than just today.",
            },
            {
              label: "Predictions",
              detail:
                "Based on both kids' real patterns, not generic advice. Confidence is stated honestly — no false precision.",
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

        {/* Blog CTA */}
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

        {/* Footer */}
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
