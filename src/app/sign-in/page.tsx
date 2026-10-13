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
              <button type="button" onClick={() => setShowPassword(s => !s)}
                className="absolute inset-y-0 right-2 text-xs text-ink-muted hover:text-ink transition-colors">
                {showPassword ? "Hide" : "Show"}
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
