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

/**
 * Not in TypeScript's DOM lib because it is a Chromium extension to the spec
 * rather than a standard. Firefox and Safari never fire it.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

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

  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [justInstalled, setJustInstalled] = useState(false);

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      // Without this, Chrome may show nothing at all; we are taking over
      // responsibility for asking. setState is fine here — this runs from an
      // event, not synchronously in the effect body.
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    }

    function onInstalled() {
      setDeferred(null);
      setJustInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return "unavailable" as const;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    // The event is spent either way; Chrome will fire a fresh one later if the
    // visitor declined and the site still qualifies.
    setDeferred(null);
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
