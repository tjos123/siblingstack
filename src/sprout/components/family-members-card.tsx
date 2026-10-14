"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Card } from "@/sprout/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useSync } from "@/sprout/hooks/use-sync";
import { cn } from "@/sprout/lib/utils";

interface Member {
  userId: string;
  email: string;
  displayName: string | null;
  role: "admin" | "caregiver";
  isOwner: boolean;
}

interface Loaded {
  householdId: string;
  members: Member[];
  error: string | null;
}

export function FamilyMembersCard() {
  const { user } = useAuth();
  const { householdId, signedIn } = useSync();
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    if (!signedIn || !householdId) return;
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
          | { members?: Member[]; error?: string }
          | null;
        if (cancelled) return;
        if (!res.ok) {
          setLoaded({
            householdId,
            members: [],
            error: body?.error ?? "Couldn't load family members.",
          });
          return;
        }
        setLoaded({ householdId, members: body?.members ?? [], error: null });
      } catch {
        if (!cancelled) {
          setLoaded({
            householdId,
            members: [],
            error: "Couldn't load family members.",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [signedIn, householdId]);

  if (!signedIn) return null;

  // Only trust data fetched for the household we're currently pointed at.
  const current = loaded && loaded.householdId === householdId ? loaded : null;
  const members = current?.members ?? null;
  const error = current?.error ?? null;
  const count = members?.length ?? 0;

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage/15 text-sage-read">
          <Users className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">Family</p>
          <p className="text-[11px] font-medium text-muted">
            {count > 0
              ? `${count} ${count === 1 ? "member" : "members"} sharing this baby`
              : "Everyone with access to this baby"}
          </p>
        </div>
      </div>

      {!householdId ? (
        <p className="text-[11px] font-medium text-muted">
          Join or create a household above to see your family here.
        </p>
      ) : error ? (
        <p className="text-[11px] font-medium text-terracotta-read">{error}</p>
      ) : members === null ? (
        <div className="space-y-2">
          <div className="h-11 animate-pulse rounded-2xl bg-sprout-surface-muted" />
          <div className="h-11 animate-pulse rounded-2xl bg-sprout-surface-muted" />
        </div>
      ) : members.length === 0 ? (
        <p className="text-[11px] font-medium text-muted">
          No one here yet. Invite a partner or caregiver above.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {members.map((m) => {
            const initial = (
              m.displayName?.trim()?.[0] ??
              m.email?.[0] ??
              "?"
            ).toUpperCase();
            const isYou = user?.id === m.userId;
            const label = m.isOwner
              ? "Owner"
              : m.role === "admin"
                ? "Admin"
                : "Caregiver";
            return (
              <li
                key={m.userId}
                className="flex items-center gap-3 rounded-2xl bg-sprout-surface-muted px-3 py-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/20 text-xs font-bold text-sage-read">
                  {initial}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">
                    {m.displayName?.trim() || m.email.split("@")[0] || "Family member"}
                    {isYou ? (
                      <span className="font-medium text-muted"> (you)</span>
                    ) : null}
                  </p>
                  <p className="truncate text-[11px] font-medium text-muted">
                    {m.email || "No email"}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold",
                    m.role === "admin"
                      ? "bg-sage/15 text-sage-read"
                      : "bg-sprout-surface text-muted",
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-[11px] font-medium text-muted">
        Everyone here shares the same baby, so new entries appear on every device.
      </p>
    </Card>
  );
}
