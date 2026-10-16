"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppSkeleton } from "@/sprout/components/app-skeleton";
import { BottomNav } from "@/sprout/components/bottom-nav";
import { Header } from "@/sprout/components/header";
import { InstallPrompt } from "@/sprout/components/install-prompt";
import { LogDetailSheet } from "@/sprout/components/log-detail-sheet";
import { LogSheet } from "@/sprout/components/log-sheet";
import { SettingsSheet } from "@/sprout/components/settings-sheet";
import { useToast } from "@/sprout/components/ui/toast";
import { AccountView } from "@/sprout/components/views/account-view";
import { MilestonesView } from "@/sprout/components/views/milestones-view";
import { RunningTimerBanner } from "@/sprout/components/running-timer-banner";
import { TimelineView } from "@/sprout/components/views/timeline-view";
import { TrackerView } from "@/sprout/components/views/tracker-view";
import { TrendsView } from "@/sprout/components/views/trends-view";
import { ToolsView } from "@/sprout/components/views/tools-view";
import { useData } from "@/sprout/hooks/use-data";
import { useMounted } from "@/sprout/hooks/use-now";
import { useTimers, type FinishedTimer } from "@/sprout/hooks/use-timers";
import {
  defaultDraft,
  draftFromFinishedTimer,
  draftFromLog,
  draftToNewLog,
  type LogDraft,
} from "@/sprout/lib/forms";
import { CATEGORY_META } from "@/sprout/lib/categories";
import {
  joinInvite,
  readInviteCodeFromUrl,
  saveJoinCode,
  takeJoinCode,
} from "@/sprout/lib/invite";
import { clearInviteFromUrl, isSignedInviteCode, readInviteFromUrl } from "@/sprout/lib/share";
import { setActiveHousehold } from "@/lib/household-preference";
import { cn } from "@/sprout/lib/utils";
import type { ActiveView, Category, Log, TimerKind } from "@/sprout/lib/types";

export function SproutApp() {
  const mounted = useMounted();
  if (!mounted) return <AppSkeleton />;
  return <Shell />;
}

