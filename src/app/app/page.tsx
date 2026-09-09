"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Sparkles, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { useHousehold } from "@/lib/use-household";
import { useDayEvents } from "@/lib/use-day-events";
import { useRealtimeSync } from "@/lib/use-realtime-sync";
import { findConflicts } from "@/lib/conflicts";
import { startOfDay } from "@/lib/time";
import { track } from "@/lib/analytics";
import { isProUser, SUBSCRIPTION_ENABLED } from "@/lib/config";
import OnboardingForm from "@/components/OnboardingForm";
import TimelineLane from "@/components/TimelineLane";
import ConflictBridges from "@/components/ConflictBridges";
import ConflictsPanel from "@/components/ConflictsPanel";
import QuickLogBar from "@/components/QuickLogBar";
import DateNav from "@/components/DateNav";
import Canonical from "@/components/Canonical";
import EventLog from "@/components/EventLog";
import ProUpgradeModal from "@/components/ProUpgradeModal";
import AppHeader from "@/components/app/AppHeader";
import AiQuickLog from "@/components/AiQuickLog";

function useGoldenOverlap(conflicts: ReturnType<typeof findConflicts>) {
  const sleep = conflicts.find((c) => c.type === "sleep");
  if (!sleep) return null;
  return {
    start: sleep.overlapStart,
    end: sleep.overlapEnd,
  };
}

export default function AppPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { loading: householdLoading, householdId, children, planTier, refresh } =
    useHousehold();

  const [selectedDayStart, setSelectedDayStart] = useState<number>(() => startOfDay());
  const isToday = selectedDayStart === startOfDay();
  const [proModalOpen, setProModalOpen] = useState(false);
  const [predictEnabled, setPredictEnabled] = useState(false);
  const [justUpgraded, setJustUpgraded] = useState(false);

  const { events, loading: eventsLoading, refresh: refreshEvents } = useDayEvents(
    householdId,
    selectedDayStart
  );

  const isPro = isProUser(planTier);

  // Real-time multi-device sync — active for Pro households only
  useRealtimeSync(householdId, isPro, refreshEvents);

  // Detect a return from the Paddle checkout (?upgraded=1) and re-pull
  // the household's plan tier so Pro features unlock without a reload.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("upgraded") === "1" && householdId) {
      setJustUpgraded(true);
      refresh().then(() => router.replace("/app"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [householdId]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/sign-in");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!householdLoading && householdId) {
      track("app_view");
    }
  }, [householdLoading, householdId]);

  // After returning from the Paddle checkout, re-pull the household's
  // plan tier so Pro features unlock immediately without a page reload.
  useEffect(() => {
    if (justUpgraded && householdId) {
      refresh().then(() => router.replace("/app"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [justUpgraded, householdId]);

  const older = children[0];
  const younger = children[1];
  const conflicts = older && younger ? findConflicts(older.id, younger.id, events) : [];
  const golden = useGoldenOverlap(conflicts);

  useEffect(() => {
    if (conflicts.length > 0) {
      track("conflict_viewed", { count: conflicts.length });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conflicts.length]);

  function handleDateChange(newDayStart: number) {
    track("date_navigated", {
      direction: newDayStart > selectedDayStart ? "forward" : "back",
    });
    setSelectedDayStart(newDayStart);
  }

  function handlePredictToggle() {
    if (isPro) {
      setPredictEnabled((enabled) => !enabled);
      track("predict_toggle", { on: !predictEnabled });
    } else {
      track("predict_paywall_shown");
      setProModalOpen(true);
    }
  }

  if (authLoading || householdLoading) {
    return (
      <>
        <Canonical url="https://www.siblingstack.com/app" />
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

  if (!user) return null;

  if (!householdId || children.length < 2) {
    return (
      <>
        <Canonical url="https://www.siblingstack.com/app" />
        <OnboardingForm onDone={refresh} />
      </>
    );
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 py-6">
      <Canonical url="https://www.siblingstack.com/app" />
      <AppHeader onInviteClick={() => { track("invite_paywall_shown"); setProModalOpen(true); }} />
      <div className="max-w-3xl mx-auto mt-6">
        {justUpgraded && (
          <div className="mb-4 flex items-center gap-3 bg-surface border border-childB/30 rounded-md px-4 py-3">
            <CheckCircle2 size={17} className="text-childB shrink-0" />
            <p className="text-sm text-ink">Welcome to Pro — your 7-day trial is active.</p>
          </div>
        )}
        <DateNav dayStart={selectedDayStart} onChange={handleDateChange} />

        {golden && (
          <div className="mb-4 flex items-center gap-3 bg-surface border border-childB/30 rounded-md px-4 py-3">
            <span className="w-2.5 h-2.5 rounded-full bg-childB shrink-0 animate-pulse" />
            <p className="text-sm text-ink">
              <span className="font-medium">Golden Overlap window:</span>{" "}
              both kids are down{" "}
              <span className="font-mono text-childB">
                {formatWindow(golden.start, golden.end)}
              </span>{" "}
              — your turn to breathe.
            </p>
          </div>
        )}

        {eventsLoading ? (
          <p className="text-ink-muted font-mono text-sm text-center py-8">Loading day…</p>
        ) : (
          <>
            {isToday && (
              <div className="mb-6">
                {isPro ? (
                  <AiQuickLog
                    childProfiles={children}
                    householdId={householdId}
                    onLogged={refreshEvents}
                  />
                ) : (
                  <button
                    onClick={() => { track("ai_log_paywall_shown"); setProModalOpen(true); }}
                    className="w-full flex items-center justify-between bg-surface rounded-md px-4 py-3 text-left"
                  >
                    <span className="flex items-center gap-2 text-sm text-ink">
                      <Sparkles size={15} className="text-childB" />
                      AI Quick Log — speak it, we log it
                    </span>
                    <Lock size={14} className="text-ink-muted" />
                  </button>
                )}
              </div>
            )}

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

            {isToday && (
              <div className="mt-6 flex flex-col gap-3">
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
            )}

            <div className="mt-6 flex items-center justify-between bg-surface rounded-md px-4 py-3">
              <p className="text-sm text-ink">
                Predict tomorrow's overlaps
              </p>
              <button
                onClick={handlePredictToggle}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  predictEnabled ? "bg-childA" : "bg-surface2"
                }`}
                aria-label="Predict schedule"
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-ink transition-transform"
                  style={{ transform: predictEnabled ? "translateX(22px)" : "translateX(0)" }}
                />
              </button>
            </div>

            {predictEnabled && isPro && (
              <p className="text-childB text-xs mt-2">
                Prediction engine active — see full predictions on the Analytics tab.
              </p>
            )}

            {!isPro && (
              <button
                onClick={() => { track("predict_paywall_shown"); setProModalOpen(true); }}
                className="mt-2 flex items-center gap-1.5 text-ink-muted text-xs"
              >
                <Lock size={12} />
                Predictions are a Pro feature
              </button>
            )}

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
                premium={isPro || !SUBSCRIPTION_ENABLED}
              />
            </div>
          </>
        )}
      </div>

      <ProUpgradeModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
    </main>
  );
}

function formatWindow(start: number, end: number) {
  const fmt = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${fmt.format(new Date(start))}–${fmt.format(new Date(end))}`;
}