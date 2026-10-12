import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/sprout/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-sprout-surface-muted text-muted",
        sage: "bg-sage/15 text-sage-read",
        terracotta: "bg-terracotta/15 text-terracotta-read",
        ochre: "bg-ochre/25 text-ochre-read",
        sky: "bg-sky/15 text-sky-read",
        plum: "bg-plum/15 text-plum-read",
        moss: "bg-moss/15 text-moss-read",
        rose: "bg-rose/15 text-rose-read",
        success: "bg-sage/20 text-sage-read",
        warning: "bg-ochre/30 text-ochre-read",
        danger: "bg-rose/15 text-rose-read",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props} />
  );
}
