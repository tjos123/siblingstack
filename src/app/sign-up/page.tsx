"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { createUserProfile } from "@/lib/db/users";
import { track } from "@/lib/analytics";

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

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
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
            <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-surface border border-surface2 rounded-md px-3 py-2 text-ink outline-none focus:border-childA" />
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
      </div>
    </main>
  );
}
