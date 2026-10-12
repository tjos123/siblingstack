import { Sprout } from "lucide-react";

export function AppSkeleton() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6">
      <div className="flex h-16 w-16 animate-pulse-soft items-center justify-center rounded-3xl bg-sage/20 text-sage-read">
        <Sprout className="h-8 w-8" />
      </div>
      <div className="space-y-2 text-center">
        <p className="font-serif text-xl font-bold text-foreground">
          Sprout Baby
        </p>
        <p className="text-xs font-medium text-muted">Waking up your tracker…</p>
      </div>
    </div>
  );
}
