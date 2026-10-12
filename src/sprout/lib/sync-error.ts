// Pure helpers for turning sync failures into readable messages. Kept free of
// Supabase/IndexedDB imports so it can run in tests and anywhere else.
//
// Supabase/Postgrest errors are plain objects, some library errors are Error
// subclasses from another realm, and browser errors can be DOMExceptions — all
// of which may render as "[object Object]" or "{}". So we duck-type instead of
// relying on `instanceof Error`.

const MISSING_HINT =
  " Make sure migrations 006–008 are applied to your database.";

function hintIfMissing(detail: string): string {
  return /could not find the function|schema cache|does not exist|relation .* does not exist/i.test(
    detail,
  )
    ? `${detail}.${MISSING_HINT}`
    : detail;
}

export function describeSyncError(error: unknown): string {
  if (error == null) return "Sync failed";
  if (typeof error === "string") return hintIfMissing(error);
  if (typeof error !== "object") return String(error);

  const e = error as Record<string, unknown>;

  const detail = [e.message, e.error_description, e.details, e.hint, e.error]
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .join(" — ");
  if (detail) return hintIfMissing(detail);

  if (typeof e.code === "string" && e.code) return `Sync failed (${e.code})`;

  // DOMException and other native errors stringify nicely.
  const asString = String(error);
  if (asString && asString !== "[object Object]") return hintIfMissing(asString);

  try {
    const json = JSON.stringify(error);
    if (json && json !== "{}") return hintIfMissing(json);
  } catch {
    // fall through
  }

  return "Sync failed — see the browser console for details";
}
