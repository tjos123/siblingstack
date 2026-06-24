// src/lib/db/users.ts
import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types/models";

export async function createUserProfile(
  uid: string,
  email: string
): Promise<void> {
  const { error } = await supabase.from("users").insert({
    id: uid,
    email,
    premium_status: "free",
  });
  if (error) throw error;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      email,
      display_name,
      premium_status,
      stripe_customer_id,
      created_at,
      household_caregivers (household_id)
    `)
    .eq("id", uid)
    .single();

  if (error || !data) return null;

  return {
    uid: data.id,
    email: data.email,
    displayName: data.display_name ?? undefined,
    householdIds: (data.household_caregivers as any[]).map(
      (r: { household_id: string }) => r.household_id
    ),
    premiumStatus: data.premium_status as "free" | "premium",
    stripeCustomerId: data.stripe_customer_id ?? undefined,
    createdAt: new Date(data.created_at).getTime(),
  };
}
