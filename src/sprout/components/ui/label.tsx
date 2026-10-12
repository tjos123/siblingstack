import type { LabelHTMLAttributes } from "react";
import { cn } from "@/sprout/lib/utils";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-0", className)}>
      {label ? <Label>{label}</Label> : null}
      {children}
      {error ? (
        <p className="mt-1 text-[11px] font-semibold text-rose-read">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[11px] font-medium text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
