"use client";

import { useState } from "react";
import {
  Droplets,
  Milk,
  Moon,
  Baby,
  Copy,
  Check,
  type LucideIcon,
} from "lucide-react";
import { CategoryIcon } from "@/sprout/components/category-icon";
import { LiveTimers } from "@/sprout/components/live-timers";
import { LogItem } from "@/sprout/components/log-item";
import { QuickLogGrid } from "@/sprout/components/quick-log-grid";
import { VoiceQuickLogButton } from "@/sprout/components/voice-quick-log";
import { Card } from "@/sprout/components/ui/card";
import { useData } from "@/sprout/hooks/use-data";
import { useNow } from "@/sprout/hooks/use-now";
import type { FinishedTimer } from "@/sprout/hooks/use-timers";
import { CATEGORY_META, TONES } from "@/sprout/lib/categories";
import {
  formatClock,
  humanDuration,
  elapsedLabel,
} from "@/sprout/lib/format";
import {
  lastLogByCategory,
  summarizeDay,
} from "@/sprout/lib/stats";
import type { LogDraft } from "@/sprout/lib/forms";
import {
  feedDueInfo,
  growthSpurtSignal,
  handoffSummary,
  intakeOutput,
  wakeWindowInfo,
} from "@/sprout/lib/insights";
import { ageInMonths } from "@/sprout/lib/vaccines";
import type { Category, Log, UnitPreferences } from "@/sprout/lib/types";
import { formatVolume } from "@/sprout/lib/units";
import { cn } from "@/sprout/lib/utils";

