"use client";

import { useRef, useState } from "react";
import {
  Download,
  RefreshCw,
  Sparkles,
  Trash,
  Upload,
} from "lucide-react";
import { Button } from "@/sprout/components/ui/button";
import { Field } from "@/sprout/components/ui/label";
import { Input } from "@/sprout/components/ui/input";
import { Segmented } from "@/sprout/components/ui/segmented";
import { Sheet } from "@/sprout/components/ui/sheet";
import { Switch } from "@/sprout/components/ui/switch";
import { useData } from "@/sprout/hooks/use-data";
import { isoDay } from "@/sprout/lib/format";
import * as repo from "@/sprout/lib/repo";
import { vaccineStatus, type VaccineStatus } from "@/sprout/lib/vaccines";
import type { AppSettings, Baby, BabySex, Log, NewLog, ThemeMode, UnitPreferences } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

const EMOJIS = ["🌱", "👶", "🐣", "🦊", "🐻", "🐰", "🐼", "🦋", "🌸", "⭐", "🍼", "🧸"];

export function SettingsSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
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
    addLog,
    setUnits,
    updateSettings,
    setTheme,
    loadSampleData,
    wipeAll,
  } = useData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [vaxBusy, setVaxBusy] = useState<string | null>(null);

  const stash = settings.stash ?? { fullBottles: 0, ozPerBottle: 4 };
  const vaccines = vaccineStatus(logs, baby);

  const logVaccine = async (name: string) => {
    setVaxBusy(name);
    try {
      const entry: NewLog = {
        category: "health",
        subtype: null,
        healthSubtype: "vaccine",
        startTime: new Date().toISOString(),
        endTime: null,
        details: { vaccineName: name },
      };
      await addLog(entry);
    } finally {
      setVaxBusy(null);
    }
  };

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
      window.alert("Backup restored.");
      onClose();
    } catch {
      window.alert("That file could not be read.");
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
          <SectionLabel>Babies</SectionLabel>
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
        </section>

        <section className="space-y-3">
          <SectionLabel>Baby profile</SectionLabel>
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
          <SectionLabel>Preferences</SectionLabel>
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
          <Field label="Appearance">
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
          <SectionLabel>Pumped milk stash</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Bottles stored">
              <Input
                type="number"
                min={0}
                inputMode="numeric"
                value={String(stash.fullBottles)}
                onChange={(e) =>
                  updateSettings({
                    stash: {
                      ...stash,
                      fullBottles: Math.max(0, Number(e.target.value) || 0),
                    },
                  })
                }
              />
            </Field>
            <Field label="Oz per bottle">
              <Input
                type="number"
                min={0}
                step={0.5}
                inputMode="decimal"
                value={String(stash.ozPerBottle)}
                onChange={(e) =>
                  updateSettings({
                    stash: {
                      ...stash,
                      ozPerBottle: Math.max(0, Number(e.target.value) || 0),
                    },
                  })
                }
              />
            </Field>
          </div>
          <p className="rounded-2xl bg-sprout-surface-muted px-3 py-2 text-xs font-semibold text-foreground">
            ≈ {Math.round(stash.fullBottles * stash.ozPerBottle)} oz available
          </p>
          <BottlePrep />
        </section>

        <section className="space-y-3">
          <SectionLabel>Vaccine tracker</SectionLabel>
          <p className="rounded-2xl bg-ochre/15 px-3 py-2 text-[11px] font-medium text-foreground/80">
            A general reference schedule, shown for guidance only — not medical
            advice. Follow your pediatrician&apos;s plan.
          </p>
          <div className="space-y-1.5">
            {vaccines.map((row) => (
              <div
                key={row.id}
                className="flex items-center gap-2 rounded-2xl bg-sprout-surface-muted px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">
                    {row.name}
                  </p>
                  <p className="text-[11px] font-medium text-muted">
                    from {row.minMonths} mo
                  </p>
                </div>
                <StatusChip status={row.status} />
                {row.status !== "given" ? (
                  <Button
                    size="sm"
                    variant="soft"
                    disabled={vaxBusy === row.name}
                    onClick={() => void logVaccine(row.name)}
                  >
                    Log
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <SectionLabel>Data & backup</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="md" onClick={exportBackup}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Import
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

function BottlePrep() {
  const [feedings, setFeedings] = useState(6);
  const [perBottle, setPerBottle] = useState(4);
  const total = feedings * perBottle;
  const bags = Math.ceil(total / 4);
  return (
    <div className="space-y-2 rounded-2xl border border-hairline px-3 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
        Bottle prep calculator
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Feeds / day">
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            value={String(feedings)}
            onChange={(e) => setFeedings(Math.max(0, Number(e.target.value) || 0))}
          />
        </Field>
        <Field label="Oz per feed">
          <Input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={String(perBottle)}
            onChange={(e) => setPerBottle(Math.max(0, Number(e.target.value) || 0))}
          />
        </Field>
      </div>
      <p className="rounded-2xl bg-sage/15 px-3 py-2 text-xs font-semibold text-sage-read">
        {total} oz / day · ≈ {bags} × 4 oz bags to thaw
      </p>
    </div>
  );
}

function StatusChip({ status }: { status: VaccineStatus }) {
  const map: Record<VaccineStatus, { label: string; className: string }> = {
    given: { label: "Done", className: "bg-sage/15 text-sage-read" },
    due: { label: "Due", className: "bg-ochre/25 text-ochre-read" },
    overdue: { label: "Overdue", className: "bg-rose/15 text-rose-read" },
    upcoming: { label: "Upcoming", className: "bg-sprout-surface text-muted" },
  };
  const { label, className } = map[status];
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold",
        className,
      )}
    >
      {label}
    </span>
  );
}
