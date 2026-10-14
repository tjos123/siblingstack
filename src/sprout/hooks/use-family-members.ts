"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSync } from "@/sprout/hooks/use-sync";

export interface FamilyMember {
  userId: string;
  name: string;
  role: "admin" | "caregiver";
}

interface Loaded {
  key: string;
  members: FamilyMember[];
  error: string | null;
}

// Members of the current household (for the Family box and the "Logged by"
// picker). Fetched through the members API because the users table's RLS hides
// other people's rows from a plain client query.
export function useFamilyMembers() {
  const { householdId, signedIn } = useSync();
  const [reloadKey, setReloadKey] = useState(0);
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  const key = householdId ? `${householdId}:${reloadKey}` : null;

  useEffect(() => {
    if (!signedIn || !householdId || !key) return;
    let cancelled = false;
    void (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;
        const res = await fetch(
          `/api/sprout/household/members?householdId=${encodeURIComponent(householdId)}`,
          { headers: { Authorization: `Bearer ${session.access_token}` } },
        );
        const body = (await res.json().catch(() => null)) as
          | { members?: FamilyMember[]; error?: string }
          | null;
        if (cancelled) return;
        if (!res.ok) {
          setLoaded({
            key,
            members: [],
            error: body?.error ?? "Couldn't load family members.",
          });
          return;
        }
        setLoaded({ key, members: body?.members ?? [], error: null });
      } catch {
        if (!cancelled) {
          setLoaded({ key, members: [], error: "Couldn't load family members." });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [signedIn, householdId, key]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const current = key && loaded && loaded.key === key ? loaded : null;
  const loading = signedIn && !!householdId && current === null;

  return {
    members: current?.members ?? [],
    loading,
    error: current?.error ?? null,
    signedIn,
    householdId,
    reload,
  };
}
