"use client";

import { useMemo, useState } from "react";
import { Baby, Droplets, Milk, Moon, Plus, Ruler, Thermometer } from "lucide-react";
import { BarChart, DistributionBar } from "@/sprout/components/charts";
import { TrendDelta } from "@/sprout/components/trend-delta";
import { Button } from "@/sprout/components/ui/button";
import { Card } from "@/sprout/components/ui/card";
import { Segmented } from "@/sprout/components/ui/segmented";
import { useData } from "@/sprout/hooks/use-data";
import { formatClock, formatDateShort, humanDuration } from "@/sprout/lib/format";
import {
  bucketByDay,
  computeChange,
  computeTrends,
  type RangeDays,
} from "@/sprout/lib/stats";
import { growthPoints } from "@/sprout/lib/growth";
import { formatLength, formatTemperature, formatVolume, formatWeight } from "@/sprout/lib/units";
import type { Category } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

type RangeKey = "1" | "7" | "14";

const RANGE_OPTIONS: { value: RangeKey; label: string }[] = [
  { value: "1", label: "Today" },
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
];

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

// Short, non-clipping x-axis labels: weekday letters for a week, day-of-month
// for a fortnight. Today is always labelled explicitly.
function barLabel(date: Date, index: number, total: number, days: number) {
  if (index === total - 1) return "Today";
  return days <= 7 ? DAY_LETTERS[date.getDay()] : String(date.getDate());
}

