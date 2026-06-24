"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { createUserProfile } from "@/lib/db/users";
import { track } from "@/lib/analytics";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
