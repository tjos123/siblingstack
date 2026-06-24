"use client";

import { useState } from "react";
import { startCheckout } from "@/lib/billing";
import { track } from "@/lib/analytics";

export default function UpgradeCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);
    track("upgrade_clicked");
    try {
      await startCheckout();
    } catch (err) {
      setError("Couldn't start checkout — try again in a moment.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface rounded-md p-4 border border-childA/30">
      <h3 className="font-display text-base text-ink mb-1">Sibling Stack Premium</h3>
      <ul className="text-ink-muted text-sm mt-2 mb-3 flex flex-col gap-1">
        <li>• Trends — see whether overlap is growing or shrinking over time</li>
        <li>• Predictions — likely tomorrow's overlap, based on both kids' real patterns</li>
        <li>• Export a visit-ready PDF summary for the pediatrician</li>
        <li>• Invite a co-parent or caregiver to sync schedules</li>
      </ul>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="bg-childA text-bg text-sm font-medium rounded-md py-2 px-4 disabled:opacity-50"
      >
        {loading ? "Redirecting…" : "Upgrade"}
      </button>
      {error && <p className="text-conflict text-xs mt-2">{error}</p>}
    </div>
  );
}
