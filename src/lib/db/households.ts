// src/lib/db/households.ts
import { supabase } from "@/lib/supabase";
import type { Household } from "@/types/models";

export async function createHousehold(
  ownerId: string,
  name: string
): Promise<string> {
  // Create the household
  const { data: household, error: hErr } = await supabase
    .from("households")
    .insert({ name, owner_id: ownerId })
    .select("id")
    .single();

  if (hErr || !household) throw hErr ?? new Error("Failed to create household");

  // Add the owner as the first caregiver
  const { error: cErr } = await supabase
    .from("household_caregivers")
    .insert({ household_id: household.id, user_id: ownerId });

  if (cErr) throw cErr;

  return household.id;
}

export async function getHousehold(
  householdId: string
): Promise<Household | null> {
  const { data, error } = await supabase
    .from("households")
    .select(`
      id, name, owner_id, created_at,
      household_caregivers (user_id)
    `)
    .eq("id", householdId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    ownerId: data.owner_id,
    caregiverIds: (data.household_caregivers as any[]).map(
      (r: { user_id: string }) => r.user_id
    ),
    createdAt: new Date(data.created_at).getTime(),
  };
}

// Invite an existing user by uid — only called from the server-side
// API route which uses the service-role client.
export async function addCaregiver(
  householdId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("household_caregivers")
    .insert({ household_id: householdId, user_id: userId });
  if (error) throw error;
}
