"use client";

import { useState } from "react";
import { Check, Pencil, Trash } from "lucide-react";
import { CategoryIcon } from "@/sprout/components/category-icon";
import { Button } from "@/sprout/components/ui/button";
import { Field } from "@/sprout/components/ui/label";
import { Input } from "@/sprout/components/ui/input";
import { Sheet } from "@/sprout/components/ui/sheet";
import { useToast } from "@/sprout/components/ui/toast";
import { useData } from "@/sprout/hooks/use-data";
import { useFamilyMembers } from "@/sprout/hooks/use-family-members";
import { useAuth } from "@/lib/auth-context";
import { CATEGORY_META, TONES } from "@/sprout/lib/categories";
import { formatClock, formatDateLong } from "@/sprout/lib/format";
import { logSummary, logTimeRange, logTitle } from "@/sprout/lib/log-summary";
import type { Log } from "@/sprout/lib/types";
import { formatTemperature } from "@/sprout/lib/units";
import { cn } from "@/sprout/lib/utils";

const WINDOW_MS = 12 * 60 * 60 * 1000;

export function LogDetailSheet({
  log,
  onEdit,
  onClose,
}: {
  log: Log | null;
  onEdit?: (log: Log) => void;
  onClose: () => void;
}) {
  const { logs, baby, settings, removeLog, editLog, editLogDetails } = useData();
  const { user } = useAuth();
  const { members } = useFamilyMembers();
  const toast = useToast();
  const [caregiver, setCaregiver] = useState(log?.details.caregiver ?? "");
  if (!log) return null;

  const myName = members.find((m) => m.userId === user?.id)?.name ?? "";

  // Family names, de-duplicated, plus any custom name already stored on the log.
  const caregiverOptions: string[] = [];
  for (const m of members) {
    if (!caregiverOptions.includes(m.name)) caregiverOptions.push(m.name);
  }
  if (caregiver && !caregiverOptions.includes(caregiver)) {
    caregiverOptions.push(caregiver);
  }

  // Entries made before this existed have no caregiver — attribute them to the
  // person currently looking, without rewriting the stored value until they tap.
  const selectedCaregiver = caregiver || (!log.details.caregiver ? myName : "");

  const meta = CATEGORY_META[log.category];
  const tone = TONES[meta.tone];
  const start = new Date(log.startTime).getTime();
  const related = logs
    .filter((l) => l.id !== log.id && Math.abs(new Date(l.startTime).getTime() - start) <= WINDOW_MS)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 12);
  const temps = logs
    .filter(
      (l) =>
        l.category === "health" &&
        l.healthSubtype === "temperature" &&
        typeof l.details.temperatureC === "number",
    )
    .sort((a, b) => b.startTime.localeCompare(a.startTime))
    .slice(0, 12);

  const saveCaregiver = (value: string) => {
    setCaregiver(value);
    void editLogDetails(log.id, { caregiver: value || undefined });
  };

  const handleDelete = () => {
    void removeLog(log.id);
    onClose();
    toast.show({
      message: "Entry deleted",
      actionLabel: "Undo",
      duration: 6000,
      onAction: () => void editLog(log.id, { deleted: false }),
    });
  };

  return (
    <Sheet
      open
      onClose={onClose}
      icon={
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl",
            tone.iconWrap,
          )}
        >
          <CategoryIcon category={log.category} className="h-5 w-5" />
        </span>
      }
      title={logTitle(log, baby ?? undefined)}
      subtitle={logTimeRange(log) ?? formatClock(log.startTime)}
      footer={
        <div className="flex gap-2">
          {onEdit ? (
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={() => onEdit(log)}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          ) : null}
          <Button
            variant="danger"
            size="md"
            className={onEdit ? "flex-1" : "w-full"}
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-3xl bg-sprout-surface-muted px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
            Details
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {logSummary(log, settings.units)}
          </p>
          <p className="tabular mt-1 text-xs font-medium text-muted">
            {formatDateLong(log.startTime)} · {formatClock(log.startTime)}
          </p>
          {log.details.notes ? (
            <p className="mt-2 rounded-2xl bg-sprout-surface px-3 py-2 text-xs font-medium text-foreground/80">
              {log.details.notes as string}
            </p>
          ) : null}
        </div>

        <Field label="Logged by">
          <div className="flex flex-wrap gap-1.5">
            {caregiverOptions.map((name) => {
              const active = selectedCaregiver === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => saveCaregiver(active ? "" : name)}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-1 rounded-2xl px-3 text-xs font-bold transition-all active:scale-95",
                    active
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-sprout-surface-muted text-foreground hover:bg-sprout-surface-sunken",
                  )}
                >
                  {active ? <Check className="h-3 w-3" /> : null}
                  {name}
                </button>
              );
            })}
            <Input
              className="h-11 min-w-32 flex-1 rounded-2xl text-xs"
              placeholder="Custom name…"
              value={caregiver}
              onChange={(e) => saveCaregiver(e.target.value)}
            />
          </div>
        </Field>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">
            Around this time
          </p>
          {related.length === 0 ? (
            <p className="rounded-2xl bg-sprout-surface-muted px-4 py-3 text-xs font-medium text-muted">
              No other entries within 12 hours of this moment.
            </p>
          ) : (
            <div className="space-y-1.5">
              {related.map((other) => {
                const otherMeta = CATEGORY_META[other.category];
                const otherTone = TONES[otherMeta.tone];
                return (
                  <div key={other.id} className="flex items-center gap-2.5 rounded-2xl bg-sprout-surface-muted px-3 py-2">
                    <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", otherTone.iconWrap)}>
                      <CategoryIcon category={other.category} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-foreground">
                        {logTitle(other, baby ?? undefined)}
                      </span>
                      <span className="block truncate text-[11px] font-medium text-muted">
                        {logSummary(other, settings.units)}
                      </span>
                    </span>
                    <span className="tabular shrink-0 text-[11px] font-bold text-muted">
                      {formatClock(other.startTime)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {temps.length > 0 ? (
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">
              Recent temperatures
            </p>
            <div className="flex flex-wrap gap-1.5">
              {temps.map((t) => {
                const c = t.details.temperatureC as number;
                const fever = c >= 38;
                return (
                  <span
                    key={t.id}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
                      fever ? "bg-rose/15 text-rose-read" : "bg-sage/15 text-sage-read",
                    )}
                  >
                    {formatTemperature(c, settings.units.temperature)}
                    <span className="font-semibold opacity-70">
                      {formatClock(t.startTime)}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </Sheet>
  );
}