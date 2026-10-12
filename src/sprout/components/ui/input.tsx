import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/sprout/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-hairline bg-sprout-surface-muted px-4 text-sm font-semibold text-foreground outline-none transition-colors placeholder:font-medium placeholder:text-muted focus:border-sage focus:bg-sprout-surface focus:ring-2 focus:ring-sage/25",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-2xl border border-hairline bg-sprout-surface-muted px-4 py-3 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted focus:border-sage focus:bg-sprout-surface focus:ring-2 focus:ring-sage/25",
        className,
      )}
      {...props}
    />
  );
}
