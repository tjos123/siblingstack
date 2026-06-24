// src/lib/db/events.ts
//
// Converts between Postgres timestamptz strings (what Supabase stores)
// and epoch ms numbers (what conflicts.ts / trends.ts work with).
// The rest of the app never sees raw ISO strings — the boundary is here.

import { supabase } from "@/lib/supabase";
import type { EventType, ScheduleEvent } from "@/types/models";

function rowToEvent(row: any): ScheduleEvent {
  return {
    id: row.id,
    householdId: row.household_id,
    childId: row.child_id,
    type: row.type as EventType,
    startTime: new Date(row.start_time).getTime(),
    endTime: row.end_time ? new Date(row.end_time).getTime() : null,
    notes: row.notes ?? undefined,
    createdBy: row.created_by,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function logEvent(
  householdId: string,
  data: {
    childId: string;
    type: EventType;
    startTime: number;
    endTime?: number | null;
    notes?: string;
    createdBy: string;
  }
): Promise<string> {
  const { data: row, error } = await supabase
    .from("events")
    .insert({
      household_id: householdId,
      child_id: data.childId,
      type: data.type,
      start_time: new Date(data.startTime).toISOString(),
      end_time: data.endTime ? new Date(data.endTime).toISOString() : null,
      notes: data.notes ?? null,
      created_by: data.createdBy,
    })
    .select("id")
    .single();

  if (error || !row) throw error ?? new Error("Failed to log event");
  return row.id;
}

export async function closeOpenEvent(
  householdId: string,
  eventId: string,
  endTime: number
): Promise<void> {
  const { error } = await supabase
    .from("events")
    .update({ end_time: new Date(endTime).toISOString() })
    .eq("id", eventId)
    .eq("household_id", householdId);
  if (error) throw error;
}

export async function updateEvent(
  householdId: string,
  eventId: string,
  updates: Partial<{
    type: EventType;
    startTime: number;
    endTime: number | null;
    notes: string;
  }>
): Promise<void> {
  const payload: Record<string, any> = {};
  if (updates.type !== undefined) payload.type = updates.type;
  if (updates.startTime !== undefined)
    payload.start_time = new Date(updates.startTime).toISOString();
  if (updates.endTime !== undefined)
    payload.end_time = updates.endTime
      ? new Date(updates.endTime).toISOString()
      : null;
  if (updates.notes !== undefined) payload.notes = updates.notes;

  const { error } = await supabase
    .from("events")
    .update(payload)
    .eq("id", eventId)
    .eq("household_id", householdId);
  if (error) throw error;
}

export async function deleteEvent(
  householdId: string,
  eventId: string
): Promise<void> {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("household_id", householdId);
  if (error) throw error;
}

export async function listEventsInRange(
  householdId: string,
  startTime: number,
  endTime: number
): Promise<ScheduleEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("household_id", householdId)
    .gte("start_time", new Date(startTime).toISOString())
    .lte("start_time", new Date(endTime).toISOString())
    .order("start_time", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(rowToEvent);
}
