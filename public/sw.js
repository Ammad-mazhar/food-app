/*
 * Service worker for offline support.
 *
 * Strategy is deliberately conservative:
 *   - Navigations: network first, falling back to the cached shell, then to
 *     /offline. A menu that is quietly out of date is worse than a slow one.
 *   - Static assets (_next/static, images, fonts): cache first — they are
 *     content-hashed, so a cached copy is never stale.
 *   - Everything else (including anything non-GET): straight to the network.
 *
 * Bump CACHE_VERSION to retire old caches on the next activation.
 */
const CACHE_VERSION = "tsh-v1";
const PRECACHE = [`/`, `/menu`, `/offline`, `/icon.svg`];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      // Individual failures shouldn't abort the whole install.
      .then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/restaurant/") ||
    url.pathname === "/icon.svg"
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || (await caches.match("/offline")) || Response.error();
        })
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
            return response;
          })
      )
    );
  }
});
