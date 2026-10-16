"use client";

import {
  Activity,
  ChevronDown,
  ChevronUp,
  MoonStar,
  Pill,
  Sparkles,
  Sun,
  Syringe,
  Thermometer,
} from "lucide-react";
import { useState } from "react";
import { CategoryIcon } from "@/sprout/components/category-icon";
import { Badge } from "@/sprout/components/ui/badge";
import { Button } from "@/sprout/components/ui/button";
import { Field, Label } from "@/sprout/components/ui/label";
import { Input, Textarea } from "@/sprout/components/ui/input";
import { Segmented } from "@/sprout/components/ui/segmented";
import { Sheet } from "@/sprout/components/ui/sheet";
import { Stepper } from "@/sprout/components/ui/stepper";
import { Switch } from "@/sprout/components/ui/switch";
import { useToast } from "@/sprout/components/ui/toast";
import { useNow } from "@/sprout/hooks/use-now";
import { useData } from "@/sprout/hooks/use-data";
import { useFamilyMembers } from "@/sprout/hooks/use-family-members";
import { useAuth } from "@/lib/auth-context";
import {
  CATEGORY_META,
  DIAPER_SUBTYPE_LABELS,
  FEED_SUBTYPE_LABELS,
  HEALTH_SUBTYPE_LABELS,
  MILESTONE_PRESET_LABELS,
  ROUTINE_PRESET_LABELS,
  TONES,
} from "@/sprout/lib/categories";
import {
  FEED_AMOUNTS_ML,
  FEED_AMOUNTS_OZ,
  PUMP_AMOUNTS_OZ,
  ROUTINE_MINUTES,
  SLEEP_MINUTES,
  TEMP_QUICK_C,
  WEIGHT_QUICK,
  draftDurationMin,
  draftToNewLog,
  isoToLocalInput,
  localInputToIso,
  setBottleAmount,
  setLength,
  setPumpVolumes,
  setTemperature,
  setWeight,
  validateDraft,
  withDuration,
  type FieldErrors,
  type LogDraft,
} from "@/sprout/lib/forms";
import { haptic } from "@/sprout/lib/haptics";
import { formatDateShort } from "@/sprout/lib/format";
import {
  cmToIn,
  cToF,
  formatLength,
  formatTemperature,
  formatVolume,
  formatWeight,
  fToC,
  kgToLb,
  mlToOz,
  ozToMl,
} from "@/sprout/lib/units";
import type { BreastSide, RoutinePreset } from "@/sprout/lib/types";
import {
  BOTTLE_TYPES,
  FEED_SUBTYPES,
  HEALTH_SUBTYPES,
  MILESTONE_PRESETS,
  ROUTINE_PRESETS,
} from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

const MILESTONE_EMOJIS = ["🌱", "😊", "🦶", "🦷", "👶", "🗣️", "🎉", "💪", "⭐", "🧸", "🍼", "🎈"];

const TIME_AGO_OPTIONS = [
  { label: "Now", minutes: 0 },
  { label: "5m ago", minutes: 5 },
  { label: "15m ago", minutes: 15 },
  { label: "30m ago", minutes: 30 },
  { label: "1h ago", minutes: 60 },
];

export function LogSheet({
  open,
  draft,
  editingId,
  onClose,
}: {
  open: boolean;
  draft: LogDraft | null;
  editingId?: string | null;
  onClose: () => void;
}) {
  if (!open || !draft) return null;
  return (
    <LogForm
      key={`${editingId ?? "new"}:${draft.category}:${draft.startTime}`}
      draft={draft}
      editingId={editingId ?? null}
      onClose={onClose}
    />
  );
}