function Shell() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { baby, babies, logs, settings, theme, setTheme, addBaby, adoptBaby, setActiveBaby, addLog, removeLog } =
    useData();
  const { anyRunning, stop } = useTimers();
  const toast = useToast();
  const [view, setView] = useState<ActiveView>("tracker");
  const [toolsReturn, setToolsReturn] = useState<ActiveView>("tracker");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [detailLog, setDetailLog] = useState<Log | null>(null);
  const [draft, setDraft] = useState<LogDraft | null>(null);
  const [editLogId, setEditLogId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    const legacy = readInviteFromUrl();
    const rawCode = readInviteCodeFromUrl();
    clearInviteFromUrl();

    // Signed household invite — either from the URL directly or one that was
    // stashed while the person signed in to the app.
    const pendingCode = rawCode && isSignedInviteCode(rawCode) ? rawCode : takeJoinCode();
    if (pendingCode && isSignedInviteCode(pendingCode)) {
      void (async () => {
        if (!user) {
          saveJoinCode(pendingCode);
          router.push("/sign-in?next=/sprout-baby-tracker");
          return;
        }
        if (!window.confirm("Join this family and sync your baby tracker together?")) {
          return;
        }
        try {
          const result = await joinInvite(pendingCode);
          await adoptBaby({
            id: result.baby.id,
            name: result.baby.name,
            birthDate: result.baby.birthDate,
            avatarEmoji: result.baby.avatarEmoji,
            color: result.baby.color,
            sex: result.baby.sex ?? undefined,
            householdId: result.householdId,
          });
          setActiveHousehold(result.householdId);
          setView("account");
          window.setTimeout(() => window.location.reload(), 900);
        } catch (err) {
          window.alert(err instanceof Error ? err.message : "Couldn't join this family.");
        }
      })();
      return;
    }

    if (!legacy) return;
    if (
      typeof window === "undefined" ||
      !window.confirm(`Add ${legacy.name} from this invite link?`)
    ) {
      return;
    }
    void (async () => {
      const existing = babies.find(
        (b) => b.name === legacy.name && b.birthDate === legacy.birthDate,
      );
      if (existing) {
        await setActiveBaby(existing.id);
      } else {
        const created = await addBaby({
          name: legacy.name,
          birthDate: legacy.birthDate,
          avatarEmoji: legacy.avatarEmoji,
          sex: legacy.sex,
        });
        await setActiveBaby(created.id);
      }
      setView("account");
    })();
  }, [babies, addBaby, adoptBaby, setActiveBaby, user, authLoading, router]);

  const openCategory = (category: Category) => {
    const next = defaultDraft(category, settings);
    if (category === "feed" && baby?.defaultBottleBrand) {
      next.details = { ...next.details, bottleBrand: baby.defaultBottleBrand };
    }
    if (category === "growth") {
      const last = logs.find((l) => l.category === "growth");
      if (last) {
        next.details = {
          ...next.details,
          weightKg: (last.details.weightKg as number) ?? 0,
          heightCm: (last.details.heightCm as number) ?? 0,
          headCm: (last.details.headCm as number) ?? 0,
        };
      }
    }
    if (category === "health") {
      const last = logs.find((l) => l.category === "health");
      if (last) {
        next.details = {
          ...next.details,
          symptoms: (last.details.symptoms as string) ?? "",
          vaccineName: (last.details.vaccineName as string) ?? "",
          medicationName: (last.details.medicationName as string) ?? "",
          medicationDose: (last.details.medicationDose as string) ?? "",
        };
      }
    }
    setEditLogId(null);
    setDraft(next);
    setLogOpen(true);
  };

  const openDraft = (next: LogDraft) => {
    setEditLogId(null);
    setDraft(next);
    setLogOpen(true);
  };

  const openEditLog = (log: Log) => {
    setEditLogId(log.id);
    setDraft(draftFromLog(log));
    setDetailLog(null);
    setLogOpen(true);
  };

  const handleFinished = (finished: FinishedTimer) => {
    setEditLogId(null);
    setDraft(draftFromFinishedTimer(finished, settings));
    setLogOpen(true);
  };

  const handleBannerStop = (kind: TimerKind) => {
    handleFinished(stop(kind));
  };

  const quickLog = (category: Category) => {
    const next = defaultDraft(category, settings);
    const last = logs.find((log) => log.category === category);
    if (category === "feed" && last) {
      // "Same as last" — carry the previous feed's details so one tap is enough.
      next.details = { ...next.details, ...last.details };
    }
    void (async () => {
      try {
        const created = await addLog(draftToNewLog(next));
        toast.show({
          message: `${CATEGORY_META[category].label} logged`,
          actionLabel: "Undo",
          duration: 6000,
          onAction: () => void removeLog(created.id),
        });
      } catch {
        toast.show({ message: "Couldn't log that entry", duration: 4000 });
      }
    })();
  };

  const addChild = () => {
    void (async () => {
      const created = await addBaby({ name: `Baby ${babies.length + 1}` });
      await setActiveBaby(created.id);
    })();
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <Header
        baby={baby}
        babies={babies}
        theme={theme}
        onSelectBaby={(id) => void setActiveBaby(id)}
        onAddChild={addChild}
        onOpenSettings={() => setSettingsOpen(true)}
        onCycleTheme={() =>
          void setTheme(
            theme === "light" ? "dark" : theme === "dark" ? "system" : "light",
          )
        }
      />

      <main
        key={view}
        className={cn(
          "flex-1 animate-fade-in px-4 pt-4",
          anyRunning ? "pb-40" : "pb-28",
        )}
      >
        {view === "tracker" ? (
          <TrackerView
            onSelectCategory={openCategory}
            onQuickLog={quickLog}
            onFinishedTimer={handleFinished}
            onOpenLog={setDetailLog}
            onVoiceDraft={openDraft}
          />
        ) : null}
        {view === "timeline" ? (
          <TimelineView onOpenLog={setDetailLog} />
        ) : null}
        {view === "trends" ? (
          <TrendsView
            onAddMeasurement={() => openCategory("growth")}
            onLog={openCategory}
          />
        ) : null}
        {view === "milestones" ? (
          <MilestonesView onAddMilestone={() => openCategory("milestone")} />
        ) : null}
        {view === "account" ? <AccountView /> : null}
        {view === "tools" ? (
          <ToolsView onBack={() => setView(toolsReturn)} />
        ) : null}
      </main>

      <RunningTimerBanner onOpen={() => setView("tracker")} onStop={handleBannerStop} />
      <BottomNav active={view} onChange={setView} />

      <LogSheet
        open={logOpen}
        draft={draft}
        editingId={editLogId}
        onClose={() => {
          setLogOpen(false);
          setEditLogId(null);
        }}
      />
      <LogDetailSheet
        key={detailLog?.id ?? "none"}
        log={detailLog}
        onEdit={openEditLog}
        onClose={() => setDetailLog(null)}
      />
      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onOpenTools={() => {
          setSettingsOpen(false);
          setToolsReturn(view === "tools" ? "tracker" : view);
          setView("tools");
        }}
      />
      <InstallPrompt />
    </div>
  );
}
