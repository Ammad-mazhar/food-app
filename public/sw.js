/*
 * Service worker — offline support for static assets only.
 *
 * WHAT CHANGED AND WHY (v2):
 *
 * 1. NAVIGATIONS ARE NO LONGER CACHED. Every page is now server-rendered and
 *    carries session state (the navbar knows who you are). Serving a cached
 *    HTML shell alongside freshly-deployed JavaScript caused hydration
 *    mismatches — React #418/#441 — and could show a stale signed-in/out
 *    state. A page either comes from the network or, offline, falls back to
 *    /offline. Nothing in between.
 *
 * 2. ONLY PLAIN 200 RESPONSES ARE CACHED. cache.put() throws on a 206 Partial
 *    Content, which is exactly what a browser gets when it range-requests a
 *    video — and public/images holds several .mp4 files. Range requests are
 *    now skipped entirely and every response is checked before it is stored.
 *
 * Bumping CACHE_VERSION retires every older cache on the next activation,
 * which is what clears the bad entries from v1.
 */
const CACHE_VERSION = "tsh-v2";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      // Only the offline page is precached now. Precaching "/" or "/menu"
      // would store a server-rendered page, which is the thing we stopped
      // doing above.
      .then((cache) => cache.add(OFFLINE_URL))
      .catch(() => {
        // A failed precache must not block installation.
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/** Content-hashed or immutable files — safe to serve from cache indefinitely. */
function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/restaurant/") ||
    url.pathname === "/icon.svg"
  );
}

/** cache.put() rejects anything that isn't a complete, ordinary 200. */
function isCacheable(response) {
  return (
    response &&
    response.status === 200 &&
    response.type !== "opaque" &&
    // Belt and braces: a 206 is already excluded by the status check, but a
    // Content-Range header means partial content whatever the status says.
    !response.headers.has("Content-Range")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  // Range requests (video scrubbing, audio seeking) must go straight to the
  // network — their responses are partial and cannot be stored.
  if (request.headers.has("range")) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never intercept the API: those responses are per-session and per-request.
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    // Network only, with the offline page as the sole fallback.
    event.respondWith(
      fetch(request).catch(async () => {
        const offline = await caches.match(OFFLINE_URL);
        return (
          offline ||
          new Response("You are offline.", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          })
        );
      })
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (isCacheable(response)) {
            const copy = response.clone();
            caches
              .open(CACHE_VERSION)
              .then((cache) => cache.put(request, copy))
              // Storage full, or the response turned out unstorable — serving
              // the page matters more than caching it.
              .catch(() => {});
          }
          return response;
        });
      })
    );
  }
});
