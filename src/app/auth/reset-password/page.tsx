"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Canonical from "@/components/Canonical";

type Status = "checking" | "ready" | "invalid";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [needsSignOut, setNeedsSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Reset Password — Sibling Stack";
    let active = true;

    const settle = (s: Status) => { if (active) setStatus(s); };

    // Supabase fires PASSWORD_RECOVERY when it picks up the tokens in the URL.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) settle("ready");
    });

    const timer = window.setTimeout(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (!active) return;
        settle(data.session ? "ready" : "invalid");
      });
    }, 1500);

    return () => {
      active = false;
      window.clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNeedsSignOut(false);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      await supabase.auth.signOut();
      router.push("/sign-in?reset=1");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (/already signed in/i.test(message)) {
        setNeedsSignOut(true);
        setError("You're already signed in with a session Supabase can't reset from. Sign out, then open the password reset email link again.");
      } else if (/invalid or expired/i.test(message)) {
        setError("This reset link is invalid or expired. Request a new one below.");
      } else {
        setError(message || "Couldn't update your password.");
      }
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/forgot-password");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <Canonical url="https://www.siblingstack.com/auth/reset-password" />
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-ink mb-1">Sibling Stack</h1>
        <p className="text-ink-muted text-sm mb-8">Set a new password.</p>

        {status === "checking" && (
          <p className="text-ink-muted text-sm">Checking your reset link…</p>
        )}

        {status === "invalid" && (
          <div className="flex flex-col gap-4">
            <p className="text-conflict text-sm">This reset link is invalid or expired.</p>
            <p className="text-ink-muted text-sm">
              Request a new link below, then open it from your email and try again.
            </p>
            <Link href="/forgot-password" className="text-childB underline text-sm">
              Request a new reset link
            </Link>
          </div>
        )}

        {status === "ready" && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-ink-muted mb-1 block">New password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-surface border border-surface2 rounded-md px-3 py-2 pr-16 text-ink outline-none focus:border-childA" />
                <button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-2 flex items-center text-ink-muted hover:text-ink transition-colors">
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-ink-muted mb-1 block">Confirm new password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required minLength={6} value={confirm} onChange={e => setConfirm(e.target.value)}
                  className="w-full bg-surface border border-surface2 rounded-md px-3 py-2 pr-16 text-ink outline-none focus:border-childA" />
                <button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-2 flex items-center text-ink-muted hover:text-ink transition-colors">
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-conflict text-sm">{error}</p>}
            {needsSignOut ? (
              <button type="button" onClick={handleSignOut} disabled={signingOut}
                className="bg-conflict text-bg font-medium rounded-md py-2 mt-2 disabled:opacity-60">
                {signingOut ? "Signing out…" : "Sign out and request a new link"}
              </button>
            ) : (
              <button type="submit" disabled={submitting}
                className="bg-childA text-bg font-medium rounded-md py-2 mt-2 disabled:opacity-60">
                {submitting ? "Updating…" : "Update password"}
              </button>
            )}
          </form>
        )}
      </div>
    </main>
  );
}