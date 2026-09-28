"use client";

import { useEffect } from "react";

/**
 * Registers the offline service worker.
 *
 * Normally production only: in dev, a worker caching static assets fights hot
 * reload and serves stale chunks after an edit.
 *
 * NEXT_PUBLIC_DEV_PWA=1 overrides that, because Chrome will not offer to
 * install an app that has no service worker with a fetch handler — so without
 * this escape hatch the install flow is untestable outside a real deploy. Use
 * `npm run dev:pwa`, which sets the flag and serves over HTTPS. Expect stale
 * assets while it is on; that is the trade, and it is why it is opt-in.
 */
const DEV_PWA = process.env.NEXT_PUBLIC_DEV_PWA === "1";

export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && !DEV_PWA) return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration fails on insecure origins and when the user has
        // disabled workers. The site works fine without it.
      });
    };

    // Registering after load keeps it off the critical path.
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
