"use client";

import { useSyncExternalStore } from "react";
import {
  getServerTheme,
  readTheme,
  setTheme,
  subscribeTheme,
} from "@/lib/theme";
import { SunIcon, MoonIcon } from "@/components/icons";

/**
 * Light/dark switch.
 *
 * The theme itself is applied by the blocking script in the root layout; this
 * only reads it back and writes the visitor's choice. Reading through
 * useSyncExternalStore rather than useState means no setState-in-effect and no
 * hydration mismatch — React renders the server value, then swaps to the real
 * one once hydrated.
 */
export default function ThemeToggle({
  variant = "bar",
  solid = true,
}: {
  /** "bar" sits in the navbar; "menu" is the mobile menu row. */
  variant?: "bar" | "menu";
  /** False while the navbar is transparent over the hero video, where the
   *  button needs light-on-dark colours instead of the page ones. */
  solid?: boolean;
}) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    readTheme,
    getServerTheme
  );
  const isDark = theme === "dark";
  const next = isDark ? "light" : "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={() => setTheme(next)}
        className="flex items-center gap-2 rounded px-2 py-2 text-left text-sm font-medium text-ink transition hover:bg-surface"
      >
        {isDark ? (
          <SunIcon className="h-4 w-4" />
        ) : (
          <MoonIcon className="h-4 w-4" />
        )}
        {isDark ? "Light theme" : "Dark theme"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={label}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition hover:scale-110 ${
        solid
          ? "border-border-strong text-ink hover:border-gold hover:text-gold"
          : "border-cream/40 bg-black/25 text-cream backdrop-blur-sm hover:border-on-dark-accent hover:text-on-dark-accent"
      }`}
    >
      {isDark ? (
        <SunIcon className="h-4.5 w-4.5" />
      ) : (
        <MoonIcon className="h-4.5 w-4.5" />
      )}
    </button>
  );
}
