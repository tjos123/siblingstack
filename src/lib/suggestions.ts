// src/lib/suggestions.ts
//
// Deliberately rules-based, not AI-based, for v1 — cheap to run, free to
// call as often as you want, and the logic is auditable. The "smarter"
// part is real: it doesn't just restate the conflict, it gives a
// directional nudge (which kid's window to shift, and roughly by how
// much) based on which child's schedule is more flexible.
//
// A model-based version (e.g. calling the Anthropic API with both kids'
// recent event history) would be a reasonable v2 if this rules-based
// version proves the feature is actually used — see analytics.

import type { Child, ConflictWindow } from "@/types/models";
import { formatClockTime } from "@/lib/time";

const MINUTE = 60 * 1000;

function minutes(ms: number): number {
  return Math.round(ms / MINUTE);
}

export function suggestionFor(
  conflict: ConflictWindow,
  older: Child,
  younger: Child
): string {
  const durationMin = minutes(conflict.overlapEnd - conflict.overlapStart);
  const time = formatClockTime(conflict.overlapStart);

  // Heuristic: the younger child's schedule is generally the more
  // flexible one to nudge, since the older child is more likely to be
  // anchored to external constraints (meals, activities, the older
  // sibling's own developmental need for routine).
  const flexibleChild = younger;
  const anchorChild = older;

  if (conflict.type === "sleep") {
    return `${durationMin} min sleep overlap around ${time}. Try starting ${flexibleChild.name}'s nap 15–20 min earlier — ${anchorChild.name}'s timing looks like the more fixed anchor today.`;
  }

  if (conflict.type === "feed") {
    return `${durationMin} min feed overlap around ${time}. If it's workable, shifting ${flexibleChild.name}'s feed slightly later (or prepping ${anchorChild.name}'s ahead of time) can spread these out.`;
  }

  return `${durationMin} min overlap around ${time} for both kids.`;
}
