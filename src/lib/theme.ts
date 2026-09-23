export type Theme = "light" | "dark";

export const THEME_KEY = "food-app:theme";
const THEME_EVENT = "food-app:theme-changed";

/**
 * Runs before first paint, inlined in the root layout's <head>.
 *
 * It has to be blocking and inline: if the theme were applied from React, a
 * visitor who chose night would get a full flash of paper first. Stored choice
 * wins, otherwise the OS preference decides, and anything unreadable falls back
 * to light rather than throwing (localStorage can be blocked entirely).
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_KEY
)});if(t!=="light"&&t!=="dark"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})()`;

/**
 * The live theme is whatever is on <html>, which the script above has already
 * set. Reading the DOM rather than storage keeps one source of truth and
 * returns a primitive, so useSyncExternalStore compares it cleanly.
 */
export function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

/** Matches the script's default so hydration starts from the same value. */
export function getServerTheme(): Theme {
  return "light";
}

export function subscribeTheme(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  // Keeps two open tabs in step.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function setTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // Private mode or blocked storage: the choice still applies to this page.
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}
