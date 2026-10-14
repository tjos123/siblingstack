"use client";

import { useState } from "react";
import { Check, Pencil, Users, X } from "lucide-react";
import { Card } from "@/sprout/components/ui/card";
import { Input } from "@/sprout/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { updateDisplayName } from "@/lib/db/users";
import { useFamilyMembers } from "@/sprout/hooks/use-family-members";
import { cn } from "@/sprout/lib/utils";

export function FamilyMembersCard() {
  const { user } = useAuth();
  const { members, loading, error, signedIn, householdId, reload } = useFamilyMembers();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!signedIn) return null;

  const count = members.length;
  const me = members.find((m) => m.userId === user?.id);

  const startEdit = () => {
    setDraft(me?.name ?? "");
    setSaveError(null);
    setEditing(true);
  };

  const save = async () => {
    if (!user || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateDisplayName(user.id, draft);
      setEditing(false);
      reload();
    } catch {
      setSaveError("Couldn't save your name. Try again.");
    } finally {
      setSaving(false);
    }
  };

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
      ) : loading ? (
        <div className="space-y-2">
          <div className="h-12 animate-pulse rounded-2xl bg-sprout-surface-muted" />
          <div className="h-12 animate-pulse rounded-2xl bg-sprout-surface-muted" />
        </div>
      ) : members.length === 0 ? (
        <p className="text-[11px] font-medium text-muted">
          No one here yet. Invite a partner or caregiver above.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {members.map((m) => {
            const isYou = m.userId === user?.id;
            const initial = (m.name.trim()[0] ?? "?").toUpperCase();

            if (isYou && editing) {
              return (
                <li
                  key={m.userId}
                  className="flex items-center gap-2 rounded-2xl bg-sprout-surface-muted px-3 py-2"
                >
                  <Input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void save();
                      if (e.key === "Escape") setEditing(false);
                    }}
                    placeholder="Your name"
                    className="h-9 flex-1 rounded-2xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => void save()}
                    disabled={saving}
                    aria-label="Save name"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    aria-label="Cancel"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sprout-surface text-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              );
            }

            return (
              <li
                key={m.userId}
                className="flex items-center gap-3 rounded-2xl bg-sprout-surface-muted px-3 py-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/20 text-xs font-bold text-sage-read">
                  {initial}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">{m.name}</p>
                  <p className="text-[11px] font-medium text-muted">
                    {m.role === "admin" ? "Admin" : "Caregiver"}
                  </p>
                </div>
                {isYou ? (
                  <button
                    type="button"
                    onClick={startEdit}
                    aria-label="Edit your name"
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      "bg-sprout-surface text-muted hover:text-foreground",
                    )}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {saveError ? (
        <p className="text-[11px] font-medium text-terracotta-read">{saveError}</p>
      ) : null}

      <p className="text-[11px] font-medium text-muted">
        Names are shared with everyone here. Tap the pencil to rename yourself.
      </p>
    </Card>
  );
}
