"use client";

import { useState } from "react";
import { logEvent, closeOpenEvent } from "@/lib/db/events";
import { useAuth } from "@/lib/auth-context";
import { track } from "@/lib/analytics";
import type { Child, ScheduleEvent } from "@/types/models";

interface Props {
  child: Child;
  events: ScheduleEvent[];
  householdId: string;
  accent: "childA" | "childB";
  onLogged: () => void;
}

const FEED_WINDOW_MS = 15 * 60 * 1000;

export default function QuickLogBar({ child, events, householdId, accent, onLogged }: Props) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  const openSleep = events.find(
    (e) => e.childId === child.id && e.type === "sleep" && e.endTime === null
  );

  async function withBusy(fn: () => Promise<void>) {
    if (!user || busy) return;
    setBusy(true);
    try {
      await fn();
      onLogged();
    } finally {
      setBusy(false);
    }
  }

  const btnBase =
    "flex-1 text-sm rounded-md py-2 px-3 border disabled:opacity-50 transition-colors";
  const accentBorder = accent === "childA" ? "border-childA text-childA" : "border-childB text-childB";

  return (
    <div className="flex gap-2">
      <button
        disabled={busy || !user}
        className={`${btnBase} ${accentBorder}`}
        onClick={() =>
          withBusy(async () => {
            if (!user) return;
            if (openSleep) {
              await closeOpenEvent(householdId, openSleep.id, Date.now());
              track("event_logged", { type: "sleep_end" });
            } else {
              await logEvent(householdId, {
                childId: child.id,
                type: "sleep",
                startTime: Date.now(),
                createdBy: user.id,
              });
              track("event_logged", { type: "sleep_start" });
            }
          })
        }
      >
        {openSleep ? "Wake up" : "Start sleep"}
      </button>

      <button
        disabled={busy || !user}
        className={`${btnBase} ${accentBorder}`}
        onClick={() =>
          withBusy(async () => {
            if (!user) return;
            const now = Date.now();
            await logEvent(householdId, {
              childId: child.id,
              type: "feed",
              startTime: now,
              endTime: now + FEED_WINDOW_MS,
              createdBy: user.id,
            });
            track("event_logged", { type: "feed" });
          })
        }
      >
        Log feed
      </button>

      <button
        disabled={busy || !user}
        className={`${btnBase} ${accentBorder}`}
        onClick={() =>
          withBusy(async () => {
            if (!user) return;
            const now = Date.now();
            await logEvent(householdId, {
              childId: child.id,
              type: "diaper",
              startTime: now,
              endTime: now,
              createdBy: user.id,
            });
            track("event_logged", { type: "diaper" });
          })
        }
      >
        Diaper
      </button>
    </div>
  );
}
