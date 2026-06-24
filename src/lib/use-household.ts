"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { getUserProfile } from "@/lib/db/users";
import { listChildren } from "@/lib/db/children";
import type { Child } from "@/types/models";

interface HouseholdState {
  loading: boolean;
  householdId: string | null;
  children: Child[];
  premiumStatus: "free" | "premium";
  refresh: () => Promise<void>;
}

export function useHousehold(): HouseholdState {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [premiumStatus, setPremiumStatus] = useState<"free" | "premium">("free");

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const profile = await getUserProfile(user.id);
    const firstHouseholdId = profile?.householdIds?.[0] ?? null;
    setHouseholdId(firstHouseholdId);
    setPremiumStatus(profile?.premiumStatus === "premium" ? "premium" : "free");
    if (firstHouseholdId) {
      setChildren(await listChildren(firstHouseholdId));
    } else {
      setChildren([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  return { loading, householdId, children, premiumStatus, refresh: load };
}
