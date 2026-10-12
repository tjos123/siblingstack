"use client";

import { useEffect } from "react";

/**
 * The standalone Sprout app once registered a legacy worker at the origin root
 * ("/sw.js") with stale-while-revalidate for /_next/static/*, which could pin
 * old chunks. We defensively remove ONLY that legacy worker and its legacy
 * caches ("sprout-v1-*"). The tracker's own worker
 * ("/sprout-baby-tracker-sw.js") and its ("sprout-baby-*") caches are left
 * untouched so this coexists with it.
 */
export function SwCleanup() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          const scriptUrl =
            registration.active?.scriptURL ??
            registration.waiting?.scriptURL ??
            registration.installing?.scriptURL ??
            "";
          try {
            if (new URL(scriptUrl).pathname === "/sw.js") {
              void registration.unregister();
            }
          } catch {
            /* ignore malformed scriptURL */
          }
        });
      })
      .catch(() => undefined);

    if (typeof caches !== "undefined") {
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key.startsWith("sprout-v1-"))
              .map((key) => caches.delete(key)),
          ),
        )
        .catch(() => undefined);
    }
  }, []);

  return null;
}
