"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, Check, Cloud, CloudOff, RefreshCw } from "lucide-react";
import { Button, buttonVariants } from "@/sprout/components/ui/button";
import { Card } from "@/sprout/components/ui/card";
import { Input } from "@/sprout/components/ui/input";
import { useSync } from "@/sprout/hooks/use-sync";
import { describeSyncError } from "@/sprout/lib/sync-error";
import { cn } from "@/sprout/lib/utils";

function statusLabel(status: string, signedIn: boolean): string {
  switch (status) {
    case "signed-out":
      return "Stored on this device only";
    case "no-household":
      return "No household yet";
    case "syncing":
      return "Syncing changes…";
    case "synced":
      return "Up to date";
    case "offline":
      return "Offline — changes saved locally";
    case "error":
      return "Sync needs attention";
    default:
      return "Waiting to sync";
  }
}

function formatTime(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function SyncCard() {
  const { status, pending, lastSyncedAt, error, signedIn, requestSync, createHousehold } =
    useSync();
  const [householdName, setHouseholdName] = useState("Our household");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const syncing = status === "syncing";

  async function handleCreate() {
    setCreating(true);
    setCreateError(null);
    try {
      await createHousehold(householdName);
    } catch (e) {
      setCreateError(describeSyncError(e));
    } finally {
      setCreating(false);
    }
  }
  const tone =
    status === "synced"
      ? "text-sage-read"
      : status === "error"
        ? "text-terracotta-read"
        : "text-muted";
  const Icon =
    status === "error"
      ? AlertTriangle
      : status === "offline"
        ? CloudOff
        : status === "synced"
          ? Check
          : Cloud;

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl bg-sage/15",
            tone,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">
            {signedIn ? "Cloud sync" : "Sync across devices"}
          </p>
          <p className={cn("text-[11px] font-medium", tone)}>
            {statusLabel(status, signedIn)}
            {pending > 0
              ? ` · ${pending} change${pending === 1 ? "" : "s"} pending`
              : ""}
            {status === "synced" && lastSyncedAt
              ? ` · ${formatTime(lastSyncedAt)}`
              : ""}
          </p>
        </div>
      </div>

      {status === "error" && error ? (
        <p className="text-[11px] font-medium text-terracotta-read">{error}</p>
      ) : null}

      {!signedIn ? (
        <Link
          href="/sign-in?next=/sprout-baby-tracker"
          className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full")}
        >
          Sign in to sync
        </Link>
      ) : status === "no-household" ? (
        <div className="space-y-2">
          <Input
            value={householdName}
            onChange={(e) => {
              setHouseholdName(e.target.value);
              setCreateError(null);
            }}
            placeholder="Household name"
          />
          <Button
            variant="primary"
            size="md"
            className="w-full"
            disabled={creating}
            onClick={() => void handleCreate()}
          >
            {creating ? "Creating…" : "Create household & sync"}
          </Button>
          {createError ? (
            <p className="text-[11px] font-medium text-terracotta-read">{createError}</p>
          ) : null}
        </div>
      ) : (
        <Button
          variant="soft"
          size="md"
          className="w-full"
          disabled={syncing}
          onClick={() => requestSync()}
        >
          <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
          {syncing ? "Syncing…" : "Sync now"}
        </Button>
      )}

      <p className="text-[11px] font-medium text-muted">
        {signedIn
          ? "Everyone in your household sees new logs on their phone within seconds."
          : "Sign in to share logs live with a partner or caregiver. Your entries stay private until you do."}
      </p>
    </Card>
  );
}
