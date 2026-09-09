"use client";

import { useRef, useState } from "react";
import { Mic, Sparkles, Send } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { logEvent } from "@/lib/db/events";
import { parseNaturalLog } from "@/lib/nl-log-parser";
import { track } from "@/lib/analytics";
import type { Child } from "@/types/models";

interface Props {
  childProfiles: Child[];
  householdId: string;
  onLogged: () => void;
}

export default function AiQuickLog({ childProfiles, householdId, onLogged }: Props) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "empty" | "unknown">("idle");
  const recognitionRef = useRef<any>(null);

  const childNames = childProfiles.map((c) => c.name);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;

    const parsed = parseNaturalLog(text, childNames);
    setStatus("idle");

    if (!parsed || parsed.childIndex === null) {
      if (parsed) {
        track("ai_log_selected_child", { count: childProfiles.length });
        window.alert("Whose log was that? Try including a name, e.g. \"Maya napped 2–3pm\".");
      }
      setStatus("unknown");
      return;
    }

    const child = childProfiles[parsed.childIndex];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const startTime = now.getTime() + parsed.startMinuteOfDay * 60_000;

    let endTime: number | null = null;
    if (parsed.endMinuteOfDay !== null) {
      endTime = now.getTime() + parsed.endMinuteOfDay * 60_000;
    }

    try {
      await logEvent(householdId, {
        childId: child.id,
        type: parsed.type,
        startTime,
        endTime,
        notes: parsed.notes,
        createdBy: user.id,
      });
      track("ai_log_created", { type: parsed.type });
      setText("");
      setStatus("success");
      onLogged();
    } catch {
      setStatus("unknown");
    }
  }

  function handleListen() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      window.alert("Voice dictation isn't supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results?.[0]?.[0]?.transcript ?? "";
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.start();
    setListening(true);
  }

  const statusText =
    status === "success"
      ? "✓ Logged"
      : status === "unknown"
      ? "Couldn't parse that — try \"Maya napped 2-3pm\""
      : status === "empty"
      ? "Add a name so we know which kid"
      : "Try \"Leo napped 2–3pm\" or \"Maya bottle 30ml at 9:15\"";

  return (
    <div className="bg-surface rounded-md p-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={15} className="text-childB" />
        <p className="text-sm text-ink">AI Quick Log</p>
        <span className="text-[10px] font-mono uppercase tracking-wider text-childB bg-childB/10 rounded-full px-2 py-0.5">
          Pro
        </span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <button
          type="button"
          onClick={handleListen}
          className={`shrink-0 rounded-md p-2.5 border transition-colors ${
            listening
              ? "bg-conflict text-bg border-conflict"
              : "border-childB text-childB hover:bg-childB/10"
          }`}
          aria-label="Voice dictation"
        >
          <Mic size={16} />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Say or type it, e.g. "Maya napped 2-3pm"'
          className="flex-1 bg-bg border border-surface2 rounded-md px-3 py-2 text-sm text-ink outline-none focus:border-childA"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="shrink-0 rounded-md bg-childA text-bg px-3 py-2 disabled:opacity-40"
          aria-label="Parse and log"
        >
          <Send size={15} />
        </button>
      </form>
      <p className={`text-xs mt-2 ${status === "unknown" ? "text-conflict" : "text-ink-muted"}`}>
        {statusText}
      </p>
    </div>
  );
}