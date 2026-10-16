"use client";

import { DataProvider } from "@/sprout/hooks/use-data";
import { SyncProvider } from "@/sprout/hooks/use-sync";
import { TimersProvider } from "@/sprout/hooks/use-timers";
import { ToastProvider } from "@/sprout/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <SyncProvider>
        <TimersProvider>
          <ToastProvider>{children}</ToastProvider>
        </TimersProvider>
      </SyncProvider>
    </DataProvider>
  );
}
