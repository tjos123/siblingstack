// src/lib/db/caregivers.ts
import { supabase } from "@/lib/supabase";
import type { CaregiverInvite } from "@/types/models";

export async function listCaregivers(householdId: string): Promise<CaregiverInvite[]> {
  const { data, error } = await supabase
    .from("household_caregivers")
    .select(`
      user_id,
      role,
      household_id,
      users ( id, email, display_name )
    `)
    .eq("household_id", householdId);

  if (error) throw error;

  const { data: household } = await supabase
    .from("households")
    .select("owner_id")
    .eq("id", householdId)
    .single();

  const ownerId = household?.owner_id;

  return (data ?? []).map((row: any) => ({
    userId: row.user_id,
    isOwner: row.user_id === ownerId,
    email: row.users?.email ?? "",
    displayName: row.users?.display_name ?? undefined,
    role: row.user_id === ownerId ? "admin" : (row.role ?? "caregiver"),
  }));
}

export async function updateCaregiverRole(
  householdId: string,
  userId: string,
  role: "admin" | "caregiver"
): Promise<void> {
  const { error } = await supabase
    .from("household_caregivers")
    .update({ role })
    .eq("household_id", householdId)
    .eq("user_id", userId);
  if (error) throw error;
}