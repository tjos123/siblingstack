/*
 * Sprout Baby Tracker service worker (root scope).
 *
 * The tracker lives at /sprout-baby-tracker on a shared site. A worker scoped
 * to that directory could not serve Next's immutable build assets, which live
 * at /_next/static/* (outside the tracker path), so offline navigation would
 * break. This worker therefore registers at the origin root but only *acts* on
 * tracker routes and on hashed build assets; every other request is left to the
 * browser (no respondWith), so the rest of the site is untouched.
 *
 * Network-first for tracker navigations (offline falls back to the cached
 * shell); cache-first for tracker icons/manifest; stale-while-revalidate for
 * content-hashed /_next/static assets (safe: filenames change every build).
 */

const VERSION = "sprout-baby-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const STATIC_CACHE = `${VERSION}-static`;

const TRACKER_BASE = "/sprout-baby-tracker";
const TRACKER_SHELL = "/sprout-baby-tracker";
const PRECACHE = [
  TRACKER_SHELL,
  `${TRACKER_BASE}/manifest.webmanifest`,
  `${TRACKER_BASE}/icons/icon-192.png`,
  `${TRACKER_BASE}/icons/icon-512.png`,
  `${TRACKER_BASE}/icons/apple-touch-icon.png`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("sprout-baby-") && !key.startsWith(VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

function isTrackerPath(pathname) {
  return pathname === TRACKER_BASE || pathname.startsWith(`${TRACKER_BASE}/`);
}

function isImmutableAsset(pathname) {
  return (
    pathname.startsWith("/_next/static/") || pathname.startsWith("/_next/image")
  );
}

function putSilently(cache, key, response) {
  if (!response || response.status !== 200 || response.type === "opaque") {
    return Promise.resolve();
  }
  return cache.put(key, response.clone()).catch(() => undefined);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const tracker = isTrackerPath(url.pathname);

  if (request.mode === "navigate" && tracker) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          caches
            .open(SHELL_CACHE)
            .then((cache) => putSilently(cache, TRACKER_SHELL, response));
          return response;
        })
        .catch(async () => {
          const cached =
            (await caches.match(request, { ignoreSearch: true })) ||
            (await caches.match(TRACKER_SHELL, { ignoreSearch: true }));
          return cached || Response.error();
        }),
    );
    return;
  }

  const isTrackerIcon =
    tracker && (url.pathname.includes("/icons/") || url.pathname.endsWith(".webmanifest"));
  if (isTrackerIcon) {
    event.respondWith(
      caches.open(SHELL_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          putSilently(cache, request, response);
          return response;
        } catch {
          return Response.error();
        }
      }),
    );
    return;
  }

  if (isImmutableAsset(url.pathname)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            putSilently(cache, request, response);
            return response;
          })
          .catch(() => undefined);
        return cached || network || Response.error();
      }),
    );
    return;
  }

  // Everything else: leave to the browser.
});
