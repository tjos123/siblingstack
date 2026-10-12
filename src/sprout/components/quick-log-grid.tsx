"use client";

import { CategoryIcon } from "@/sprout/components/category-icon";
import { CATEGORY_META, TONES } from "@/sprout/lib/categories";
import { haptic } from "@/sprout/lib/haptics";
import { CATEGORIES, type Category } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";

export function QuickLogGrid({
  onSelect,
}: {
  onSelect: (category: Category) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {CATEGORIES.map((category) => {
        const meta = CATEGORY_META[category];
        const tone = TONES[meta.tone];
        return (
          <button
            key={category}
            type="button"
            onClick={() => {
              haptic(8);
              onSelect(category);
            }}
            className="flex flex-col items-center gap-1.5 rounded-3xl border border-hairline bg-sprout-surface px-1 py-3 transition-all active:scale-95 hover:border-sage/40 hover:shadow-soft"
          >
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl",
                tone.iconWrap,
              )}
            >
              <CategoryIcon category={category} className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-bold text-foreground">
              {meta.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
