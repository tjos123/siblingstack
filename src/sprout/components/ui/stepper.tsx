"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/sprout/lib/utils";

export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  decimals = 0,
  unit,
  quick,
  editable = false,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  decimals?: number;
  unit?: string;
  quick?: number[];
  editable?: boolean;
  className?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const apply = (next: number) => {
    const clamped = Math.min(Math.max(next, min), max);
    onChange(Number(clamped.toFixed(decimals)));
  };
  const display = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));

  const commit = (raw: string) => {
    if (raw.trim() === "") {
      setDraft(null);
      return;
    }
    const parsed = Number(raw.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(parsed)) apply(parsed);
    setDraft(null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          aria-label="Decrease"
          onClick={() => apply(value - step)}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sprout-surface-muted text-foreground transition-all active:scale-95 hover:bg-sprout-surface-sunken"
        >
          <Minus className="h-5 w-5" />
        </button>
        {editable ? (
          <div className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-hairline bg-sprout-surface-muted px-2 focus-within:border-sage focus-within:bg-sprout-surface focus-within:ring-2 focus-within:ring-sage/25">
            <input
              type="text"
              inputMode="decimal"
              aria-label="Value"
              value={draft ?? display}
              onChange={(e) => {
                const raw = e.target.value;
                setDraft(raw);
                const parsed = Number(raw.replace(/[^0-9.-]/g, ""));
                if (raw.trim() !== "" && Number.isFinite(parsed)) apply(parsed);
              }}
              onFocus={(e) => {
                setDraft(display);
                e.currentTarget.select();
              }}
              onBlur={(e) => commit(e.target.value)}
              autoComplete="off"
              enterKeyHint="done"
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
                if (e.key === "Escape") {
                  setDraft(null);
                  e.currentTarget.blur();
                }
              }}
              className="tabular w-full min-w-0 cursor-text bg-transparent text-center text-2xl font-bold text-foreground outline-none"
            />
            {unit ? (
              <span className="text-sm font-semibold text-muted">{unit}</span>
            ) : null}
          </div>
        ) : (
          <div className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-hairline bg-sprout-surface-muted">
            <span className="tabular text-2xl font-bold text-foreground">
              {display}
            </span>
            {unit ? (
              <span className="ml-1.5 text-sm font-semibold text-muted">{unit}</span>
            ) : null}
          </div>
        )}
        <button
          type="button"
          aria-label="Increase"
          onClick={() => apply(value + step)}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sprout-surface-muted text-foreground transition-all active:scale-95 hover:bg-sprout-surface-sunken"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      {quick && quick.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {quick.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => apply(q)}
              className={cn(
                "min-h-9 flex-1 rounded-xl px-2 text-xs font-bold transition-all active:scale-95",
                value === q
                  ? "bg-primary text-primary-foreground"
                  : "bg-sprout-surface-muted text-muted hover:bg-sprout-surface-sunken",
              )}
            >
              {decimals > 0 ? q.toFixed(decimals) : q}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
