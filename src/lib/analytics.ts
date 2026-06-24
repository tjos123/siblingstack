// src/lib/analytics.ts
//
// Same track() API as before — nothing in the app changes. Writes to
// the analytics_events Supabase table instead of Firebase Analytics.
// Fire-and-forget; errors are swallowed so analytics never breaks the app.
"use client";

import { supabase } from "@/lib/supabase";

export async function track(
  eventName: string,
  params?: Record<string, string | number | boolean>
): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from("analytics_events").insert({
      event_name: eventName,
      params: params ?? null,
      user_id: session?.user?.id ?? null,
    });
  } catch {
    // Analytics must never break the app.
  }
}
