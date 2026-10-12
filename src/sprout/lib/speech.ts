import { defaultDraft, setBottleAmount, withDuration } from "./forms";
import type { AppSettings } from "./types";

export interface SpeechCapabilities {
  supported: boolean;
  listen: (onResult: (text: string) => void, onInterim?: (text: string) => void) => () => void;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: {
    resultIndex: number;
    results: { length: number; [i: number]: { isFinal: boolean; [0]: { transcript: string } } };
  }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function speechCapabilities(): SpeechCapabilities {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return { supported: false, listen: () => () => undefined };
  return {
    supported: true,
    listen: (onResult, onInterim) => {
      const recognition = new Ctor();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          if (result.isFinal) onResult(transcript);
          else onInterim?.(transcript);
        }
      };
      recognition.onend = () => undefined;
      recognition.onerror = () => undefined;
      recognition.start();
      return () => {
        try {
          recognition.abort();
        } catch {
          /* ignore */
        }
      };
    },
  };
}

export function createVoiceDraft(
  text: string,
  settings: AppSettings,
  now = new Date(),
) {
  const lower = text.toLowerCase();
  const numbers = (
    text.match(/\d+(?:\.\d+)?/g) ?? []
  ).map((n) => Number(n));
  const first = numbers[0] ?? 0;
  const nowIso = now.toISOString();

  if (/(wet|dirty|poop|pee|diaper|nappy)/.test(lower)) {
    const draft = defaultDraft("diaper", settings);
    draft.startTime = nowIso;
    if (/dirty|poop/.test(lower) && /wet|pee/.test(lower)) {
      draft.subtype = "both";
      draft.diaperSubtype = "both";
    } else if (/dirty|poop/.test(lower)) {
      draft.subtype = "dirty";
      draft.diaperSubtype = "dirty";
    } else {
      draft.subtype = "wet";
      draft.diaperSubtype = "wet";
    }
    return draft;
  }

  if (/(breast|nurs|fed on the)/.test(lower) && !/ml|oz/.test(lower)) {
    const draft = defaultDraft("feed", settings);
    draft.feedSubtype = "breastfeeding";
    draft.subtype = "breastfeeding";
    draft.startTime = nowIso;
    return withDuration(draft, first || 10);
  }

  if (/(fed|bottle|formula)/.test(lower) && /(oz|ml)/.test(lower)) {
    const draft = defaultDraft("feed", settings);
    draft.feedSubtype = "bottlefeed";
    draft.subtype = "bottlefeed";
    draft.startTime = nowIso;
    const oz = /ml/.test(lower) ? first / 29.5735 : first;
    return setBottleAmount(draft, oz);
  }

  if (/(pump)/.test(lower)) {
    const draft = defaultDraft("pump", settings);
    draft.startTime = nowIso;
    draft.details = {
      ...draft.details,
      pumpLeftOz: first || 0,
      pumpRightOz: 0,
      pumpLeftMl: Math.round((first || 0) * 29.5735),
      durationMin: 15,
    };
    return draft;
  }

  if (/(sleep|slept|nap|asleep)/.test(lower)) {
    const draft = defaultDraft("sleep", settings);
    draft.startTime = new Date(now.getTime() - (first || 45) * 60000).toISOString();
    return withDuration(draft, first || 45);
  }

  if (/(solid|food|ate|puree)/.test(lower)) {
    const draft = defaultDraft("feed", settings);
    draft.feedSubtype = "solid";
    draft.subtype = "solid";
    draft.startTime = nowIso;
    draft.details = { ...draft.details, notes: text.trim() };
    return draft;
  }

  if (/(milestone|smile|laugh|roll|crawl|tooth|word|step)/.test(lower)) {
    const draft = defaultDraft("milestone", settings);
    draft.startTime = nowIso;
    draft.details = { ...draft.details, notes: text.trim() };
    return draft;
  }

  return null;
}