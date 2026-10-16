import { cn } from "@/sprout/lib/utils";
import type { Tone } from "@/sprout/lib/categories";

const BAR: Record<Tone, string> = {
  sage: "bg-sage",
  terracotta: "bg-terracotta",
  ochre: "bg-ochre",
  sky: "bg-sky",
  plum: "bg-plum",
  moss: "bg-moss",
  rose: "bg-rose",
};

export function BarChart({
  data,
  tone = "sage",
  height = 104,
  showValues = false,
  valueSuffix = "",
  highlightIndex,
  ariaLabel,
}: {
  data: { label: string; value: number }[];
  tone?: Tone;
  height?: number;
  showValues?: boolean;
  valueSuffix?: string;
  highlightIndex?: number;
  ariaLabel?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div
      className="flex items-end gap-1"
      style={{ height: height + 18 }}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
    >
      {data.map((d, index) => {
        const pct = (d.value / max) * 100;
        const isHighlight = index === highlightIndex;
        return (
          <div
            key={`${d.label}-${index}`}
            className="flex h-full min-w-0 flex-1 flex-col items-center gap-1"
          >
            <span className="flex h-2.5 items-center justify-center">
              {showValues && d.value > 0 ? (
                <span className="tabular text-[9px] font-bold leading-none text-muted">
                  {Math.round(d.value * 10) / 10}
                  {valueSuffix}
                </span>
              ) : null}
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className={cn(
                  "w-full rounded-t-lg transition-all duration-500",
                  d.value > 0 ? BAR[tone] : "bg-hairline",
                  isHighlight && d.value > 0 && "ring-2 ring-forest/40",
                )}
                style={{
                  height: `${Math.max(pct, d.value > 0 ? 6 : 2)}%`,
                }}
              />
            </div>
            <span
              className={cn(
                "w-full whitespace-nowrap text-center text-[9px] font-bold leading-none",
                isHighlight ? "text-foreground" : "text-muted",
              )}
            >
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function Sparkline({
  values,
  tone = "sage",
  height = 56,
  className,
}: {
  values: number[];
  tone?: Tone;
  height?: number;
  className?: string;
}) {
  const width = 240;
  const max = Math.max(1, ...values);
  const min = Math.min(0, ...values);
  const span = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values.map((value, index) => {
    const x = index * step;
    const y = height - ((value - min) / span) * (height - 8) - 4;
    return [x, y] as const;
  });
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `0,${height} ${line} ${width},${height}`;
  const stroke =
    tone === "terracotta"
      ? "#e07a5f"
      : tone === "ochre"
        ? "#d6a445"
        : tone === "sky"
          ? "#4f93b8"
          : tone === "plum"
            ? "#9a6cbb"
            : tone === "moss"
              ? "#4f8168"
              : tone === "rose"
                ? "#d1655f"
                : "#81b29a";
  const gradientId = `spark-${tone}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("w-full", className)}
      style={{ height }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradientId})`} />
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function DistributionBar({
  segments,
  className,
}: {
  segments: { value: number; tone: Tone; label: string }[];
  className?: string;
}) {
  const total = segments.reduce((acc, s) => acc + s.value, 0) || 1;
  const visible = segments.filter((s) => s.value > 0);
  if (visible.length === 0) {
    return (
      <div
        aria-hidden="true"
        className={cn("h-3 w-full rounded-full bg-sprout-surface-muted", className)}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={segments
        .map((s) => `${s.label}: ${Math.round(s.value)}`)
        .join(", ")}
      className={cn("flex h-3 w-full overflow-hidden rounded-full", className)}
    >
      {visible.map((s) => (
        <div
          key={s.label}
          className={cn(BAR[s.tone], "h-full transition-all duration-500")}
          style={{ width: `${(s.value / total) * 100}%` }}
          title={`${s.label}: ${s.value}`}
        />
      ))}
    </div>
  );
}
