"use client";

import { useState, useSyncExternalStore } from "react";
import { useInstall } from "@/context/InstallContext";

const DISMISSED_KEY = "tsh_install_dismissed";

/*
 * Read once and cached, through useSyncExternalStore: touching localStorage
 * during render is impure, and getSnapshot must return a stable value or React
 * re-renders without end.
 */
let dismissedCache: boolean | null = null;

function wasDismissedSnapshot(): boolean {
  if (dismissedCache === null) {
    try {
      dismissedCache = window.localStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      dismissedCache = false;
    }
  }
  return dismissedCache;
}

/** The server cannot know what this visitor dismissed. */
function serverDismissed(): boolean {
  return false;
}

function subscribeNever(): () => void {
  return () => {};
}

function rememberDismissed(): void {
  dismissedCache = true;
  try {
    window.localStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    // Site data blocked. The bar reappears next visit; not worth more than this.
  }
}

/**
 * The bar that offers an install without being asked.
 *
 * Its permanent counterpart lives in the footer (InstallAppButton) and never
 * goes away; this one is the nudge, so dismissing it is remembered. Both read
 * the same capability from InstallContext, because beforeinstallprompt fires
 * once and its event can only be replayed once — two independent listeners
 * would race and one would quietly stop working.
 *
 * iOS fires no such event, so there it carries instructions rather than a
 * button.
 */
export default function InstallPrompt() {
  const { canPrompt, isInstalled, platform, promptInstall } = useInstall();
  const alreadyDismissed = useSyncExternalStore(
    subscribeNever,
    wasDismissedSnapshot,
    serverDismissed
  );
  const [dismissed, setDismissed] = useState(false);

  const iosHint = platform === "ios" && !isInstalled;

  if (dismissed || alreadyDismissed || isInstalled || (!canPrompt && !iosHint)) {
    return null;
  }

  function close() {
    setDismissed(true);
    rememberDismissed();
  }

  async function install() {
    const outcome = await promptInstall();
    if (outcome !== "accepted") close();
  }

  return (
    /*
     * On phones this sits ABOVE the FloatingHub and spans the width. Squeezing
     * it beside the hub left roughly 260px for a title, a button and a close
     * control, which crushed the text.
     *
     * From sm: up there is room alongside, so it returns to a compact bar on
     * the left. z-30 keeps it under the hub's z-40 either way, and the
     * safe-area margin keeps it off the iPhone home indicator in standalone.
     */
    <div
      role="complementary"
      aria-label="Install this app"
      className="animate-install-bar fixed inset-x-4 bottom-24 z-30 mb-[env(safe-area-inset-bottom)] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-md"
    >
      <div className="flex items-center gap-3 rounded-xl border border-border-strong bg-surface/95 p-3 shadow-lg backdrop-blur-sm">
        <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-192.png" alt="" className="h-full w-full" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Install Texas Steak House</p>
          <p className="truncate text-xs text-muted">
            {canPrompt
              ? "Order faster, and browse the menu offline"
              : "Tap Share, then Add to Home Screen"}
          </p>
        </div>

        {canPrompt && (
          <button
            onClick={install}
            className="shrink-0 rounded-lg bg-ember px-4 py-2 text-sm font-semibold text-cream transition hover:bg-ember-soft active:scale-95"
          >
            Install
          </button>
        )}

        <button
          onClick={close}
          aria-label="Dismiss install prompt"
          className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-field hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
