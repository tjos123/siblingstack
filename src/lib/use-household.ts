"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { getUserProfile } from "@/lib/db/users";
import { listChildren } from "@/lib/db/children";
import type { Child, PlanTier } from "@/types/models";

interface HouseholdState {
  loading: boolean;
  householdId: string | null;
  children: Child[];
  premiumStatus: "free" | "premium";
  planTier: PlanTier;
  refresh: () => Promise<void>;
}

export function useHousehold(): HouseholdState {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [premiumStatus, setPremiumStatus] = useState<"free" | "premium">("free");
  const [planTier, setPlanTier] = useState<PlanTier>("free");

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const profile = await getUserProfile(user.id);
      const firstHouseholdId = profile?.householdIds?.[0] ?? null;
      setHouseholdId(firstHouseholdId);
      setPremiumStatus(profile?.premiumStatus === "premium" ? "premium" : "free");
      if (firstHouseholdId) {
        const householdData = await getHousehold(firstHouseholdId);
        setPlanTier(householdData?.planTier ?? "free");
        setChildren(await listChildren(firstHouseholdId));
      } else {
        setChildren([]);
        setPlanTier("free");
      }
    } catch {
      setHouseholdId(null);
      setChildren([]);
      setPlanTier("free");
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  return { loading, householdId, children, premiumStatus, planTier, refresh: load };
}

async function getHousehold(householdId: string): Promise<{ planTier: PlanTier } | null> {
  const { data, error } = await supabase
    .from("households")
    .select("plan_tier")
    .eq("id", householdId)
    .single();
  if (error || !data) return null;
  return { planTier: (data.plan_tier as PlanTier) ?? "free" };
}