function LogForm({
  draft,
  editingId,
  onClose,
}: {
  draft: LogDraft;
  editingId?: string | null;
  onClose: () => void;
}) {
  const { settings, setUnits, addLog, saveLogEdit, removeLog, logs } = useData();
  const { user } = useAuth();
  const { members } = useFamilyMembers();
  const toast = useToast();
  const [value, setValue] = useState<LogDraft>(draft);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [volUnit, setVolUnit] = useState(settings.units.volume);
  const [weightUnit, setWeightUnit] = useState(settings.units.weight);
  const [lengthUnit, setLengthUnit] = useState(settings.units.length);
  const [tempUnit, setTempUnit] = useState(settings.units.temperature);

  const meta = CATEGORY_META[value.category];
  const tone = TONES[meta.tone];

  const update = (patch: Partial<LogDraft>) => setValue((prev) => ({ ...prev, ...patch }));
  const updateDetails = (patch: Record<string, unknown>) =>
    setValue((prev) => ({ ...prev, details: { ...prev.details, ...patch } }));

  // "Last: …" context lines for the measurement forms.
  const lastGrowth = logs.find((l) => l.category === "growth");
  const lastHealth = logs.find((l) => l.category === "health");

  const growthHint = lastGrowth
    ? `Last: ${lastGrowth.details.weightKg ? `${formatWeight(lastGrowth.details.weightKg as number, weightUnit)} · ` : ""}${
        lastGrowth.details.heightCm
          ? `${formatLength(lastGrowth.details.heightCm as number, lengthUnit)} · `
          : ""
      }${formatDateShort(lastGrowth.startTime)}`
    : null;

  const healthHint = lastHealth
    ? `Last: ${
        lastHealth.healthSubtype === "temperature" && typeof lastHealth.details.temperatureC === "number"
          ? formatTemperature(lastHealth.details.temperatureC as number, tempUnit)
          : (lastHealth.details.symptoms as string) ||
            (lastHealth.details.vaccineName as string) ||
            (lastHealth.details.medicationName as string) ||
            "logged"
      } · ${formatDateShort(lastHealth.startTime)}`
    : null;

  // Growth and health only become saveable once the required measurement is
  // actually filled in, so the button is disabled instead of erroring later.
  const needsValidInput =
    value.category === "growth" || value.category === "health";
  const blocked = needsValidInput && Object.keys(validateDraft(value)).length > 0;

  const submit = async () => {
    const validation = validateDraft(value);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      haptic([12, 40, 12]);
      return;
    }
    setSaving(true);
    const payload = draftToNewLog(value);
    // Attribute the entry to whoever is logged in unless a caregiver was
    // already set (kept when editing an entry that named someone else).
    const myName = members.find((m) => m.userId === user?.id)?.name;
    if (myName && !payload.details.caregiver) {
      payload.details = { ...payload.details, caregiver: myName };
    }
    if (editingId) {
      await saveLogEdit(editingId, payload);
      haptic(10);
      setSaving(false);
      onClose();
      toast.show({ message: "Entry updated", duration: 3000 });
      return;
    }
    const created = await addLog(payload);
    haptic(10);
    setSaving(false);
    onClose();
    toast.show({
      message: `${meta.label} saved`,
      actionLabel: "Undo",
      duration: 6000,
      onAction: () => {
        void removeLog(created.id);
      },
    });
  };

  return (
    <Sheet
      open
      onClose={onClose}
      subtitle={editingId ? "Update this saved entry" : meta.blurb}
      icon={
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl",
            tone.iconWrap,
          )}
        >
          <CategoryIcon category={value.category} className="h-5 w-5" />
        </span>
      }
      title={editingId ? `Edit ${meta.label.toLowerCase()}` : meta.action}
      footer={
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={saving || blocked}
          onClick={submit}
        >
          <Sparkles className="h-4 w-4" />
          {saving ? "Saving…" : editingId ? "Update entry" : "Save entry"}
        </Button>
      }
    >
      <div className="space-y-5">
        <TimeField value={value} update={update} error={errors.startTime} />

        {value.category === "feed" && (
          <FeedForm
            value={value}
            update={update}
            updateDetails={updateDetails}
            errors={errors}
            volUnit={volUnit}
            setVolUnit={(unit) => {
              setVolUnit(unit);
              void setUnits({ volume: unit });
            }}
          />
        )}

        {value.category === "pump" && (
          <PumpForm
            value={value}
            update={update}
            updateDetails={updateDetails}
            errors={errors}
            volUnit={volUnit}
            setVolUnit={(unit) => {
              setVolUnit(unit);
              void setUnits({ volume: unit });
            }}
          />
        )}

        {value.category === "diaper" && (
          <Field label="Diaper">
            <Segmented
              columns={4}
              value={value.diaperSubtype ?? "wet"}
              onChange={(v) => update({ subtype: v, diaperSubtype: v })}
              options={(["wet", "dirty", "both", "dry"] as const).map((v) => ({
                value: v,
                label: DIAPER_SUBTYPE_LABELS[v],
              }))}
            />
          </Field>
        )}

        {value.category === "sleep" && (
          <SleepForm value={value} update={update} errors={errors} />
        )}

        {value.category === "routine" && (
          <RoutineForm
            value={value}
            update={update}
            updateDetails={updateDetails}
            errors={errors}
          />
        )}

        {value.category === "milestone" && (
          <MilestoneForm
            value={value}
            update={update}
            updateDetails={updateDetails}
            errors={errors}
          />
        )}

        {value.category === "growth" && (
          <GrowthForm
            value={value}
            setValue={setValue}
            errors={errors}
            lastHint={growthHint}
            weightUnit={weightUnit}
            setWeightUnit={(unit) => {
              setWeightUnit(unit);
              void setUnits({ weight: unit });
            }}
            lengthUnit={lengthUnit}
            setLengthUnit={(unit) => {
              setLengthUnit(unit);
              void setUnits({ length: unit });
            }}
          />
        )}

        {value.category === "health" && (
          <HealthForm
            value={value}
            update={update}
            updateDetails={updateDetails}
            errors={errors}
            lastHint={healthHint}
            tempUnit={tempUnit}
            setTempUnit={(unit) => {
              setTempUnit(unit);
              void setUnits({ temperature: unit });
            }}
          />
        )}

        <Field label="Notes">
          <Textarea
            rows={2}
            placeholder="Anything worth remembering…"
            value={(value.details.notes as string) ?? ""}
            onChange={(e) => updateDetails({ notes: e.target.value })}
          />
        </Field>
      </div>
    </Sheet>
  );
}

