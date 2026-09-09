"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BarChart3, Users, Crown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { isProUser } from "@/lib/config";
import { useHousehold } from "@/lib/use-household";

interface Props {
  onInviteClick?: () => void;
}

export default function AppHeader({ onInviteClick }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { planTier } = useHousehold();
  const isPro = isProUser(planTier);

  function isActive(path: string) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  const tabs = [
    { href: "/app", label: "Timeline", icon: LayoutDashboard },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings/household", label: "Household", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-surface2">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/app" className="font-display text-lg text-ink whitespace-nowrap">
          Sibling Stack
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2 text-sm">
          {tabs.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors ${
                isActive(href)
                  ? "bg-surface text-ink"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!isPro && (
            <button
              onClick={onInviteClick ?? (() => {})}
              className="hidden sm:flex items-center gap-1.5 text-childA text-sm font-medium"
            >
              <Crown size={14} />
              Upgrade to Pro
            </button>
          )}
          {isPro && (
            <span className="hidden sm:flex items-center gap-1.5 text-childB text-xs font-mono bg-childB/10 rounded-full px-2.5 py-1">
              <Crown size={12} />
              PRO
            </span>
          )}
          {user && (
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push("/sign-in"))}
              className="text-ink-muted text-sm underline whitespace-nowrap"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}