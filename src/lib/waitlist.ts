// src/lib/waitlist.ts
// Points at the Next.js API route — no external function URL needed now.
export async function joinWaitlist(email: string, source: string): Promise<void> {
  const res = await fetch("/api/waitlist/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Couldn't join the waitlist right now.");
  }
}
