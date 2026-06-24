"use client";

import { useState } from "react";
import { joinWaitlist } from "@/lib/waitlist";
import { track } from "@/lib/analytics";

interface Props {
  source: string; // e.g. "blog-post-double-stroller" — lets you see which content actually converts
}

export default function EmailCaptureForm({ source }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await joinWaitlist(email, source);
      track("waitlist_joined", { source });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-childB text-sm">
        You're on the list — we'll email you when it's ready.
      </p>
    );
  }

  return (
    <div className="max-w-sm">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-surface border border-surface2 rounded-md px-3 py-2 text-ink text-sm outline-none focus:border-childA"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-childA text-bg text-sm font-medium rounded-md px-4 disabled:opacity-50"
        >
          {status === "sending" ? "Joining…" : "Join waitlist"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-conflict text-xs mt-1">Something went wrong — try again.</p>
      )}
    </div>
  );
}
