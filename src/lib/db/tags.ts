// src/lib/db/tags.ts
import { supabase } from "@/lib/supabase";

export interface CustomTag {
  id: string;
  householdId: string;
  label: string;
  color: string;
}

function rowToTag(row: any): CustomTag {
  return {
    id: row.id,
    householdId: row.household_id,
    label: row.label,
    color: row.color ?? "#F3ECE0",
  };
}

export async function listTags(householdId: string): Promise<CustomTag[]> {
  const { data, error } = await supabase
    .from("custom_tags")
    .select("*")
    .eq("household_id", householdId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(rowToTag);
}

export async function addTag(
  householdId: string,
  label: string,
  color: string
): Promise<void> {
  const { error } = await supabase
    .from("custom_tags")
    .insert({ household_id: householdId, label, color });
  if (error) throw error;
}

export async function removeTag(tagId: string): Promise<void> {
  const { error } = await supabase.from("custom_tags").delete().eq("id", tagId);
  if (error) throw error;
}