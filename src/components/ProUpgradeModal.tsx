"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { startCheckout } from "@/lib/billing";
import { track } from "@/lib/analytics";
import { PRO_MONTHLY_PRICE_CENTS, PRO_ANNUAL_PRICE_CENTS } from "@/lib/config";

interface Props {
  open: boolean;
  onClose: () => void;
}

const FEATURES = [
  "Real-time sync across devices for Partner & Nanny",
  "Unlimited log history & Pediatrician PDF exports",
  "Smart Golden Overlap prediction engine",
  "Support for 3+ kids & custom tracking tags",
];

export default function ProUpgradeModal({ open, onClose }: Props) {
  const [annual, setAnnual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    track("pro_checkout_initiated", { plan: annual ? "annual" : "monthly" });
    try {
      await startCheckout(annual ? "annual" : "monthly");
      // Success: the Paddle overlay handles the rest; keep the modal
      // closed so a failed load can reopen it.
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Checkout couldn't start — please try again."
      );
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-surface2 rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-muted hover:text-ink transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h2 className="font-display text-xl text-ink mb-1">Upgrade to Sibling Stack Pro</h2>
        <p className="text-ink-muted text-sm mb-5">
          Sync routines in real-time with your partner or nanny &amp; eliminate chaos.
        </p>

        <div className="flex items-center justify-center gap-3 mb-5">
          <span className={`text-sm font-medium transition-colors ${!annual ? "text-ink" : "text-ink-muted"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-11 h-6 rounded-full transition-colors ${annual ? "bg-childA" : "bg-surface2"}`}
            aria-label="Toggle billing period"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-ink transition-transform ${
                annual ? "translate-x-5.5 left-0.5" : "left-0.5"
              }`}
              style={{ transform: annual ? "translateX(22px)" : "translateX(2px)" }}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${annual ? "text-ink" : "text-ink-muted"}`}>
            Annual
          </span>
          <span className="text-childB text-xs font-mono font-bold bg-childB/10 px-2 py-0.5 rounded-full">
            Save 37%
          </span>
        </div>

        <div className="text-center mb-5">
          <span className="font-display text-3xl text-ink">
            ${annual ? (PRO_ANNUAL_PRICE_CENTS / 100 / 12).toFixed(2) : (PRO_MONTHLY_PRICE_CENTS / 100).toFixed(2)}
          </span>
          <span className="text-ink-muted text-sm">/mo</span>
          {annual && (
            <p className="text-ink-muted text-xs mt-1">
              ${PRO_ANNUAL_PRICE_CENTS / 100} billed annually
            </p>
          )}
        </div>

        <ul className="flex flex-col gap-2.5 mb-6">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-ink">
              <Check size={16} className="text-childB mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-childA text-bg font-medium rounded-md py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Redirecting…" : "Start 7-Day Free Trial"}
        </button>

        <p className="text-ink-muted text-xs text-center mt-3">
          Cancel anytime with one click. No questions asked.
        </p>

        {error && <p className="text-conflict text-xs text-center mt-2">{error}</p>}
      </div>
    </div>
  );
}
