"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  ReactNode,
} from "react";

import {
  INSTALL_DONE_EVENT,
  INSTALL_READY_EVENT,
  clearCapturedPrompt,
  readCapturedPrompt,
  type BeforeInstallPromptEvent,
} from "@/lib/install";

export type InstallPlatform = "ios" | "chromium" | "unsupported";

interface InstallContextValue {
  /** The browser has given us a prompt we can replay on demand. */
  canPrompt: boolean;
  /** Already running as an installed app, so there is nothing to offer. */
  isInstalled: boolean;
  /** Shapes the instructions shown when canPrompt is false. */
  platform: InstallPlatform;
  /**
   * False on a plain-HTTP origin that isn't localhost — which is exactly what a
   * phone gets when it opens the dev server at http://192.168.x.x:3000. No
   * browser will install a web app from there, or even register a service
   * worker, so this is usually the real answer to "why is the button dead on my
   * phone when it worked on my laptop".
   */
  isSecure: boolean;
  /** Opens the browser's own install sheet. Resolves once the user chooses. */
  promptInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
}

const InstallContext = createContext<InstallContextValue | undefined>(undefined);

function standalone(): boolean {
  if (typeof window.matchMedia === "function") {
    if (window.matchMedia("(display-mode: standalone)").matches) return true;
    if (window.matchMedia("(display-mode: fullscreen)").matches) return true;
    if (window.matchMedia("(display-mode: minimal-ui)").matches) return true;
  }
  return (
    "standalone" in window.navigator &&
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/*
 * Cached: getSnapshot must return a stable value or React re-renders without
 * end, and neither of these can change during a page's life.
 */
let installedCache: boolean | null = null;
let platformCache: InstallPlatform | null = null;
let secureCache: boolean | null = null;

function secureSnapshot(): boolean {
  if (secureCache === null) secureCache = window.isSecureContext === true;
  return secureCache;
}

/** Assume secure on the server; production is HTTPS and this only gates a hint. */
function serverSecure(): boolean {
  return true;
}

function installedSnapshot(): boolean {
  if (installedCache === null) installedCache = standalone();
  return installedCache;
}

function platformSnapshot(): InstallPlatform {
  if (platformCache === null) {
    const ua = window.navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(ua)) platformCache = "ios";
    // Chromium is the only engine that offers programmatic install. Whether the
    // event actually arrives is a separate question — canPrompt answers that.
    else if (/chrome|chromium|edg\//i.test(ua)) platformCache = "chromium";
    else platformCache = "unsupported";
  }
  return platformCache;
}

function serverInstalled(): boolean {
  return false;
}

function serverPlatform(): InstallPlatform {
  return "unsupported";
}

function subscribeNever(): () => void {
  return () => {};
}

/** Re-reads the stash whenever the inline script captures or clears a prompt. */
function subscribeInstall(onChange: () => void): () => void {
  window.addEventListener(INSTALL_READY_EVENT, onChange);
  window.addEventListener(INSTALL_DONE_EVENT, onChange);
  return () => {
    window.removeEventListener(INSTALL_READY_EVENT, onChange);
    window.removeEventListener(INSTALL_DONE_EVENT, onChange);
  };
}

/** No prompt exists during server rendering. */
function serverPrompt(): BeforeInstallPromptEvent | null {
  return null;
}

/**
 * One home for the install capability.
 *
 * beforeinstallprompt fires once per page load and its event can be used only
 * once, so two components listening independently would race for it and one
 * would silently never work. Everything that offers an install — the bar that
 * appears on its own, and the permanent button in the footer — reads from here.
 */
export function InstallProvider({ children }: { children: ReactNode }) {
  const detectedInstalled = useSyncExternalStore(
    subscribeNever,
    installedSnapshot,
    serverInstalled
  );
  const platform = useSyncExternalStore(
    subscribeNever,
    platformSnapshot,
    serverPlatform
  );
  const isSecure = useSyncExternalStore(
    subscribeNever,
    secureSnapshot,
    serverSecure
  );

  /*
   * The inline script in <head> owns the real listener, because Chrome fires
   * beforeinstallprompt before hydration — a listener added from React misses
   * it, and the button is then dead forever on a site that installs perfectly
   * well from Chrome's own menu.
   *
   * So this subscribes to the stash rather than to the browser event. The
   * captured event lives on `window`, so its reference is stable between
   * renders, which is what getSnapshot requires.
   */
  const deferred = useSyncExternalStore(
    subscribeInstall,
    readCapturedPrompt,
    serverPrompt
  );
  const [justInstalled, setJustInstalled] = useState(false);

  useEffect(() => {
    function onInstalled() {
      setJustInstalled(true);
    }
    window.addEventListener(INSTALL_DONE_EVENT, onInstalled);
    return () => window.removeEventListener(INSTALL_DONE_EVENT, onInstalled);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return "unavailable" as const;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    /*
     * The event is spent either way. Clearing the stash and announcing it is
     * what moves every consumer back to "no prompt available" — Chrome will
     * fire a fresh one later if the visitor declined and the site still
     * qualifies.
     */
    clearCapturedPrompt();
    window.dispatchEvent(new Event(INSTALL_READY_EVENT));
    return outcome;
  }, [deferred]);

  const value = useMemo<InstallContextValue>(
    () => ({
      canPrompt: deferred !== null,
      isInstalled: detectedInstalled || justInstalled,
      platform,
      isSecure,
      promptInstall,
    }),
    [deferred, detectedInstalled, justInstalled, platform, isSecure, promptInstall]
  );

  return (
    <InstallContext.Provider value={value}>{children}</InstallContext.Provider>
  );
}

export function useInstall(): InstallContextValue {
  const ctx = useContext(InstallContext);
  if (!ctx) throw new Error("useInstall must be used within an InstallProvider");
  return ctx;
}
