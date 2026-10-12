"use client";

import { useEffect, useState } from "react";
import { AppSkeleton } from "@/sprout/components/app-skeleton";
import { BottomNav } from "@/sprout/components/bottom-nav";
import { Header } from "@/sprout/components/header";
import { InstallPrompt } from "@/sprout/components/install-prompt";
import { LogDetailSheet } from "@/sprout/components/log-detail-sheet";
import { LogSheet } from "@/sprout/components/log-sheet";
import { SettingsSheet } from "@/sprout/components/settings-sheet";
import { AccountView } from "@/sprout/components/views/account-view";
import { HistoryView } from "@/sprout/components/views/history-view";
import { MilestonesView } from "@/sprout/components/views/milestones-view";
import { TimelineView } from "@/sprout/components/views/timeline-view";
import { TrackerView } from "@/sprout/components/views/tracker-view";
import { TrendsView } from "@/sprout/components/views/trends-view";
import { useData } from "@/sprout/hooks/use-data";
import { useMounted } from "@/sprout/hooks/use-now";
import { useTimers, type FinishedTimer } from "@/sprout/hooks/use-timers";
import {
  defaultDraft,
  draftFromFinishedTimer,
  draftFromLog,
  type LogDraft,
} from "@/sprout/lib/forms";
import { clearInviteFromUrl, readInviteFromUrl } from "@/sprout/lib/share";
import type { ActiveView, Category, Log } from "@/sprout/lib/types";

export function SproutApp() {
  const mounted = useMounted();
  if (!mounted) return <AppSkeleton />;
  return <Shell />;
}

function Shell() {
  const { baby, babies, settings, theme, setTheme, addBaby, setActiveBaby } =
    useData();
  const { anyRunning } = useTimers();
  const [view, setView] = useState<ActiveView>("tracker");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [detailLog, setDetailLog] = useState<Log | null>(null);
  const [draft, setDraft] = useState<LogDraft | null>(null);
  const [editLogId, setEditLogId] = useState<string | null>(null);

  useEffect(() => {
    const invite = readInviteFromUrl();
    if (!invite) return;
    clearInviteFromUrl();
    if (
      typeof window === "undefined" ||
      !window.confirm(`Add ${invite.name} from this invite link?`)
    ) {
      return;
    }
    void (async () => {
      const existing = babies.find(
        (b) => b.name === invite.name && b.birthDate === invite.birthDate,
      );
      if (existing) {
        await setActiveBaby(existing.id);
      } else {
        const created = await addBaby({
          name: invite.name,
          birthDate: invite.birthDate,
          avatarEmoji: invite.avatarEmoji,
          sex: invite.sex,
        });
        await setActiveBaby(created.id);
      }
      setView("account");
    })();
  }, [babies, addBaby, setActiveBaby]);

  const openCategory = (category: Category) => {
    const next = defaultDraft(category, settings);
    if (category === "feed" && baby?.defaultBottleBrand) {
      next.details = { ...next.details, bottleBrand: baby.defaultBottleBrand };
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

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <Header
        baby={baby}
        theme={theme}
        timerActive={anyRunning}
        onOpenSettings={() => setSettingsOpen(true)}
        onCycleTheme={() =>
          void setTheme(
            theme === "light" ? "dark" : theme === "dark" ? "system" : "light",
          )
        }
      />

      <main key={view} className="flex-1 animate-fade-in px-4 pb-28 pt-4">
        {view === "tracker" ? (
          <TrackerView
            onSelectCategory={openCategory}
            onFinishedTimer={handleFinished}
            onOpenLog={setDetailLog}
            onVoiceDraft={openDraft}
          />
        ) : null}
        {view === "timeline" ? (
          <TimelineView onOpenLog={setDetailLog} />
        ) : null}
        {view === "history" ? (
          <HistoryView onOpenLog={setDetailLog} />
        ) : null}
        {view === "trends" ? (
          <TrendsView onAddMeasurement={() => openCategory("growth")} />
        ) : null}
        {view === "milestones" ? (
          <MilestonesView onAddMilestone={() => openCategory("milestone")} />
        ) : null}
        {view === "account" ? <AccountView /> : null}
      </main>

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
      />
      <InstallPrompt />
    </div>
  );
}
