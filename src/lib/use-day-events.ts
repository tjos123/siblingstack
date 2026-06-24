"use client";

import { useEffect, useState, useCallback } from "react";
import { listEventsInRange } from "@/lib/db/events";
import type { ScheduleEvent } from "@/types/models";

interface DayEventsState {
  events: ScheduleEvent[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const DAY_MS = 86_400_000;

export function useDayEvents(householdId: string | null, dayStart: number): DayEventsState {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!householdId) { setEvents([]); setLoading(false); return; }
    setLoading(true);
    setEvents(await listEventsInRange(householdId, dayStart, dayStart + DAY_MS));
    setLoading(false);
  }, [householdId, dayStart]);

  useEffect(() => { load(); }, [load]);
  return { events, loading, refresh: load };
}