export function TrendsView({
  onAddMeasurement,
  onLog,
}: {
  onAddMeasurement?: () => void;
  onLog?: (category: Category) => void;
}) {
  const { logs, baby, settings } = useData();
  const [range, setRange] = useState<RangeKey>("7");
  const days = Number(range) as RangeDays;
  const units = settings.units;

  const trends = useMemo(() => computeTrends(logs, days), [logs, days]);
  const buckets = useMemo(() => bucketByDay(logs, days), [logs, days]);
  const weights = useMemo(() => growthPoints(logs, baby, "weight"), [logs, baby]);
  const lengths = useMemo(() => growthPoints(logs, baby, "length"), [logs, baby]);
  const temps = useMemo(
    () =>
      logs
        .filter(
          (l) =>
            l.category === "health" &&
            l.healthSubtype === "temperature" &&
            typeof l.details.temperatureC === "number",
        )
        .sort((a, b) => b.startTime.localeCompare(a.startTime))
        .slice(0, 10),
    [logs],
  );

  // A card can show a per-day average once it has at least two days of data
  // (or any data in the single-day "Today" view). A trend badge only makes
  // sense when both the current and the previous period hold entries.
  const enough = (activeDays: number, sessions: number) =>
    days === 1 ? sessions > 0 : activeDays >= 2;
  const comparable = (sessions: number, prev: number) =>
    sessions > 0 && prev > 0;

  const feedChange = computeChange(trends.feed.perDay, trends.feedPrev.perDay);
  const sleepChange = computeChange(
    trends.sleep.perDayHours,
    trends.sleepPrev.perDayHours,
  );
  const diaperChange = computeChange(
    trends.diaper.perDay,
    trends.diaperPrev.perDay,
  );
  const pumpChange = computeChange(trends.pump.perDayOz, trends.pumpPrev.perDayOz);

  const bucketLabels = buckets.map((b, i) =>
    barLabel(b.date, i, buckets.length, days),
  );
  const todayIndex = buckets.length - 1;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Segmented
          value={range}
          onChange={setRange}
          columns={3}
          options={RANGE_OPTIONS}
        />
        {days > 1 ? (
          <p className="px-1 text-[11px] font-medium text-muted">
            Last {days} days · {trends.rangeActiveDays}{" "}
            {trends.rangeActiveDays === 1 ? "day" : "days"} with data
          </p>
        ) : null}
      </div>

      <Card className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage/15 text-sage-read">
            <Milk className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Feeding</p>
            <p className="text-[11px] font-medium text-muted">
              {enough(trends.feed.activeDays, trends.feed.sessions)
                ? `${trends.feed.perDay.toFixed(1)} feeds / day`
                : "Not enough data yet"}
            </p>
          </div>
          {comparable(trends.feed.sessions, trends.feedPrev.sessions) ? (
            <TrendDelta change={feedChange} format={(n) => `${n.toFixed(1)}/day`} />
          ) : null}
        </div>

        {trends.feed.sessions === 0 ? (
          <EmptyState
            emoji="🍼"
            message="No feeds logged in this range"
            onAction={onLog ? () => onLog("feed") : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              <Metric label="Sessions" value={String(trends.feed.sessions)} />
              <Metric
                label="Bottle"
                value={formatVolume(trends.feed.bottleOz, units.volume)}
              />
              <Metric
                label="Breast time"
                value={humanDuration(trends.feed.breastMinutes * 60)}
              />
            </div>

            <DistributionBar
              segments={[
                { value: trends.feed.breastSessions, tone: "sage", label: "Breast" },
                { value: trends.feed.bottleSessions, tone: "ochre", label: "Bottle" },
                { value: trends.feed.solidSessions, tone: "moss", label: "Solids" },
              ]}
            />
            <p className="text-[11px] font-medium text-muted">
              Avg gap between feeds{" "}
              <span className="font-bold text-foreground">
                {trends.feed.avgGapMinutes > 0
                  ? humanDuration(trends.feed.avgGapMinutes * 60)
                  : "—"}
              </span>
            </p>

            <BarChart
              data={buckets.map((b, i) => ({
                label: bucketLabels[i],
                value: b.feeds,
              }))}
              tone="sage"
              showValues={days <= 7}
              highlightIndex={todayIndex}
              ariaLabel={`Feeds per day over the last ${days} ${days === 1 ? "day" : "days"}`}
            />
          </>
        )}
      </Card>

      <Card className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-plum/15 text-plum-read">
            <Moon className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Sleep</p>
            <p className="text-[11px] font-medium text-muted">
              {enough(trends.sleep.activeDays, trends.sleep.sessions)
                ? `${trends.sleep.perDayHours.toFixed(1)} h / day`
                : "Not enough data yet"}
            </p>
          </div>
          {comparable(trends.sleep.sessions, trends.sleepPrev.sessions) ? (
            <TrendDelta
              change={sleepChange}
              format={(n) => `${n.toFixed(1)}h`}
            />
          ) : null}
        </div>

        {trends.sleep.sessions === 0 ? (
          <EmptyState
            emoji="😴"
            message="No sleep logged in this range"
            onAction={onLog ? () => onLog("sleep") : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              <Metric label="Sessions" value={String(trends.sleep.sessions)} />
              <Metric
                label="Longest"
                value={humanDuration(trends.sleep.longestSec)}
              />
              <Metric
                label="Wake window"
                value={
                  trends.sleep.avgWakeWindowSec > 0
                    ? humanDuration(trends.sleep.avgWakeWindowSec)
                    : "—"
                }
              />
            </div>

            <DistributionBar
              segments={[
                { value: trends.sleep.daySec, tone: "ochre", label: "Daytime" },
                { value: trends.sleep.nightSec, tone: "plum", label: "Night" },
              ]}
            />
            <div className="flex justify-between text-[10px] font-semibold text-muted">
              <span>☀️ Day {humanDuration(trends.sleep.daySec)}</span>
              <span>🌙 Night {humanDuration(trends.sleep.nightSec)}</span>
            </div>

            <BarChart
              data={buckets.map((b, i) => ({
                label: bucketLabels[i],
                value: Number(b.sleepHours.toFixed(1)),
              }))}
              tone="plum"
              showValues={days <= 7}
              valueSuffix="h"
              highlightIndex={todayIndex}
              ariaLabel={`Hours of sleep per day over the last ${days} ${days === 1 ? "day" : "days"}`}
            />
          </>
        )}
      </Card>

      <Card className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky/15 text-sky-read">
            <Baby className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Diapers</p>
            <p className="text-[11px] font-medium text-muted">
              {enough(trends.diaper.activeDays, trends.diaper.count)
                ? `${trends.diaper.perDay.toFixed(1)} changes / day`
                : "Not enough data yet"}
            </p>
          </div>
          {comparable(trends.diaper.count, trends.diaperPrev.count) ? (
            <TrendDelta
              change={diaperChange}
              format={(n) => `${n.toFixed(1)}/day`}
            />
          ) : null}
        </div>

        {trends.diaper.count === 0 ? (
          <EmptyState
            emoji="🧷"
            message="No diaper changes in this range"
            onAction={onLog ? () => onLog("diaper") : undefined}
          />
        ) : (
          <>
            <DistributionBar
              segments={[
                { value: trends.diaper.wet, tone: "sky", label: "Wet" },
                { value: trends.diaper.dirty, tone: "moss", label: "Dirty" },
                { value: trends.diaper.both, tone: "ochre", label: "Both" },
                { value: trends.diaper.dry, tone: "sage", label: "Dry" },
              ]}
            />

            <div className="grid grid-cols-4 gap-2">
              <Metric label="Wet" value={String(trends.diaper.wet)} />
              <Metric label="Dirty" value={String(trends.diaper.dirty)} />
              <Metric label="Both" value={String(trends.diaper.both)} />
              <Metric label="Night" value={String(trends.diaper.night)} />
            </div>
          </>
        )}
      </Card>

      {trends.pump.sessions > 0 ? (
        <Card className="space-y-4 p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ochre/25 text-ochre-read">
              <Droplets className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Pumping</p>
              <p className="text-[11px] font-medium text-muted">
                {formatVolume(trends.pump.totalOz, units.volume)} total
              </p>
            </div>
            {comparable(trends.pump.sessions, trends.pumpPrev.sessions) ? (
              <TrendDelta
                change={pumpChange}
                format={(n) => formatVolume(n, units.volume)}
              />
            ) : null}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Metric label="Sessions" value={String(trends.pump.sessions)} />
            <Metric
              label="Per day"
              value={formatVolume(trends.pump.perDayOz, units.volume)}
            />
            <Metric
              label="Avg / session"
              value={formatVolume(trends.pump.avgPerSessionOz, units.volume)}
            />
          </div>
        </Card>
      ) : (
        <Card className="space-y-4 p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ochre/25 text-ochre-read">
              <Droplets className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Pumping</p>
              <p className="text-[11px] font-medium text-muted">Not enough data yet</p>
            </div>
          </div>
          <EmptyState
            emoji="🍶"
            message="No pumping sessions in this range"
            onAction={onLog ? () => onLog("pump") : undefined}
          />
        </Card>
      )}

      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage/15 text-sage-read">
            <Ruler className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">WHO growth chart</p>
            <p className="text-[11px] font-medium text-muted">
              WHO Child Growth Standards · {baby?.sex ?? "sex not set"}
            </p>
          </div>
          {onAddMeasurement ? (
            <Button variant="soft" size="sm" onClick={onAddMeasurement}>
              <Plus className="h-3.5 w-3.5" />
              Measure
            </Button>
          ) : null}
        </div>

        {weights.length > 0 || lengths.length > 0 ? (
          <>
            <GrowthRow
              title="Weight"
              points={weights}
              formatValue={(v) => formatWeight(v, units.weight)}
            />
            <GrowthRow
              title="Length"
              points={lengths}
              formatValue={(v) => formatLength(v, units.length)}
            />
          </>
        ) : (
          <button
            type="button"
            onClick={onAddMeasurement}
            className="w-full rounded-2xl border border-dashed border-hairline bg-sprout-surface-muted px-4 py-6 text-center transition-colors hover:border-sage/40"
          >
            <Ruler className="mx-auto h-6 w-6 text-muted" />
            <p className="mt-2 text-[12px] font-bold text-foreground">
              No measurements yet
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-muted">
              Log weight or length to see your baby&apos;s percentile on the WHO chart.
            </p>
          </button>
        )}

        {baby && !baby.sex ? (
          <p className="rounded-2xl bg-ochre/12 px-3 py-2 text-[11px] font-medium text-foreground/80">
            Set your baby&apos;s sex in Settings for accurate WHO percentiles.
          </p>
        ) : null}

        <p className="rounded-2xl bg-sprout-surface-muted px-3 py-2 text-[10px] font-medium text-muted">
          Percentile bands are for guidance only and are not medical advice. Talk to
          your pediatrician about your baby&apos;s growth.
        </p>
      </Card>

      {temps.length > 0 ? (
        <Card className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose/15 text-rose-read">
              <Thermometer className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Temperature log</p>
              <p className="text-[11px] font-medium text-muted">
                Recent readings · fever at 38 °C / 100.4 °F
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {temps.map((t) => {
              const c = t.details.temperatureC as number;
              const fever = c >= 38;
              return (
                <span
                  key={t.id}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
                    fever ? "bg-rose/15 text-rose-read" : "bg-sage/15 text-sage-read",
                  )}
                >
                  {formatTemperature(c, units.temperature)}
                  <span className="font-semibold opacity-70">
                    {formatDateShort(t.startTime)} {formatClock(t.startTime)}
                  </span>
                </span>
              );
            })}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function EmptyState({
  emoji,
  message,
  onAction,
}: {
  emoji: string;
  message: string;
  onAction?: () => void;
}) {
  const body = (
    <>
      <span className="text-xl">{emoji}</span>
      <p className="mt-1 text-[12px] font-bold text-foreground">{message}</p>
      {onAction ? (
        <p className="mt-0.5 text-[11px] font-semibold text-sage-read">Tap to log one</p>
      ) : null}
    </>
  );
  if (!onAction) {
    return (
      <div className="w-full rounded-2xl border border-dashed border-hairline bg-sprout-surface-muted px-4 py-6 text-center">
        {body}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onAction}
      className="w-full rounded-2xl border border-dashed border-hairline bg-sprout-surface-muted px-4 py-6 text-center transition-colors hover:border-sage/40"
    >
      {body}
    </button>
  );
}

const BAND_ORDER = ["low", "lower-mid", "mid", "upper-mid", "high"] as const;
const BAND_LABELS = ["<3rd", "3–15th", "15–85th", "85–97th", ">97th"];

function GrowthRow({
  title,
  points,
  formatValue,
}: {
  title: string;
  points: ReturnType<typeof growthPoints>;
  formatValue: (value: number) => string;
}) {
  if (points.length === 0) return null;
  const latest = points[points.length - 1];
  const activeBand = BAND_ORDER.indexOf(latest.result.band);
  return (
    <div className="rounded-2xl bg-sprout-surface-muted px-3 py-2.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
          {title}
        </span>
        <span className="tabular text-sm font-bold text-foreground">
          {formatValue(latest.value)}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted">
          ≈ {latest.result.percentile}th percentile
        </span>
        <span className="rounded-full bg-sprout-surface px-2 py-0.5 text-[10px] font-bold text-foreground">
          {latest.result.bandLabel}
        </span>
      </div>
      <div className="mt-2 flex gap-1">
        {BAND_ORDER.map((band, i) => (
          <div key={band} className="flex-1 space-y-1">
            <div
              className={cn(
                "h-1.5 rounded-full",
                i === activeBand ? "bg-sage" : "bg-sprout-surface",
              )}
            />
            <p
              className={cn(
                "text-center text-[9px] font-semibold",
                i === activeBand ? "text-sage-read" : "text-muted/70",
              )}
            >
              {BAND_LABELS[i]}
            </p>
          </div>
        ))}
      </div>
      {points.length > 1 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {points.map((p) => (
            <span
              key={p.log.id}
              className="rounded-full bg-sprout-surface px-2 py-0.5 text-[10px] font-semibold text-muted"
            >
              {p.month.toFixed(1)}mo · {formatValue(p.value)}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn("rounded-2xl bg-sprout-surface-muted px-2 py-2.5 text-center")}>
      <p className="tabular text-sm font-bold text-foreground">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
    </div>
  );
}
