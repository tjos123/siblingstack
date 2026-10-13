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
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Reset Password — Sibling Stack";
    let active = true;
    const timer = window.setTimeout(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (active) setStatus(data.session ? "ready" : "invalid");
      });
    }, 1200);
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setStatus(session ? "ready" : "invalid");
    });
    return () => {
      active = false;
      window.clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
      setError(err instanceof Error ? err.message : "Couldn't update your password.");
      setSubmitting(false);
    }
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
            <p className="text-conflict text-sm">This reset link is invalid or has expired.</p>
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
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute inset-y-0 right-2 text-xs text-ink-muted hover:text-ink transition-colors">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-ink-muted mb-1 block">Confirm new password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required minLength={6} value={confirm} onChange={e => setConfirm(e.target.value)}
                  className="w-full bg-surface border border-surface2 rounded-md px-3 py-2 pr-16 text-ink outline-none focus:border-childA" />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute inset-y-0 right-2 text-xs text-ink-muted hover:text-ink transition-colors">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {error && <p className="text-conflict text-sm">{error}</p>}
            <button type="submit" disabled={submitting}
              className="bg-childA text-bg font-medium rounded-md py-2 mt-2 disabled:opacity-60">
              {submitting ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}