export function TrackerView({
  onSelectCategory,
  onFinishedTimer,
  onOpenLog,
  onVoiceDraft,
}: {
  onSelectCategory: (category: Category) => void;
  onFinishedTimer: (finished: FinishedTimer) => void;
  onOpenLog?: (log: Log) => void;
  onVoiceDraft?: (draft: LogDraft) => void;
}) {
  const { logs, baby, settings } = useData();
  const now = useNow(30000);
  const nowDate = new Date(now);
  const summary = summarizeDay(logs, nowDate);
  const units: UnitPreferences = settings.units;
  const recent = logs.slice(0, 4);
  const [copied, setCopied] = useState(false);

  const lastFeed = lastLogByCategory(logs, "feed");
  const lastDiaper = lastLogByCategory(logs, "diaper");
  const lastSleep = lastLogByCategory(logs, "sleep");

  const feedDue = feedDueInfo(logs, now, settings.feedReminderMinutes ?? 180);
  const wake = wakeWindowInfo(logs, baby ? ageInMonths(baby.birthDate, nowDate) : 0, nowDate);
  const spurt = growthSpurtSignal(logs, nowDate);
  const io = intakeOutput(logs, nowDate);

  const copyHandoff = async () => {
    const text = handoffSummary(logs, baby, units, nowDate);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between px-4 pt-4">
          <div>
            <p className="font-serif text-base font-bold text-foreground">
              Today at a glance
            </p>
            <p className="text-[11px] font-medium text-muted">
              {baby ? `${baby.avatarEmoji} ${baby.name}` : "Your little sprout"}
            </p>
          </div>
          <span className="rounded-full bg-sage/15 px-2.5 py-1 text-[10px] font-bold text-sage-read">
            {formatClock(now)}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 p-4">
          <StatTile
            icon={Milk}
            label="Feeds"
            value={String(summary.feeds)}
            tone="sage"
          />
          <StatTile
            icon={Moon}
            label="Sleep"
            value={humanDuration(summary.sleepSec)}
            tone="plum"
          />
          <StatTile
            icon={Baby}
            label="Diapers"
            value={String(summary.diapers)}
            tone="sky"
          />
          <StatTile
            icon={Droplets}
            label="Pumped"
            value={summary.pumpOz > 0 ? formatVolume(summary.pumpOz, units.volume) : "—"}
            tone="ochre"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-hairline px-4 py-3">
          <LastChip
            log={lastFeed}
            now={now}
            fallback="No feeds logged"
            prefix="Fed"
            category="feed"
          />
          <LastChip
            log={lastDiaper}
            now={now}
            fallback="No changes yet"
            prefix="Changed"
            category="diaper"
          />
          <LastChip
            log={lastSleep}
            now={now}
            fallback="No sleep logged"
            prefix="Slept"
            category="sleep"
          />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2.5">
        <InsightTile
          icon={Milk}
          tone={feedDue.due ? "bg-terracotta/15 text-terracotta-read" : "bg-sage/15 text-sage-read"}
          title={feedDue.due ? "Feed due" : "Feed cadence"}
          value={
            feedDue.lastFeedAt === null
              ? "No feed yet"
              : feedDue.due
                ? `Overdue by ${feedDue.overdueMinutes}m`
                : `${feedDue.minutesSince}m since last feed`
          }
        />
        <InsightTile
          icon={Moon}
          tone="bg-plum/15 text-plum-read"
          title="Wake window"
          value={
            wake.phase === "sleeping"
              ? "Asleep right now"
              : wake.awakeSec === 0
                ? "No sleep logged yet"
                : wake.phase === "calm"
                  ? "Awake · cues coming"
                  : wake.phase === "cue"
                    ? "Sleepy cues starting"
                    : wake.phase === "overdoing"
                      ? "Overtired — try a nap"
                      : `Taking it easy on the target`
          }
          detail={
            wake.phase === "sleeping" || wake.awakeSec === 0
              ? undefined
              : `Awake ${humanDuration(wake.awakeSec)} · target ${humanDuration(wake.minSec)}–${humanDuration(wake.maxSec)}`
          }
        />
      </div>

      {spurt.active ? (
        <Card className="flex items-start gap-2.5 border-terracotta/25 bg-terracotta/8 p-3.5">
          <span className="text-xl">🌱</span>
          <div>
            <p className="text-sm font-bold text-foreground">Growth spurt?</p>
            <p className="text-xs font-medium text-muted">{spurt.reason}</p>
          </div>
        </Card>
      ) : null}

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-sm font-bold text-foreground">
              Handoff summary
            </p>
            <p className="text-[11px] font-medium text-muted">
              Copy a snapshot for the next caregiver
            </p>
          </div>
          <button
            type="button"
            onClick={copyHandoff}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground transition-transform active:scale-95"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <IoStat
            label="Intake"
            value={`${Math.round(io.intakeOz)} oz`}
            detail={io.breastMinutes > 0 ? `${io.breastMinutes}m breast` : "no breast time"}
          />
          <IoStat
            label="Diapers"
            value={String(io.diapers)}
            detail={io.wetCount > 0 ? `${io.wetCount} wet · ${io.dryCount} dry` : "none yet"}
          />
        </div>
      </Card>

      <section className="space-y-2.5">
        <SectionTitle title="Live timers" hint="One-tap tracking" />
        <LiveTimers onFinish={onFinishedTimer} />
      </section>

      <section className="space-y-2.5">
        <SectionTitle title="Quick log" hint="Tap a category" />
        <QuickLogGrid onSelect={onSelectCategory} />
        {onVoiceDraft ? (
          <Card className="flex items-center justify-between p-3">
            <VoiceQuickLogButton onParsed={onVoiceDraft} />
          </Card>
        ) : null}
      </section>

      <section className="space-y-2.5">
        <SectionTitle title="Recent entries" hint={`${logs.length} total`} />
        {recent.length === 0 ? (
          <Card className="flex flex-col items-center gap-1 py-8 text-center">
            <span className="text-2xl">🌱</span>
            <p className="text-sm font-bold text-foreground">No entries yet</p>
            <p className="max-w-[220px] text-xs font-medium text-muted">
              Start a timer or tap a category above to log your first moment.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {recent.map((log) => (
              <LogItem
                key={log.id}
                log={log}
                units={units}
                baby={baby ?? undefined}
                onPress={onOpenLog}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between px-1">
      <h2 className="font-serif text-sm font-bold text-foreground">{title}</h2>
      {hint ? (
        <span className="text-[11px] font-medium text-muted">{hint}</span>
      ) : null}
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: keyof typeof TONES;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-sprout-surface-muted px-1 py-3">
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-xl",
          TONES[tone].iconWrap,
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="tabular text-sm font-bold text-foreground">{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
    </div>
  );
}

function InsightTile({
  icon: Icon,
  tone,
  title,
  value,
  detail,
}: {
  icon: LucideIcon;
  tone: string;
  title: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-3xl border border-hairline bg-sprout-surface p-3.5">
      <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl", tone)}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-muted">{title}</p>
      <p className="mt-0.5 text-sm font-bold text-foreground">{value}</p>
      {detail ? (
        <p className="mt-0.5 text-[11px] font-medium text-muted">{detail}</p>
      ) : null}
    </div>
  );
}

function IoStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl bg-sprout-surface-muted px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="tabular text-base font-bold text-foreground">{value}</p>
      <p className="truncate text-[11px] font-medium text-muted">{detail}</p>
    </div>
  );
}

function LastChip({
  log,
  now,
  fallback,
  prefix,
  category,
}: {
  log: ReturnType<typeof lastLogByCategory>;
  now: number;
  fallback: string;
  prefix: string;
  category: Category;
}) {
  const tone = TONES[CATEGORY_META[category].tone];
  if (!log) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sprout-surface-muted px-2.5 py-1 text-[10px] font-semibold text-muted">
        <CategoryIcon category={category} className="h-3 w-3" />
        {fallback}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold",
        tone.chip,
      )}
    >
      <CategoryIcon category={category} className="h-3 w-3" />
      {prefix} {elapsedLabel(log.startTime, now)}
    </span>
  );
}
