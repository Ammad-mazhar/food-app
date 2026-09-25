"use client";

import { useEffect } from "react";

/**
 * Registers the offline service worker.
 *
 * Only in production: in dev, a worker caching the shell fights hot reload and
 * serves stale pages after edits.
 */
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
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
