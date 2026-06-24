// src/lib/db/children.ts
import { supabase } from "@/lib/supabase";
import type { Child } from "@/types/models";

function rowToChild(row: any): Child {
  return {
    id: row.id,
    householdId: row.household_id,
    name: row.name,
    birthDate: row.birth_date, // already a date string "YYYY-MM-DD" from Postgres
    colorTag: row.color_tag,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function addChild(
  householdId: string,
  data: { name: string; birthDate: string; colorTag: string }
): Promise<string> {
  const { data: row, error } = await supabase
    .from("children")
    .insert({
      household_id: householdId,
      name: data.name,
      birth_date: data.birthDate,
      color_tag: data.colorTag,
    })
    .select("id")
    .single();

  if (error || !row) throw error ?? new Error("Failed to add child");
  return row.id;
}

export async function listChildren(householdId: string): Promise<Child[]> {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("household_id", householdId)
    .order("birth_date", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(rowToChild);
}
