"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/sprout/components/ui/button";
import { Field } from "@/sprout/components/ui/label";
import { Input } from "@/sprout/components/ui/input";
import { useData } from "@/sprout/hooks/use-data";
import { vaccineStatus, type VaccineStatus } from "@/sprout/lib/vaccines";
import type { NewLog } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

export function ToolsView({ onBack }: { onBack: () => void }) {
  const { baby, logs, settings, updateSettings, addLog } = useData();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onBack}
          className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-2xl px-2 text-sm font-bold text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>
        <h1 className="font-serif text-xl font-bold text-foreground">Tools</h1>
      </div>

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
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-bold uppercase tracking-wide text-muted">
      {children}
    </h2>
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
