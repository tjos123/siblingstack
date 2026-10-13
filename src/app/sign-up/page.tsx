"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { createUserProfile } from "@/lib/db/users";
import { track } from "@/lib/analytics";
import Canonical from "@/components/Canonical";

function passwordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: "", color: "", width: "0%" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: "Weak", color: "bg-conflict", width: "20%" },
    { label: "Fair", color: "bg-conflict", width: "40%" },
    { label: "Good", color: "bg-childA", width: "60%" },
    { label: "Strong", color: "bg-childB", width: "80%" },
    { label: "Very strong", color: "bg-childB", width: "100%" },
  ];
  return levels[Math.min(score, 4)];
}

function safeNext(): string {
  if (typeof window === "undefined") return "/app";
  const value = new URLSearchParams(window.location.search).get("next");
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/app";
}

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { document.title = "Sign Up — Sibling Stack"; }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;
      if (data.user) {
        await createUserProfile(data.user.id, email);
        track("sign_up", { method: "email" });
      }
      router.push(safeNext());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <Canonical url="https://www.siblingstack.com/sign-up" />
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-ink mb-1">Sibling Stack</h1>
        <p className="text-ink-muted text-sm mb-8">Create a free account to get started.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-ink-muted mb-1 block">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface border border-surface2 rounded-md px-3 py-2 text-ink outline-none focus:border-childA" />
          </div>
          <div>
            <label className="text-sm text-ink-muted mb-1 block">Password</label>
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
            {password.length > 0 && (
              <div className="mt-1.5">
                <div className="h-1 bg-surface2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${passwordStrength(password).color}`} style={{ width: passwordStrength(password).width }} />
                </div>
                <p className="text-[11px] text-ink-muted mt-0.5">{passwordStrength(password).label}</p>
              </div>
            )}
          </div>
          {error && <p className="text-conflict text-sm">{error}</p>}
          <button type="submit" disabled={submitting}
            className="bg-childA text-bg font-medium rounded-md py-2 mt-2 disabled:opacity-60">
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-ink-muted text-sm mt-6">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-childB underline">Sign in</Link>
        </p>

        <Link href="/" className="block text-ink-muted hover:text-ink text-sm mt-8 text-center transition-colors">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
