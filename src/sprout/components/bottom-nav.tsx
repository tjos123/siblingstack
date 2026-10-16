"use client";

import {
  ChartLine,
  Clock,
  Sparkles,
  Sprout,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { ActiveView } from "@/sprout/lib/types";
import { cn } from "@/sprout/lib/utils";
import { haptic } from "@/sprout/lib/haptics";

const TABS: { id: ActiveView; label: string; icon: LucideIcon }[] = [
  { id: "tracker", label: "Tracker", icon: Sprout },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "trends", label: "Trends", icon: ChartLine },
  { id: "milestones", label: "Album", icon: Sparkles },
  { id: "account", label: "Account", icon: UserRound },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: ActiveView;
  onChange: (view: ActiveView) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-hairline bg-sprout-surface/95 backdrop-blur-md pb-safe shadow-[0_-8px_24px_-16px_rgba(30,41,34,0.25)]">
      <div className="flex items-stretch justify-around px-1.5 pt-1.5">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                haptic(6);
                onChange(tab.id);
              }}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-[58px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "text-sage-read"
                  : "text-muted hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-[30px] w-[52px] items-center justify-center rounded-full transition-all",
                  isActive ? "bg-sage/22" : "bg-transparent",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isActive ? "scale-105" : "",
                  )}
                  strokeWidth={isActive ? 2.5 : 1.9}
                />
              </span>
              <span className="text-[10px] font-bold tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
