// Which household an account is "in" when they belong to more than one — e.g.
// someone who has their own household and then joins a partner's via an invite
// link. PostgREST returns the membership rows in unspecified order, so blindly
// taking householdIds[0] can land on the wrong one (and silently sync to the
// wrong household). Joining an invite records the target household here, and
// the selection prefers it while the user is still a member.

const ACTIVE_HOUSEHOLD_KEY = "active_household_id";

// Pure selection so it can be unit-tested without a browser or Supabase.
export function pickHouseholdId(
  ids: string[],
  preferred: string | null,
): string | null {
  if (preferred && ids.includes(preferred)) return preferred;
  return ids[0] ?? null;
}

export function getActiveHousehold(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ACTIVE_HOUSEHOLD_KEY);
  } catch {
    return null;
  }
}

export function setActiveHousehold(id: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (id) window.localStorage.setItem(ACTIVE_HOUSEHOLD_KEY, id);
    else window.localStorage.removeItem(ACTIVE_HOUSEHOLD_KEY);
  } catch {
    /* storage unavailable */
  }
}
