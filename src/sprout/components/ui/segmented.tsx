import { cn } from "@/sprout/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  columns,
  size = "md",
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  columns?: number;
  size?: "sm" | "md";
}) {
  return (
    <div
      role="radiogroup"
      className={cn("grid gap-1.5", className)}
      style={
        columns
          ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
          : { gridAutoFlow: "column", gridAutoColumns: "1fr" }
      }
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-2xl font-semibold transition-all active:scale-[0.97]",
              size === "sm" ? "min-h-9 px-2 text-xs" : "min-h-12 px-2 text-[13px]",
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-sprout-surface-muted text-foreground hover:bg-sprout-surface-sunken",
            )}
          >
            {option.icon}
            <span className="truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
