import {
  Baby,
  Droplets,
  HeartPulse,
  Milk,
  Moon,
  Ruler,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  feed: Milk,
  pump: Droplets,
  diaper: Baby,
  sleep: Moon,
  routine: Sun,
  milestone: Sparkles,
  growth: Ruler,
  health: HeartPulse,
};

export function CategoryIcon({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[category];
  return <Icon className={cn("h-4 w-4", className)} />;
}
