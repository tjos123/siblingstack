"use client";

import { cn } from "@/sprout/lib/utils";

export function Switch({
  checked,
  onChange,
  label,
  description,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-3 text-left",
        className,
      )}
    >
      {label || description ? (
        <span className="min-w-0">
          {label ? (
            <span className="block text-sm font-semibold text-foreground">
              {label}
            </span>
          ) : null}
          {description ? (
            <span className="mt-0.5 block text-xs text-muted">{description}</span>
          ) : null}
        </span>
      ) : null}
      <span
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-sage" : "bg-hairline-strong",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-sprout-surface shadow-soft transition-all",
            checked ? "left-6" : "left-1",
          )}
        />
      </span>
    </button>
  );
}
