"use client";

import { useState } from "react";
import { inviteCaregiver } from "@/lib/billing";

interface Props {
  householdId: string;
}

export default function InviteCaregiverForm({ householdId }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    try {
      await inviteCaregiver(householdId, email);
      setStatus("done");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Couldn't send that invite."
      );
    }
  }

  return (
    <div className="bg-surface rounded-md p-4">
      <h3 className="font-display text-base text-ink mb-1">Invite a co-caregiver</h3>
      <p className="text-ink-muted text-xs mb-3">
        They'll need a Sibling Stack account already — invite by the email they signed up with.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="co-parent@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-bg border border-surface2 rounded-md px-3 py-2 text-ink text-sm outline-none focus:border-childA"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-childA text-bg text-sm font-medium rounded-md px-3 disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Invite"}
        </button>
      </form>
      {status === "done" && (
        <p className="text-childB text-xs mt-2">Added to your household.</p>
      )}
      {status === "error" && (
        <p className="text-conflict text-xs mt-2">{errorMessage}</p>
      )}
    </div>
  );
}
