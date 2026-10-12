"use client";

import { DataProvider } from "@/sprout/hooks/use-data";
import { SyncProvider } from "@/sprout/hooks/use-sync";
import { TimersProvider } from "@/sprout/hooks/use-timers";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <SyncProvider>
        <TimersProvider>{children}</TimersProvider>
      </SyncProvider>
    </DataProvider>
  );
}
