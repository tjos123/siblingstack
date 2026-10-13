"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { track } from "@/lib/analytics";
import Canonical from "@/components/Canonical";

function safeNext(): string {
  if (typeof window === "undefined") return "/app";
  const value = new URLSearchParams(window.location.search).get("next");
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/app";
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { document.title = "Sign In — Sibling Stack"; }, []);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("reset") === "1") {
      setInfo("Password updated. Sign in with your new password.");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      track("login", { method: "email" });
      router.push(safeNext());
    } catch {
      setError("Couldn't sign in with those details.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <Canonical url="https://www.siblingstack.com/sign-in" />
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-ink mb-1">Sibling Stack</h1>
        <p className="text-ink-muted text-sm mb-8">Welcome back.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-ink-muted mb-1 block">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface border border-surface2 rounded-md px-3 py-2 text-ink outline-none focus:border-childA" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-ink-muted block">Password</label>
              <Link href="/forgot-password" className="text-xs text-childB hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
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
          {info && <p className="text-childB text-sm">{info}</p>}
          <button type="submit" disabled={submitting}
            className="bg-childA text-bg font-medium rounded-md py-2 mt-2 disabled:opacity-60">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-ink-muted text-sm mt-6">
          New here?{" "}
          <Link href="/sign-up" className="text-childB underline">Create an account</Link>
        </p>

        <Link href="/" className="block text-ink-muted hover:text-ink text-sm mt-8 text-center transition-colors">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
