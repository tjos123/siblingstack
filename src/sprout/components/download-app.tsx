"use client";

import { Download, Smartphone } from "lucide-react";
import { useSyncExternalStore } from "react";
import { buttonVariants } from "@/sprout/components/ui/button";
import { Card } from "@/sprout/components/ui/card";
import { cn } from "@/sprout/lib/utils";

const APK_URL =
  process.env.NEXT_PUBLIC_ANDROID_APK_URL ??
  "/sprout-baby-tracker/sprout-baby-tracker.apk";

function subscribeStandalone(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => undefined;
  const query = window.matchMedia("(display-mode: standalone)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getStandalone() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(display-mode: standalone)").matches;
}

export function DownloadAppCard() {
  const standalone = useSyncExternalStore(subscribeStandalone, getStandalone, () => false);

  if (standalone) return null;

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ochre/20 text-ochre-read">
          <Smartphone className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">Get the Android app</p>
          <p className="text-[11px] font-medium text-muted">
            Install Sprout on your phone — it updates itself automatically.
          </p>
        </div>
      </div>
      <a
        href={APK_URL}
        download
        className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full")}
      >
        <Download className="h-4 w-4" />
        Download for Android
      </a>
    </Card>
  );
}
