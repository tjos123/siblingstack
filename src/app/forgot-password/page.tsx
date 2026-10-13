"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Canonical from "@/components/Canonical";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { document.title = "Forgot Password — Sibling Stack"; }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch {
      setError("Couldn't send a reset link. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <Canonical url="https://www.siblingstack.com/forgot-password" />
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-ink mb-1">Sibling Stack</h1>
        <p className="text-ink-muted text-sm mb-8">Reset your password.</p>

        {sent ? (
          <div className="flex flex-col gap-4">
            <p className="text-childB text-sm">
              If an account exists for {email.trim()}, we&apos;ve sent a password reset link.
            </p>
            <p className="text-ink-muted text-sm">
              Check your inbox and click the link to choose a new password.
            </p>
            <Link href="/sign-in" className="text-ink-muted hover:text-ink text-sm mt-4 text-center transition-colors">
              Back to Sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-ink-muted mb-1 block">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-surface border border-surface2 rounded-md px-3 py-2 text-ink outline-none focus:border-childA" />
            </div>
            {error && <p className="text-conflict text-sm">{error}</p>}
            <button type="submit" disabled={submitting}
              className="bg-childA text-bg font-medium rounded-md py-2 mt-2 disabled:opacity-60">
              {submitting ? "Sending link…" : "Send reset link"}
            </button>
          </form>
        )}

        {!sent && (
          <Link href="/sign-in" className="block text-ink-muted hover:text-ink text-sm mt-6 text-center transition-colors">
            Back to Sign in
          </Link>
        )}
      </div>
    </main>
  );
}