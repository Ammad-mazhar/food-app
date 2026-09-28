/**
 * Catching the install prompt before React exists.
 *
 * THE BUG THIS FIXES: Chrome fires `beforeinstallprompt` very early — often
 * before hydration finishes. A listener added inside a useEffect attaches too
 * late, the event has already been and gone, and the app can never offer an
 * install. The button looks dead for no visible reason, on a site that is
 * perfectly installable. (Chrome's own address-bar install still works, which
 * is what makes it so confusing to diagnose.)
 *
 * So the listener has to exist before any of our React code runs, which means
 * an inline script in <head> — the same reason THEME_INIT_SCRIPT is inlined.
 * It stashes the event on window; React picks it up on mount.
 */

/** Where the inline script parks the captured event. */
export const INSTALL_EVENT_KEY = "__tshInstallPrompt";

/** Dispatched when the script captures one, so React can stop waiting. */
export const INSTALL_READY_EVENT = "food-app:install-ready";

/** Dispatched on `appinstalled`, captured equally early. */
export const INSTALL_DONE_EVENT = "food-app:install-done";

/*
 * preventDefault() stops Chrome showing its own mini-infobar and, crucially,
 * keeps the event usable later — without it the prompt is spent.
 */
export const INSTALL_INIT_SCRIPT = `(function(){try{
window.addEventListener("beforeinstallprompt",function(e){
e.preventDefault();
window[${JSON.stringify(INSTALL_EVENT_KEY)}]=e;
window.dispatchEvent(new Event(${JSON.stringify(INSTALL_READY_EVENT)}));
});
window.addEventListener("appinstalled",function(){
window[${JSON.stringify(INSTALL_EVENT_KEY)}]=null;
window.dispatchEvent(new Event(${JSON.stringify(INSTALL_DONE_EVENT)}));
});
}catch(e){}})()`;

/** The Chromium-only event, which TypeScript's DOM lib does not describe. */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Whatever the inline script has captured so far, if anything. */
export function readCapturedPrompt(): BeforeInstallPromptEvent | null {
  if (typeof window === "undefined") return null;
  const stashed = (window as unknown as Record<string, unknown>)[
    INSTALL_EVENT_KEY
  ];
  return (stashed as BeforeInstallPromptEvent) ?? null;
}

export function clearCapturedPrompt(): void {
  if (typeof window === "undefined") return;
  (window as unknown as Record<string, unknown>)[INSTALL_EVENT_KEY] = null;
}
