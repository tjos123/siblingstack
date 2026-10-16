"use client";

import { useRef, useState } from "react";
import {
  ChevronRight,
  Download,
  RefreshCw,
  Sparkles,
  Trash,
  Upload,
  Wrench,
} from "lucide-react";
import { Button } from "@/sprout/components/ui/button";
import { Field } from "@/sprout/components/ui/label";
import { Input } from "@/sprout/components/ui/input";
import { Segmented } from "@/sprout/components/ui/segmented";
import { Sheet } from "@/sprout/components/ui/sheet";
import { Switch } from "@/sprout/components/ui/switch";
import { useToast } from "@/sprout/components/ui/toast";
import { useData } from "@/sprout/hooks/use-data";
import { useNow } from "@/sprout/hooks/use-now";
import { formatDateShort, isoDay } from "@/sprout/lib/format";
import * as repo from "@/sprout/lib/repo";
import type { AppSettings, Baby, BabySex, Log, ThemeMode, UnitPreferences } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

const EMOJIS = ["🌱", "👶", "🐣", "🦊", "🐻", "🐰", "🐼", "🦋", "🌸", "⭐", "🍼", "🧸"];

export function SettingsSheet({
  open,
  onClose,
  onOpenTools,
}: {
  open: boolean;
  onClose: () => void;
  onOpenTools: () => void;
}) {
  const {
    baby,
    babies,
    logs,
    theme,
    settings,
    updateBaby,
    setActiveBaby,
    addBaby,
    setUnits,
    updateSettings,
    setTheme,
    loadSampleData,
    wipeAll,
  } = useData();
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const now = useNow(600_000);
  const [busy, setBusy] = useState<string | null>(null);
  const [lastBackupAt, setLastBackupAt] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem("sprout_last_backup");
    } catch {
      return null;
    }
  });

  const oldestLogMs = logs.reduce<number | null>((min, log) => {
    const time = Date.parse(log.startTime);
    return min === null || time < min ? time : min;
  }, null);
  const backupAnchorMs = lastBackupAt
    ? Date.parse(lastBackupAt)
    : (oldestLogMs ?? now);
  const daysSinceBackup = Math.max(
    0,
    Math.floor((now - backupAnchorMs) / 86_400_000),
  );
  const backupNudge = logs.length > 0 && daysSinceBackup >= 14;

  const name = baby?.name ?? "Baby";
  const birthDate = (baby?.birthDate ?? "").slice(0, 10);
  const avatar = baby?.avatarEmoji ?? "🌱";

  const exportBackup = async () => {
    const data = await repo.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `sprout-baby-${isoDay(new Date())}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    const stamped = new Date().toISOString();
    try {
      window.localStorage.setItem("sprout_last_backup", stamped);
    } catch {
      /* ignore */
    }
    setLastBackupAt(stamped);
    toast.show({ message: "Backup exported to your device", duration: 3000 });
  };

  const importBackup = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as {
        logs?: Log[];
        babies?: Baby[];
        settings?: AppSettings[];
      };
      await repo.importData(parsed);
      toast.show({ message: "Backup restored", duration: 3000 });
      onClose();
    } catch {
      toast.show({ message: "That file could not be read", duration: 6000 });
    }
  };

  const run = async (key: string, action: () => Promise<unknown>) => {
    setBusy(key);
    try {
      await action();
    } finally {
      setBusy(null);
    }
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Settings"
      subtitle="Your baby, units & data"
      footer={
        <p className="text-center text-[11px] font-medium text-muted">
          Sprout Baby · Private & offline-first
        </p>
      }
    >
      <div className="space-y-6">
        <section className="space-y-3">
          <SectionLabel>Baby</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {babies.map((b) => {
              const active = baby?.id === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => void setActiveBaby(b.id)}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-1.5 rounded-2xl px-3 text-sm font-bold transition-all active:scale-95",
                    active
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-sprout-surface-muted text-foreground hover:bg-sprout-surface-sunken",
                  )}
                >
                  <span>{b.avatarEmoji}</span>
                  {b.name}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => void addBaby({ name: `Baby ${babies.length + 1}` })}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-2xl border border-dashed border-hairline px-3 text-sm font-bold text-muted transition-colors hover:border-sage hover:text-foreground"
            >
              + Add baby
            </button>
          </div>
          <Field label="Biological sex (for growth charts)">
            <Segmented
              value={baby?.sex ?? "unset"}
              onChange={(v) =>
                void updateBaby({
                  sex: v === "unset" ? undefined : (v as BabySex),
                })
              }
              columns={3}
              options={[
                { value: "unset", label: "Not set" },
                { value: "female", label: "Girl" },
                { value: "male", label: "Boy" },
              ]}
            />
          </Field>
          <div className="flex flex-wrap gap-1.5">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => updateBaby({ avatarEmoji: emoji })}
                className={
                  "flex h-10 w-10 items-center justify-center rounded-2xl text-xl transition-all active:scale-95 " +
                  (avatar === emoji
                    ? "bg-sage/20 ring-2 ring-sage/50"
                    : "bg-sprout-surface-muted hover:bg-sprout-surface-sunken")
                }
              >
                {emoji}
              </button>
            ))}
          </div>
          <Field label="Name">
            <Input
              value={name}
              onChange={(e) => updateBaby({ name: e.target.value })}
              placeholder="Baby's name"
            />
          </Field>
          <Field label="Date of birth">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => updateBaby({ birthDate: e.target.value })}
              className="h-12 w-full rounded-2xl border border-hairline bg-sprout-surface-muted px-4 text-sm font-semibold text-foreground outline-none focus:border-sage focus:bg-sprout-surface focus:ring-2 focus:ring-sage/25"
            />
          </Field>
          <Field label="Default sleep type">
            <Segmented
              value={settings.defaultSleepType}
              onChange={(v) => updateSettings({ defaultSleepType: v })}
              columns={2}
              options={[
                { value: "nap", label: "Nap" },
                { value: "night", label: "Night" },
              ]}
            />
          </Field>
        </section>

        <section className="space-y-3">
          <SectionLabel>Units</SectionLabel>
          <div className="space-y-3">
            <UnitRow
              label="Volume"
              options={[
                { value: "oz", label: "oz" },
                { value: "ml", label: "ml" },
              ]}
              value={settings.units.volume}
              onChange={(v) => setUnits({ volume: v as UnitPreferences["volume"] })}
            />
            <UnitRow
              label="Weight"
              options={[
                { value: "kg", label: "kg" },
                { value: "lb", label: "lb" },
              ]}
              value={settings.units.weight}
              onChange={(v) => setUnits({ weight: v as UnitPreferences["weight"] })}
            />
            <UnitRow
              label="Length"
              options={[
                { value: "cm", label: "cm" },
                { value: "in", label: "in" },
              ]}
              value={settings.units.length}
              onChange={(v) => setUnits({ length: v as UnitPreferences["length"] })}
            />
            <UnitRow
              label="Temperature"
              options={[
                { value: "C", label: "°C" },
                { value: "F", label: "°F" },
              ]}
              value={settings.units.temperature}
              onChange={(v) =>
                setUnits({ temperature: v as UnitPreferences["temperature"] })
              }
            />
          </div>
        </section>

        <section className="space-y-3">
          <SectionLabel>Reminders</SectionLabel>
          <Field label="Feed reminder">
            <Segmented
              value={String(settings.feedReminderMinutes ?? 180)}
              onChange={(v) => updateSettings({ feedReminderMinutes: Number(v) })}
              columns={3}
              options={[
                { value: "120", label: "2 hours" },
                { value: "180", label: "3 hours" },
                { value: "240", label: "4 hours" },
              ]}
            />
          </Field>
        </section>

        <section className="space-y-3">
          <SectionLabel>Appearance</SectionLabel>
          <Field label="Theme">
            <Segmented
              value={theme}
              onChange={(v) => void setTheme(v as ThemeMode)}
              columns={3}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "System" },
              ]}
            />
          </Field>
        </section>

        <section className="space-y-3">
          <SectionLabel>Feedback</SectionLabel>
          <div className="space-y-3 rounded-2xl bg-sprout-surface-muted px-4 py-3">
            <Switch
              checked={settings.haptics}
              onChange={(v) => updateSettings({ haptics: v })}
              label="Haptics"
              description="Gentle vibration feedback on taps"
            />
          </div>
        </section>

        <section className="space-y-3">
          <SectionLabel>Data</SectionLabel>
          <div className="space-y-1.5 rounded-2xl bg-sprout-surface-muted px-4 py-3">
            <p className="text-xs font-bold text-foreground">
              Saved on this device
            </p>
            <p className="text-[11px] font-medium text-muted">
              {logs.length} {logs.length === 1 ? "entry" : "entries"} stored
              locally · works offline
            </p>
            <p className="text-[11px] font-medium text-muted">
              {lastBackupAt
                ? `Last backed up: ${formatDateShort(lastBackupAt)}`
                : "Not backed up yet"}
            </p>
            {backupNudge ? (
              <p className="text-[11px] font-semibold text-ochre-read">
                {lastBackupAt
                  ? `It's been ${daysSinceBackup} days since your last backup — export a fresh one.`
                  : "No backup yet after 14 days — export one to keep your data safe."}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="md" onClick={exportBackup}>
              <Download className="h-4 w-4" />
              Export backup
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Import backup
            </Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importBackup(file);
              e.target.value = "";
            }}
          />
          <Button
            variant="soft"
            size="md"
            className="w-full"
            disabled={busy === "sample"}
            onClick={() =>
              run("sample", async () => {
                if (
                  !window.confirm(
                    "Add a set of sample entries to preview the tracker?",
                  )
                )
                  return;
                await loadSampleData();
                onClose();
              })
            }
          >
            <Sparkles className="h-4 w-4" />
            Load sample data
          </Button>
          <Button
            variant="danger"
            size="md"
            className="w-full"
            disabled={busy === "clear"}
            onClick={() =>
              run("clear", async () => {
                if (!window.confirm("Delete all entries? This cannot be undone."))
                  return;
                await repo.clearAllLogs();
                onClose();
              })
            }
          >
            <Trash className="h-4 w-4" />
            Clear all entries
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="w-full text-rose-read"
            disabled={busy === "wipe"}
            onClick={() =>
              run("wipe", async () => {
                if (
                  !window.confirm(
                    "Reset everything, including your baby profile? This cannot be undone.",
                  )
                )
                  return;
                await wipeAll();
                onClose();
              })
            }
          >
            <RefreshCw className="h-4 w-4" />
            Reset app
          </Button>
        </section>

        <section className="space-y-3">
          <SectionLabel>Tools</SectionLabel>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenTools();
            }}
            className="flex w-full items-center gap-3 rounded-2xl bg-sprout-surface-muted px-4 py-3 text-left transition-colors hover:bg-sprout-surface-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/15 text-sage-read">
              <Wrench className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-foreground">
                Pumped stash, bottle prep &amp; vaccines
              </span>
              <span className="block text-[11px] font-medium text-muted">
                Calculators and the reference schedule
              </span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
          </button>
        </section>
      </div>
    </Sheet>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-bold uppercase tracking-wide text-muted">
      {children}
    </h3>
  );
}

function UnitRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <div className="w-40">
        <Segmented
          size="sm"
          value={value}
          options={options}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
