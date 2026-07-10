"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useHousehold } from "@/lib/use-household";
import { useDayEvents } from "@/lib/use-day-events";
import { findConflicts } from "@/lib/conflicts";
import { startOfDay } from "@/lib/time";
import { track } from "@/lib/analytics";
import { openBillingPortal } from "@/lib/billing";
import { exportVisitSummaryPdf } from "@/lib/pdf-export";
import OnboardingForm from "@/components/OnboardingForm";
import TimelineLane from "@/components/TimelineLane";
import ConflictBridges from "@/components/ConflictBridges";
import ConflictsPanel from "@/components/ConflictsPanel";
import QuickLogBar from "@/components/QuickLogBar";
import UpgradeCard from "@/components/UpgradeCard";
import InviteCaregiverForm from "@/components/InviteCaregiverForm";
import DateNav from "@/components/DateNav";
import Canonical from "@/components/Canonical";
import EventLog from "@/components/EventLog";
import InsightsPanel from "@/components/InsightsPanel";
import { SUBSCRIPTION_ENABLED } from "@/lib/config";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { loading: householdLoading, householdId, children, premiumStatus, refresh } =
    useHousehold();

  const [selectedDayStart, setSelectedDayStart] = useState<number>(() => startOfDay());
  const isToday = selectedDayStart === startOfDay();

  const { events, loading: eventsLoading, refresh: refreshEvents } = useDayEvents(
    householdId,
    selectedDayStart
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/sign-in");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!householdLoading && householdId) {
      track("dashboard_view");
    }
  }, [householdLoading, householdId]);

  const older = children[0];
  const younger = children[1];
  const conflicts = older && younger ? findConflicts(older.id, younger.id, events) : [];

  // While the flag is off, every account behaves as premium — the
  // paywall just isn't enforced yet. Nothing about premiumStatus itself
  // changes; this only affects what the UI does with it.
  const hasPremiumAccess = premiumStatus === "premium" || !SUBSCRIPTION_ENABLED;

  useEffect(() => {
    if (conflicts.length > 0) {
      track("conflict_viewed", { count: conflicts.length });
    }
    // Only re-fire when the count actually changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conflicts.length]);

  function handleDateChange(newDayStart: number) {
    track("date_navigated", {
      direction: newDayStart > selectedDayStart ? "forward" : "back",
    });
    setSelectedDayStart(newDayStart);
  }

  if (authLoading || householdLoading) {
    return (
      <>
        <Canonical url="https://siblingstack.com/dashboard" />
        <main className="min-h-screen px-6 py-8 max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="h-7 w-36 bg-surface2 rounded animate-pulse" />
          <div className="h-4 w-16 bg-surface2 rounded animate-pulse" />
        </header>
        <div className="mb-6 flex justify-between">
          <div className="h-4 w-16 bg-surface2 rounded animate-pulse" />
          <div className="h-5 w-40 bg-surface2 rounded animate-pulse" />
          <div className="h-4 w-16 bg-surface2 rounded animate-pulse" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-4 w-32 bg-surface2 rounded animate-pulse" />
          <div className="h-12 bg-surface rounded-md animate-pulse" />
          <div className="h-4 w-32 bg-surface2 rounded animate-pulse" />
          <div className="h-12 bg-surface rounded-md animate-pulse" />
        </div>
      </main>
      </>
    );
  }

  if (!user) return null; // redirect in flight

  if (!householdId || children.length < 2) {
    return (
      <>
        <Canonical url="https://siblingstack.com/dashboard" />
        <OnboardingForm onDone={refresh} />
      </>
    );
  }

  return (
    <main className="min-h-screen px-6 py-8">
      <Canonical url="https://siblingstack.com/dashboard" />
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-ink">Sibling Stack</h1>
          <div className="flex items-center gap-4">
            {SUBSCRIPTION_ENABLED && premiumStatus === "premium" && (
              <button
                onClick={() => openBillingPortal()}
                className="text-childA text-sm underline"
              >
                Manage billing
              </button>
            )}
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push('/sign-in'))}
              className="text-ink-muted text-sm underline"
            >
              Sign out
            </button>
          </div>
        </header>

        <DateNav dayStart={selectedDayStart} onChange={handleDateChange} />

        {eventsLoading ? (
          <p className="text-ink-muted font-mono text-sm text-center py-8">Loading day…</p>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <TimelineLane
                child={older}
                events={events}
                dayStart={selectedDayStart}
                accent="childA"
              />

              <ConflictBridges conflicts={conflicts} dayStart={selectedDayStart} />

              <TimelineLane
                child={younger}
                events={events}
                dayStart={selectedDayStart}
                accent="childB"
              />
            </div>

            <div className="mt-6">
              {isToday ? (
                <div className="flex flex-col gap-3">
                  <QuickLogBar
                    child={older}
                    events={events}
                    householdId={householdId}
                    accent="childA"
                    onLogged={refreshEvents}
                  />
                  <QuickLogBar
                    child={younger}
                    events={events}
                    householdId={householdId}
                    accent="childB"
                    onLogged={refreshEvents}
                  />
                </div>
              ) : (
                <p className="text-ink-muted text-xs italic">
                  Logging is only available for today — jump back to add new events.
                </p>
              )}
            </div>

            <div className="mt-6">
              <EventLog
                householdId={householdId}
                events={events}
                childA={older}
                childB={younger}
                onChanged={refreshEvents}
              />
            </div>

            <div className="mt-8">
              <ConflictsPanel
                conflicts={conflicts}
                childA={older}
                childB={younger}
                premium={hasPremiumAccess}
              />
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {hasPremiumAccess ? (
                <>
                  <InsightsPanel householdId={householdId} childA={older} childB={younger} />
                  <button
                    onClick={() => exportVisitSummaryPdf(children, events, selectedDayStart)}
                    className="self-start text-sm border border-childB text-childB rounded-md py-2 px-4"
                  >
                    Export visit summary (PDF)
                  </button>
                  <InviteCaregiverForm householdId={householdId} />
                </>
              ) : (
                <UpgradeCard />
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