function TimeField({
  value,
  update,
  error,
}: {
  value: LogDraft;
  update: (patch: Partial<LogDraft>) => void;
  error?: string;
}) {
  const [notice, setNotice] = useState<string | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const now = useNow(60000);
  const maxLocal = isoToLocalInput(new Date().toISOString());

  const minutesAgo = Math.max(
    0,
    Math.round((now - new Date(value.startTime).getTime()) / 60000),
  );
  // The largest chip that is still in the past wins, so the active chip
  // always matches the chosen time.
  const activeChip =
    [...TIME_AGO_OPTIONS].reverse().find((opt) => minutesAgo >= opt.minutes) ??
    TIME_AGO_OPTIONS[0];

  const setStart = (raw: string) => {
    if (!raw) {
      setNotice(null);
      update({ startTime: new Date().toISOString() });
      return;
    }
    const iso = localInputToIso(raw);
    if (new Date(iso).getTime() > Date.now()) {
      // Clamp back to now and force a re-render so the controlled input
      // can never hold a future value.
      haptic([10, 30, 10]);
      setNotice("Future times aren't allowed — snapped back to now.");
      update({ startTime: new Date().toISOString() });
      return;
    }
    setNotice(null);
    update({ startTime: iso });
  };

  return (
    <Field label="When" error={error} hint={error ? undefined : "Defaults to now"}>
      <div className="flex flex-wrap gap-2">
        {TIME_AGO_OPTIONS.map((opt) => {
          const active = opt.label === activeChip.label && !customOpen;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => {
                setNotice(null);
                update({
                  startTime: new Date(Date.now() - opt.minutes * 60000).toISOString(),
                });
              }}
              className={cn(
                "min-h-11 flex-1 rounded-xl px-2 text-xs font-bold transition-all active:scale-95",
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-sprout-surface-muted text-muted hover:bg-sprout-surface-sunken",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setCustomOpen((open) => !open)}
        aria-expanded={customOpen}
        className="mt-2 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-hairline px-3 text-[11px] font-bold text-muted transition-colors hover:text-foreground"
      >
        {customOpen ? (
          <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        Custom time
      </button>

      {customOpen ? (
        <div className="mt-2">
          <input
            type="datetime-local"
            aria-label="Exact date and time"
            max={maxLocal}
            value={isoToLocalInput(value.startTime)}
            onChange={(e) => setStart(e.target.value)}
            className="h-12 w-full rounded-2xl border border-hairline bg-sprout-surface-muted px-4 text-sm font-semibold text-foreground outline-none focus:border-sage focus:bg-sprout-surface"
          />
        </div>
      ) : null}

      {notice ? (
        <p className="mt-1.5 text-[11px] font-semibold text-ochre-read">{notice}</p>
      ) : null}
    </Field>
  );
}

function UnitToggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-xl bg-sprout-surface-muted p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all",
            value === option.value
              ? "bg-primary text-primary-foreground"
              : "text-muted hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function FeedForm({
  value,
  update,
  updateDetails,
  errors,
  volUnit,
  setVolUnit,
}: {
  value: LogDraft;
  update: (patch: Partial<LogDraft>) => void;
  updateDetails: (patch: Record<string, unknown>) => void;
  errors: FieldErrors;
  volUnit: "oz" | "ml";
  setVolUnit: (unit: "oz" | "ml") => void;
}) {
  const subtype = value.feedSubtype ?? "breastfeeding";
  const bottleOz = (value.details.bottleAmountOz as number) ?? 0;
  const minutes = draftDurationMin(value);

  return (
    <div className="space-y-4">
      <Field label="Feeding method">
        <Segmented
          value={subtype}
          onChange={(v) => update({ subtype: v, feedSubtype: v })}
          columns={4}
          size="sm"
          options={FEED_SUBTYPES.map((v) => ({
            value: v,
            label: FEED_SUBTYPE_LABELS[v],
          }))}
        />
      </Field>

      {(subtype === "breastfeeding" || subtype === "combo") && (
        <div className="space-y-3 rounded-2xl bg-sage/8 p-3">
          <div className="flex items-center justify-between">
            <Label className="mb-0">Breastfeeding</Label>
            <span className="text-xs font-bold text-sage-read">{minutes}m</span>
          </div>
          <Segmented
            value={(value.details.breastSide as BreastSide) ?? "left"}
            onChange={(v) => updateDetails({ breastSide: v })}
            columns={3}
            size="sm"
            options={[
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
              { value: "both", label: "Both" },
            ]}
          />
          <Stepper
            value={minutes}
            onChange={(m) => update(withDuration(value, m))}
            min={0}
            max={180}
            step={5}
            unit="min"
            quick={[5, 10, 15, 20]}
          />
          {errors.durationSec ? (
            <p className="text-[11px] font-semibold text-rose-read">
              {errors.durationSec}
            </p>
          ) : null}
        </div>
      )}

      {(subtype === "bottlefeed" || subtype === "combo") && (
        <div className="space-y-3 rounded-2xl bg-ochre/12 p-3">
          <div className="flex items-center justify-between">
            <Label className="mb-0">Bottle volume</Label>
            <UnitToggle
              value={volUnit}
              onChange={setVolUnit}
              options={[
                { value: "oz", label: "oz" },
                { value: "ml", label: "ml" },
              ]}
            />
          </div>
          <Stepper
            value={
              volUnit === "ml" ? Math.round(ozToMl(bottleOz)) : bottleOz
            }
            onChange={(v) =>
              update(setBottleAmount(value, volUnit === "ml" ? mlToOz(v) : v))
            }
            min={0}
            max={volUnit === "ml" ? 500 : 20}
            step={volUnit === "ml" ? 10 : 0.5}
            decimals={volUnit === "ml" ? 0 : 1}
            unit={volUnit}
            editable
            quick={volUnit === "ml" ? FEED_AMOUNTS_ML : FEED_AMOUNTS_OZ}
          />
          {errors.bottleAmountOz ? (
            <p className="text-[11px] font-semibold text-rose-read">
              {errors.bottleAmountOz}
            </p>
          ) : null}
          <Field label="Bottle type">
            <Segmented
              value={value.details.bottleType ?? "formula"}
              onChange={(v) => updateDetails({ bottleType: v })}
              columns={3}
              size="sm"
              options={BOTTLE_TYPES.map((v) => ({
                value: v,
                label: v.charAt(0).toUpperCase() + v.slice(1),
              }))}
            />
          </Field>
          <Field label="Brand / company">
            <Input
              placeholder="e.g. Enfamil, Aptamil, Kendamil"
              value={(value.details.bottleBrand as string) ?? ""}
              onChange={(e) => updateDetails({ bottleBrand: e.target.value })}
            />
          </Field>
        </div>
      )}

      {subtype === "solid" && (
        <Field label="Food">
          <Input
            placeholder="e.g. Avocado purée"
            value={(value.details.food as string) ?? ""}
            onChange={(e) => updateDetails({ food: e.target.value })}
          />
        </Field>
      )}
    </div>
  );
}

function PumpForm({
  value,
  update,
  updateDetails,
  errors,
  volUnit,
  setVolUnit,
}: {
  value: LogDraft;
  update: (patch: Partial<LogDraft>) => void;
  updateDetails: (patch: Record<string, unknown>) => void;
  errors: FieldErrors;
  volUnit: "oz" | "ml";
  setVolUnit: (unit: "oz" | "ml") => void;
}) {
  const leftOz = (value.details.pumpLeftOz as number) ?? 0;
  const rightOz = (value.details.pumpRightOz as number) ?? 0;
  const minutes = draftDurationMin(value);
  const toDisplay = (oz: number) => (volUnit === "ml" ? Math.round(ozToMl(oz)) : oz);
  const toOz = (v: number) => (volUnit === "ml" ? mlToOz(v) : v);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="mb-0">Output volume</Label>
        <UnitToggle
          value={volUnit}
          onChange={setVolUnit}
          options={[
            { value: "oz", label: "oz" },
            { value: "ml", label: "ml" },
          ]}
        />
      </div>
      <Field label="Duration">
        <Stepper
          value={minutes}
          onChange={(m) => update(withDuration(value, m))}
          min={0}
          max={120}
          step={5}
          unit="min"
          quick={[10, 15, 20, 25]}
        />
      </Field>
      <div className="space-y-3 rounded-2xl bg-ochre/12 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">Left</span>
          <span className="text-xs font-semibold text-muted">
            {formatVolume(leftOz, volUnit)}
          </span>
        </div>
        <Stepper
          value={toDisplay(leftOz)}
          onChange={(v) => update(setPumpVolumes(value, "left", toOz(v)))}
          min={0}
          max={volUnit === "ml" ? 500 : 20}
          step={volUnit === "ml" ? 10 : 0.5}
          decimals={volUnit === "ml" ? 0 : 1}
          unit={volUnit}
          quick={PUMP_AMOUNTS_OZ.map((oz) => toDisplay(oz))}
        />
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-foreground">Right</span>
          <span className="text-xs font-semibold text-muted">
            {formatVolume(rightOz, volUnit)}
          </span>
        </div>
        <Stepper
          value={toDisplay(rightOz)}
          onChange={(v) => update(setPumpVolumes(value, "right", toOz(v)))}
          min={0}
          max={volUnit === "ml" ? 500 : 20}
          step={volUnit === "ml" ? 10 : 0.5}
          decimals={volUnit === "ml" ? 0 : 1}
          unit={volUnit}
          quick={PUMP_AMOUNTS_OZ.map((oz) => toDisplay(oz))}
        />
        {errors.pumpLeftOz ? (
          <p className="text-[11px] font-semibold text-rose-read">
            {errors.pumpLeftOz}
          </p>
        ) : null}
      </div>
      <div className="flex items-center justify-between rounded-2xl bg-sprout-surface-muted px-4 py-3">
        <span className="text-sm font-semibold text-foreground">Total</span>
        <span className="tabular text-sm font-bold text-ochre-read">
          {formatVolume(leftOz + rightOz, volUnit)}
        </span>
      </div>
      <Field label="Notes / Observations">
        <Textarea
          rows={2}
          placeholder="Flow, comfort, milk colour…"
          value={(value.details.notes as string) ?? ""}
          onChange={(e) => updateDetails({ notes: e.target.value })}
        />
      </Field>
    </div>
  );
}

function SleepForm({
  value,
  update,
  errors,
}: {
  value: LogDraft;
  update: (patch: Partial<LogDraft>) => void;
  errors: FieldErrors;
}) {
  const minutes = draftDurationMin(value);
  const ongoing = value.endTime === null;
  return (
    <div className="space-y-4">
      <Field label="Sleep type">
        <Segmented
          value={(value.subtype as "nap" | "night") ?? "nap"}
          onChange={(v) => update({ subtype: v })}
          columns={2}
          options={[
            { value: "nap", label: "Nap", icon: <Sun className="h-4 w-4" /> },
            {
              value: "night",
              label: "Night",
              icon: <MoonStar className="h-4 w-4" />,
            },
          ]}
        />
      </Field>
      <Field label="Duration" error={errors.durationMin}>
        <Stepper
          value={minutes}
          onChange={(m) => update(withDuration(value, m))}
          min={0}
          max={16 * 60}
          step={15}
          unit="min"
          quick={SLEEP_MINUTES}
        />
      </Field>
      <div className="rounded-2xl bg-sprout-surface-muted px-4 py-3">
        <Switch
          checked={ongoing}
          onChange={(checked) =>
            update({ endTime: checked ? null : new Date().toISOString() })
          }
          label="Still sleeping"
          description="Leave open to track a live nap"
        />
      </div>
    </div>
  );
}

function RoutineForm({
  value,
  update,
  updateDetails,
  errors,
}: {
  value: LogDraft;
  update: (patch: Partial<LogDraft>) => void;
  updateDetails: (patch: Record<string, unknown>) => void;
  errors: FieldErrors;
}) {
  const isCustom = !ROUTINE_PRESETS.includes(value.subtype as RoutinePreset);
  const minutes = draftDurationMin(value);
  return (
    <div className="space-y-4">
      <Field label="Activity">
        <div className="flex flex-wrap gap-1.5">
          {ROUTINE_PRESETS.map((preset) => {
            const active = value.subtype === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() =>
                  update({
                    subtype: preset,
                    details: { ...value.details, routineName: preset },
                  })
                }
                className={cn(
                  "min-h-10 rounded-2xl px-3 text-xs font-bold transition-all active:scale-95",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-sprout-surface-muted text-foreground hover:bg-sprout-surface-sunken",
                )}
              >
                {ROUTINE_PRESET_LABELS[preset]}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() =>
              update({
                subtype: "custom",
                details: { ...value.details, routineName: "" },
              })
            }
            className={cn(
              "min-h-10 rounded-2xl px-3 text-xs font-bold transition-all active:scale-95",
              isCustom
                ? "bg-primary text-primary-foreground"
                : "bg-sprout-surface-muted text-foreground hover:bg-sprout-surface-sunken",
            )}
          >
            Custom
          </button>
        </div>
      </Field>
      {isCustom ? (
        <Field label="Custom activity" error={errors.routineName}>
          <Input
            placeholder="e.g. Grandma visit"
            value={(value.details.routineName as string) ?? ""}
            onChange={(e) => updateDetails({ routineName: e.target.value })}
          />
        </Field>
      ) : null}
      <Field label="Duration">
        <Stepper
          value={minutes}
          onChange={(m) => update(withDuration(value, m))}
          min={0}
          max={180}
          step={5}
          unit="min"
          quick={ROUTINE_MINUTES}
        />
      </Field>
    </div>
  );
}

function MilestoneForm({
  value,
  update,
  updateDetails,
  errors,
}: {
  value: LogDraft;
  update: (patch: Partial<LogDraft>) => void;
  updateDetails: (patch: Record<string, unknown>) => void;
  errors: FieldErrors;
}) {
  return (
    <div className="space-y-4">
      <Field label="Achievement">
        <div className="flex flex-wrap gap-1.5">
          {MILESTONE_PRESETS.map((preset) => {
            const active = value.subtype === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() =>
                  update({
                    subtype: preset,
                    details: {
                      ...value.details,
                      milestoneTitle: MILESTONE_PRESET_LABELS[preset],
                    },
                  })
                }
                className={cn(
                  "min-h-10 rounded-2xl px-3 text-xs font-bold transition-all active:scale-95",
                  active
                    ? "bg-plum text-primary-foreground"
                    : "bg-sprout-surface-muted text-foreground hover:bg-sprout-surface-sunken",
                )}
              >
                {MILESTONE_PRESET_LABELS[preset]}
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="Title" error={errors.milestoneTitle}>
        <Input
          placeholder="e.g. Rolled over from tummy to back!"
          value={(value.details.milestoneTitle as string) ?? ""}
          onChange={(e) =>
            update({ details: { ...value.details, milestoneTitle: e.target.value } })
          }
        />
      </Field>
      <Field label="Memory">
        <div className="flex flex-wrap gap-1.5">
          {MILESTONE_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => updateDetails({ photo: emoji })}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl text-xl transition-all active:scale-95",
                value.details.photo === emoji
                  ? "bg-plum/20 ring-2 ring-plum/50"
                  : "bg-sprout-surface-muted hover:bg-sprout-surface-sunken",
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function GrowthForm({
  value,
  setValue,
  errors,
  lastHint,
  weightUnit,
  setWeightUnit,
  lengthUnit,
  setLengthUnit,
}: {
  value: LogDraft;
  setValue: (updater: (prev: LogDraft) => LogDraft) => void;
  errors: FieldErrors;
  lastHint: string | null;
  weightUnit: "kg" | "lb";
  setWeightUnit: (unit: "kg" | "lb") => void;
  lengthUnit: "cm" | "in";
  setLengthUnit: (unit: "cm" | "in") => void;
}) {
  const weightKg = (value.details.weightKg as number) ?? 0;
  const heightCm = (value.details.heightCm as number) ?? 0;
  const headCm = (value.details.headCm as number) ?? 0;

  const displayWeight = weightUnit === "lb" ? kgToLb(weightKg) : weightKg;
  const displayHeight = lengthUnit === "in" ? cmToIn(heightCm) : heightCm;
  const displayHead = lengthUnit === "in" ? cmToIn(headCm) : headCm;

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-semibold text-muted">
        {lastHint ?? "Add at least one measurement to save"}
      </p>
      <div className="space-y-3 rounded-2xl bg-moss/10 p-3">
        <div className="flex items-center justify-between">
          <Label className="mb-0">Weight</Label>
          <UnitToggle
            value={weightUnit}
            onChange={setWeightUnit}
            options={[
              { value: "kg", label: "kg" },
              { value: "lb", label: "lb" },
            ]}
          />
        </div>
        <Stepper
          value={Number(displayWeight.toFixed(1))}
          onChange={(v) => setValue((prev) => setWeight(prev, v, weightUnit))}
          min={0}
          max={weightUnit === "lb" ? 40 : 20}
          step={0.1}
          decimals={1}
          unit={weightUnit}
          quick={
            weightUnit === "lb"
              ? WEIGHT_QUICK.map((kg) => Number(kgToLb(kg).toFixed(1)))
              : WEIGHT_QUICK
          }
        />
      </div>

      <div className="space-y-3 rounded-2xl bg-moss/10 p-3">
        <div className="flex items-center justify-between">
          <Label className="mb-0">Length / Height</Label>
          <UnitToggle
            value={lengthUnit}
            onChange={setLengthUnit}
            options={[
              { value: "cm", label: "cm" },
              { value: "in", label: "in" },
            ]}
          />
        </div>
        <Stepper
          value={Math.round(displayHeight * 10) / 10}
          onChange={(v) => setValue((prev) => setLength(prev, "height", v, lengthUnit))}
          min={0}
          max={lengthUnit === "in" ? 40 : 100}
          step={0.5}
          decimals={1}
          unit={lengthUnit}
          quick={lengthUnit === "in" ? [20, 22, 24, 26, 28] : [50, 55, 60, 65, 70]}
        />
      </div>

      <div className="space-y-3 rounded-2xl bg-moss/10 p-3">
        <div className="flex items-center justify-between">
          <Label className="mb-0">Head circumference</Label>
          <span className="text-[11px] font-semibold text-muted">{lengthUnit}</span>
        </div>
        <Stepper
          value={Math.round(displayHead * 10) / 10}
          onChange={(v) => setValue((prev) => setLength(prev, "head", v, lengthUnit))}
          min={0}
          max={lengthUnit === "in" ? 24 : 60}
          step={0.5}
          decimals={1}
          unit={lengthUnit}
          quick={lengthUnit === "in" ? [13, 15, 16, 17, 18] : [34, 36, 38, 40, 42]}
        />
      </div>
      {errors.weightKg ? (
        <p className="text-[11px] font-semibold text-rose-read">{errors.weightKg}</p>
      ) : null}
    </div>
  );
}

function HealthForm({
  value,
  update,
  updateDetails,
  errors,
  lastHint,
  tempUnit,
  setTempUnit,
}: {
  value: LogDraft;
  update: (patch: Partial<LogDraft>) => void;
  updateDetails: (patch: Record<string, unknown>) => void;
  errors: FieldErrors;
  lastHint: string | null;
  tempUnit: "C" | "F";
  setTempUnit: (unit: "C" | "F") => void;
}) {
  const subtype = value.healthSubtype ?? "medical";
  const tempC = (value.details.temperatureC as number) ?? 0;
  const displayTemp = tempUnit === "F" ? cToF(tempC) : tempC;
  const icons: Record<string, React.ReactNode> = {
    medical: <Activity className="h-4 w-4" />,
    vaccine: <Syringe className="h-4 w-4" />,
    temperature: <Thermometer className="h-4 w-4" />,
    medication: <Pill className="h-4 w-4" />,
  };

  return (
    <div className="space-y-4">
      {lastHint ? (
        <p className="text-[11px] font-semibold text-muted">{lastHint}</p>
      ) : null}
      <Field label="Type">
        <Segmented
          value={subtype}
          onChange={(v) => update({ subtype: v, healthSubtype: v })}
          columns={2}
          size="sm"
          options={HEALTH_SUBTYPES.map((v) => ({
            value: v,
            label: HEALTH_SUBTYPE_LABELS[v],
            icon: icons[v],
          }))}
        />
      </Field>

      {subtype === "temperature" && (
        <div className="space-y-3 rounded-2xl bg-rose/10 p-3">
          <div className="flex items-center justify-between">
            <Label className="mb-0">Reading</Label>
            <UnitToggle
              value={tempUnit}
              onChange={setTempUnit}
              options={[
                { value: "C", label: "°C" },
                { value: "F", label: "°F" },
              ]}
            />
          </div>
          <Stepper
            value={Number(displayTemp.toFixed(1))}
            onChange={(v) => update(setTemperature(value, v, tempUnit))}
            min={tempUnit === "F" ? 95 : 35}
            max={tempUnit === "F" ? 108 : 42}
            step={0.1}
            decimals={1}
            unit={`°${tempUnit}`}
            quick={
              tempUnit === "F"
                ? TEMP_QUICK_C.map((c) => Number(cToF(c).toFixed(1)))
                : TEMP_QUICK_C
            }
          />
          {errors.temperatureC ? (
            <p className="text-[11px] font-semibold text-rose-read">
              {errors.temperatureC}
            </p>
          ) : null}
          <div className="flex items-center gap-2">
            <Badge tone={fToC(tempUnit === "F" ? displayTemp : cToF(tempC)) >= 38 ? "danger" : "success"}>
              {fToC(tempUnit === "F" ? displayTemp : cToF(tempC)) >= 38
                ? "Fever range"
                : "Normal range"}
            </Badge>
          </div>
        </div>
      )}

      {subtype === "vaccine" && (
        <Field label="Vaccine name" error={errors.vaccineName}>
          <Input
            placeholder="e.g. 2-Month Immunisations"
            value={(value.details.vaccineName as string) ?? ""}
            onChange={(e) => updateDetails({ vaccineName: e.target.value })}
          />
        </Field>
      )}

      {subtype === "medication" && (
        <div className="space-y-3">
          <Field label="Medication" error={errors.medicationName}>
            <Input
              placeholder="e.g. Infant paracetamol"
              value={(value.details.medicationName as string) ?? ""}
              onChange={(e) => updateDetails({ medicationName: e.target.value })}
            />
          </Field>
          <Field label="Dose">
            <Input
              placeholder="e.g. 2.5 ml"
              value={(value.details.medicationDose as string) ?? ""}
              onChange={(e) => updateDetails({ medicationDose: e.target.value })}
            />
          </Field>
        </div>
      )}

      {subtype === "medical" && (
        <Field label="Symptoms / note">
          <Input
            placeholder="e.g. Mild congestion"
            value={(value.details.symptoms as string) ?? ""}
            onChange={(e) => updateDetails({ symptoms: e.target.value })}
          />
        </Field>
      )}
    </div>
  );
}