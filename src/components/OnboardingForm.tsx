"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createHousehold } from "@/lib/db/households";
import { addChild } from "@/lib/db/children";
import { track } from "@/lib/analytics";

interface Props {
  onDone: () => void;
}

const COLOR_OPTIONS = [
  { label: "Clay", value: "#D98C5F" },
  { label: "Sage", value: "#5FA39A" },
];

export default function OnboardingForm({ onDone }: Props) {
  const { user } = useAuth();
  const [householdName, setHouseholdName] = useState("Our household");
  const [childA, setChildA] = useState({ name: "", birthDate: "" });
  const [childB, setChildB] = useState({ name: "", birthDate: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);

    try {
      const householdId = await createHousehold(user.id, householdName);
      await addChild(householdId, {
        name: childA.name,
        birthDate: childA.birthDate,
        colorTag: COLOR_OPTIONS[0].value,
      });
      await addChild(householdId, {
        name: childB.name,
        birthDate: childB.birthDate,
        colorTag: COLOR_OPTIONS[1].value,
      });
      track("onboarding_completed");
      onDone();
    } catch (err) {
      setError("Something went wrong setting up your household. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl text-ink mb-1">
          Set up your household
        </h1>
        <p className="text-ink-muted text-sm mb-8">
          Add both kids now — you can invite a co-parent later.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="text-sm text-ink-muted mb-1 block">
              Household name
            </label>
            <input
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              className="w-full bg-surface border border-surface2 rounded-md px-3 py-2 text-ink outline-none focus:border-childA"
            />
          </div>

          <div className="border-l-2 border-childA pl-4">
            <p className="text-sm mb-2 text-childA">Older child</p>
            <div className="flex gap-3">
              <input
                placeholder="Name"
                required
                value={childA.name}
                onChange={(e) => setChildA({ ...childA, name: e.target.value })}
                className="flex-1 bg-surface border border-surface2 rounded-md px-3 py-2 text-ink outline-none focus:border-childA"
              />
              <input
                type="date"
                required
                value={childA.birthDate}
                onChange={(e) =>
                  setChildA({ ...childA, birthDate: e.target.value })
                }
                className="bg-surface border border-surface2 rounded-md px-3 py-2 text-ink outline-none focus:border-childA"
              />
            </div>
          </div>

          <div className="border-l-2 border-childB pl-4">
            <p className="text-sm mb-2 text-childB">Younger child</p>
            <div className="flex gap-3">
              <input
                placeholder="Name"
                required
                value={childB.name}
                onChange={(e) => setChildB({ ...childB, name: e.target.value })}
                className="flex-1 bg-surface border border-surface2 rounded-md px-3 py-2 text-ink outline-none focus:border-childA"
              />
              <input
                type="date"
                required
                value={childB.birthDate}
                onChange={(e) =>
                  setChildB({ ...childB, birthDate: e.target.value })
                }
                className="bg-surface border border-surface2 rounded-md px-3 py-2 text-ink outline-none focus:border-childA"
              />
            </div>
          </div>

          {error && <p className="text-conflict text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-childA text-bg font-medium rounded-md py-2 disabled:opacity-60"
          >
            {submitting ? "Setting up…" : "Start tracking"}
          </button>
        </form>
      </div>
    </main>
  );
}
