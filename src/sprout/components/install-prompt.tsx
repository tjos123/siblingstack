"use client";

import { Download, Share, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/sprout/components/ui/button";
import { useData } from "@/sprout/hooks/use-data";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "sprout_install_dismissed";

function readDismissed() {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return true;
  }
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(readDismissed);
  const { logs } = useData();

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const standalone =
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches;
  const isIOS =
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !("MSStream" in window);

  if (standalone || dismissed || logs.length < 3) return null;
  if (!deferred && !isIOS) return null;

  const handleInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  return (
    <div
      className="fixed inset-x-0 z-40 mx-auto w-full max-w-md px-3 animate-slide-up"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 7.5rem)" }}
    >
      <div className="flex items-center gap-3 rounded-3xl border border-hairline bg-sprout-surface/95 p-3 shadow-lift backdrop-blur">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sage/15 text-sage-read">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">Install Sprout Baby</p>
          <p className="truncate text-[11px] text-muted">
            {deferred
              ? "Add it to your home screen for offline use"
              : "Tap Share then “Add to Home Screen”"}
          </p>
        </div>
        {deferred ? (
          <Button size="sm" variant="sage" onClick={handleInstall}>
            <Download className="h-4 w-4" /> Install
          </Button>
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sprout-surface-muted text-muted">
            <Share className="h-4 w-4" />
          </span>
        )}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={handleDismiss}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-muted hover:bg-sprout-surface-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}