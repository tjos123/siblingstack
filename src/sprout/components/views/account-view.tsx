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
import { SyncCard } from "@/sprout/components/sync-card";
import { Button } from "@/sprout/components/ui/button";
import { Card } from "@/sprout/components/ui/card";
import { Field } from "@/sprout/components/ui/label";
import { Input } from "@/sprout/components/ui/input";
import { useData } from "@/sprout/hooks/use-data";
import { buildInviteLink, decodeInvite } from "@/sprout/lib/share";

export function AccountView() {
  const { baby, babies, addBaby, setActiveBaby } = useData();
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinMessage, setJoinMessage] = useState<string | null>(null);
  const [joinOk, setJoinOk] = useState(false);

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

  const handleJoin = async () => {
    const payload = decodeInvite(joinCode);
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
    await addBaby({
      name: payload.name,
      birthDate: payload.birthDate,
      avatarEmoji: payload.avatarEmoji,
      sex: payload.sex,
    });
    setJoinOk(true);
    setJoinMessage(`Added ${payload.name} from the invite.`);
    setJoinCode("");
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
              Generate a link to share {baby?.name ?? "your baby"}&apos;s profile.
            </p>
          </div>
        </div>

        {link === null ? (
          <Button
            variant="primary"
            size="md"
            className="w-full"
            disabled={!baby}
            onClick={() => baby && setLink(buildInviteLink(baby))}
          >
            <Link2 className="h-4 w-4" />
            Generate invite link
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
              Paste an invite link to track another baby on this device.
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
            placeholder="https://…/?invite=…"
          />
        </Field>
        <Button
          variant="soft"
          size="md"
          className="w-full"
          disabled={!joinCode.trim()}
          onClick={() => void handleJoin()}
        >
          <UserPlus className="h-4 w-4" />
          Add baby from invite
        </Button>
      </Card>

      <SyncCard />

      <Card className="flex items-start gap-2.5 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage-read" />
        <p className="text-[11px] font-medium text-muted">
          Links are generated on this device and carry only {baby?.name ?? "your baby"}&apos;s
          profile — never your logged entries. When you sign in, entries sync privately
          through your household and merge field-by-field if two people edit at once.
        </p>
      </Card>

      <DownloadAppCard />
    </div>
  );
}
