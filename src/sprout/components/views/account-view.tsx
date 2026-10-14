"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Link2,
  Share2,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { DownloadAppCard } from "@/sprout/components/download-app";
import { FamilyMembersCard } from "@/sprout/components/family-members-card";
import { SyncCard } from "@/sprout/components/sync-card";
import { Button } from "@/sprout/components/ui/button";
import { Card } from "@/sprout/components/ui/card";
import { Field } from "@/sprout/components/ui/label";
import { Input } from "@/sprout/components/ui/input";
import { useData } from "@/sprout/hooks/use-data";
import { useSync } from "@/sprout/hooks/use-sync";
import {
  inviteUrl,
  joinInvite,
  mintInvite,
} from "@/sprout/lib/invite";
import { decodeInvite, extractInviteCode, isSignedInviteCode } from "@/sprout/lib/share";
import { setActiveHousehold } from "@/lib/household-preference";

export function AccountView() {
  const { baby, babies, adoptBaby, setActiveBaby } = useData();
  const { householdId, signedIn } = useSync();
  const [link, setLink] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinMessage, setJoinMessage] = useState<string | null>(null);
  const [joinOk, setJoinOk] = useState(false);
  const [joining, setJoining] = useState(false);

  const flashCopied = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      flashCopied();
    } catch {
      /* clipboard unavailable */
    }
  };

  const shareLink = async () => {
    if (!link) return;
    const data = {
      title: "Sprout Baby",
      text: `Track ${baby?.name ?? "baby"} together with me on Sprout Baby`,
      url: link,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* dismissed */
      }
      return;
    }
    await copyLink();
  };

  const handleGenerate = async () => {
    if (!baby || generating) return;
    if (!signedIn) {
      setGenerateError("Sign in to invite a caregiver — the invite joins your household.");
      return;
    }
    if (!householdId) {
      setGenerateError("Create or connect a household first in the sync card above.");
      return;
    }
    setGenerating(true);
    setGenerateError(null);
    try {
      const code = await mintInvite({
        householdId,
        babyId: baby.id,
        name: baby.name,
        birthDate: baby.birthDate,
        avatarEmoji: baby.avatarEmoji,
        color: baby.color,
        sex: baby.sex,
      });
      setLink(inviteUrl(code));
    } catch (err) {
      setGenerateError(
        err instanceof Error ? err.message : "Couldn't generate the invite.",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim() || joining) return;
    setJoining(true);
    setJoinMessage(null);
    setJoinOk(false);
    try {
      const code = extractInviteCode(joinCode);
      if (isSignedInviteCode(code)) {
        if (!signedIn) {
          setJoinMessage("Sign in first — joining a family uses your account.");
          return;
        }
        const result = await joinInvite(code);
        await adoptBaby({
          id: result.baby.id,
          name: result.baby.name,
          birthDate: result.baby.birthDate,
          avatarEmoji: result.baby.avatarEmoji,
          color: result.baby.color,
          sex: result.baby.sex ?? undefined,
          householdId: result.householdId,
        });
        setActiveHousehold(result.householdId);
        setJoinOk(true);
        setJoinMessage(
          `Joined ${result.baby.name}'s family — reloading to sync all entries…`,
        );
        setJoinCode("");
        window.setTimeout(() => window.location.reload(), 900);
        return;
      }
      const payload = decodeInvite(code);
      if (!payload) {
        setJoinOk(false);
        setJoinMessage("That link couldn't be read. Paste the full invite link.");
        return;
      }
      const existing = babies.find(
        (b) => b.name === payload.name && b.birthDate === payload.birthDate,
      );
      if (existing) {
        await setActiveBaby(existing.id);
        setJoinOk(true);
        setJoinMessage(`${payload.name} is already here — switched to them.`);
        setJoinCode("");
        return;
      }
      setJoinMessage(
        "That's an older invite that only copies a local profile — it won't sync with the other device. Ask for a fresh invite.",
      );
    } catch (err) {
      setJoinOk(false);
      setJoinMessage(err instanceof Error ? err.message : "Couldn't join.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-3 p-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-2xl">
          {baby?.avatarEmoji ?? "🌱"}
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">
            {baby?.name ?? "Your baby"}
          </p>
          <p className="text-[11px] font-medium text-muted">
            Local profile · stored on this device
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-sage/15 px-2.5 py-1 text-[10px] font-bold text-sage-read">
          <ShieldCheck className="h-3 w-3" />
          Private
        </span>
      </Card>

      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-terracotta/15 text-terracotta-read">
            <Users className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">
              Invite a partner or caregiver
            </p>
            <p className="text-[11px] font-medium text-muted">
              Generate a link — when they join, their device syncs {baby?.name ?? "your baby"}
              &apos;s entries with yours.
            </p>
          </div>
        </div>

        {generateError && (
          <p className="rounded-xl bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
            {generateError}
          </p>
        )}

        {link === null ? (
          <Button
            variant="primary"
            size="md"
            className="w-full"
            disabled={!baby || generating}
            onClick={() => void handleGenerate()}
          >
            <Link2 className="h-4 w-4" />
            {generating ? "Generating…" : "Generate invite link"}
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-2xl bg-sprout-surface-muted px-3 py-2">
              <Link2 className="h-4 w-4 shrink-0 text-muted" />
              <input
                readOnly
                value={link}
                onFocus={(e) => e.currentTarget.select()}
                className="min-w-0 flex-1 bg-transparent text-xs font-medium text-foreground outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="md" onClick={() => void copyLink()}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy link"}
              </Button>
              <Button variant="soft" size="md" onClick={() => void shareLink()}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
            <p className="text-[11px] font-medium text-muted">
              Expires in 7 days. The person pasting it must sign in with their
              own account.
            </p>
          </div>
        )}
      </Card>

      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage/15 text-sage-read">
            <UserPlus className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Join with a code</p>
            <p className="text-[11px] font-medium text-muted">
              Paste an invite link to join a family and share the same baby
              across devices.
            </p>
          </div>
        </div>
        <Field
          label="Invite link"
          error={joinMessage && !joinOk ? joinMessage : undefined}
          hint={joinMessage && joinOk ? joinMessage : undefined}
        >
          <Input
            value={joinCode}
            onChange={(e) => {
              setJoinCode(e.target.value);
              setJoinMessage(null);
              setJoinOk(false);
            }}
            placeholder="https://…/sprout-baby-tracker?invite=…"
          />
        </Field>
        <Button
          variant="soft"
          size="md"
          className="w-full"
          disabled={!joinCode.trim() || joining}
          onClick={() => void handleJoin()}
        >
          <UserPlus className="h-4 w-4" />
          {joining ? "Joining…" : "Join family"}
        </Button>
      </Card>

      <SyncCard />

      <FamilyMembersCard />

      <Card className="flex items-start gap-2.5 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage-read" />
        <p className="text-[11px] font-medium text-muted">
          Invite links are signed and expire after 7 days. When someone joins, they&apos;re
          added to your household and share the same baby — entries sync privately
          through your household and merge field-by-field if two people edit at once.
        </p>
      </Card>

      <DownloadAppCard />
    </div>
  );
}
