"use client";

// src/lib/use-realtime-sync.ts
//
// Subscribes to Supabase Realtime for a household's event table so that
// connected caregiver devices see timeline updates instantly (Pro
// feature). Only active when `enabled` is true — i.e. plan_tier === 'pro'.
// Falls back to a lightweight polling interval as a safety net.

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const POLL_INTERVAL_MS = 10_000;

export function useRealtimeSync(
  householdId: string | null,
  enabled: boolean,
  onEvent: () => void
) {
  const callbackRef = useRef(onEvent);
  callbackRef.current = onEvent;

  useEffect(() => {
    if (!householdId || !enabled) return;

    const channel = supabase
      .channel(`realtime-events-${householdId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `household_id=eq.${householdId}`,
        },
        () => callbackRef.current()
      )
      .subscribe();

    // Safety-net polling in case the realtime socket drops
    const interval = window.setInterval(() => {
      callbackRef.current();
    }, POLL_INTERVAL_MS);

    return () => {
      supabase.removeChannel(channel);
      window.clearInterval(interval);
    };
  }, [householdId, enabled]);
}