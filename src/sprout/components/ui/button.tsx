import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/sprout/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-150 active:scale-[0.97] select-none disabled:opacity-45 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-soft shadow-soft",
        accent: "bg-terracotta text-primary-foreground hover:brightness-105 shadow-soft",
        sage: "bg-sage text-primary-foreground hover:brightness-105",
        outline:
          "border border-hairline bg-sprout-surface text-foreground hover:bg-sprout-surface-muted",
        ghost: "text-foreground hover:bg-sprout-surface-muted",
        soft: "bg-sprout-surface-muted text-foreground hover:bg-sprout-surface-sunken",
        danger: "bg-rose text-primary-foreground hover:brightness-105",
      },
      size: {
        sm: "h-9 px-3 text-xs rounded-xl",
        md: "h-12 px-4 text-sm",
        lg: "h-14 px-6 text-base rounded-3xl",
        icon: "h-12 w-12",
        iconSm: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
