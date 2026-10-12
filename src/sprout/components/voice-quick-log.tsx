"use client";

import { useCallback, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/sprout/components/ui/button";
import { useData } from "@/sprout/hooks/use-data";
import { createVoiceDraft, speechCapabilities } from "@/sprout/lib/speech";
import type { LogDraft } from "@/sprout/lib/forms";
import { cn } from "@/sprout/lib/utils";

export function VoiceQuickLogButton({
  onParsed,
  onUnrecognized,
  className,
}: {
  onParsed: (draft: LogDraft) => void;
  onUnrecognized?: () => void;
  className?: string;
}) {
  const { settings } = useData();
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [supported] = useState(() => speechCapabilities().supported);
  const cancelRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = null;
    setListening(false);
  }, []);

  const start = useCallback(() => {
    setMessage(null);
    const caps = speechCapabilities();
    if (!caps.supported) {
      setMessage("Voice logging isn’t supported in this browser.");
      return;
    }
    setListening(true);
    cancelRef.current = caps.listen(
      (finalText) => {
        setListening(false);
        cancelRef.current = null;
        if (!finalText) return;
        const draft = createVoiceDraft(finalText, settings);
        if (draft) {
          onParsed(draft);
        } else {
          setMessage(`Hmm — could you phrase that differently?`);
          onUnrecognized?.();
        }
      },
      (interim) => {
        if (interim) setMessage(interim);
      },
    );
  }, [settings, onParsed, onUnrecognized]);

  return (
    <div className={cn("flex items-center justify-between gap-3 px-1", className)}>
      <div className="min-w-0">
        <p className="font-serif text-sm font-bold text-foreground">Voice quick-log</p>
        <p className="truncate text-[11px] font-medium text-muted">
          {listening
            ? message ?? "Listening…"
            : message ?? "“Fed 4 oz”, “wet diaper”, “slept 90 minutes”"}
        </p>
      </div>
      {listening ? (
        <Button size="iconSm" variant="accent" onClick={stop} aria-label="Stop listening">
          <span className="relative mr-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <MicOff className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          size="iconSm"
          variant={supported ? "soft" : "ghost"}
          disabled={!supported}
          onClick={start}
          aria-label="Voice log"
        >
          <Mic className={cn("h-4 w-4", supported && "text-terracotta")} />
        </Button>
      )}
    </div>
  );
}