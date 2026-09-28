"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { restaurantInfo } from "@/lib/restaurant";

const SEEN_KEY = "tsh_welcome_seen";

/* Circumference of the crest ring (r=170 in the 512 viewBox), so the gold
 * stroke can draw itself: 2 * PI * 170. */
const RING_LENGTH = 2 * Math.PI * 170;

/** How long the overlay stays up once it has finished animating. */
const FULL_DURATION = 2900;
const REDUCED_DURATION = 1100;
const FADE_OUT = 450;

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** True when running as an installed app rather than in a browser tab. */
function isStandalone(): boolean {
  if (typeof window.matchMedia === "function") {
    if (window.matchMedia("(display-mode: standalone)").matches) return true;
    // Android sometimes reports the app as fullscreen or minimal-ui instead.
    if (window.matchMedia("(display-mode: fullscreen)").matches) return true;
    if (window.matchMedia("(display-mode: minimal-ui)").matches) return true;
  }
  // iOS Safari predates display-mode and sets this instead.
  return (
    "standalone" in window.navigator &&
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function hasSeen(): boolean {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    // Private mode, or site data blocked. Better to show the welcome twice
    // than to crash the first launch.
    return false;
  }
}

function markSeen(): void {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Nothing to do — worst case it plays again next launch.
  }
}

/*
 * Whether to play is a question about the browser, not about React state, so it
 * goes through useSyncExternalStore like the other client-only reads in this
 * codebase. Deciding inside an effect would mean calling setState
 * synchronously in an effect body, which cascades a render and which this
 * project's lint rules reject.
 *
 * The answer is computed once and cached: getSnapshot must return a stable
 * value or React re-renders forever, and the answer genuinely cannot change
 * during a page's life.
 */
let decision: boolean | null = null;

function shouldPlaySnapshot(): boolean {
  if (decision !== null) return decision;

  const forced = new URLSearchParams(window.location.search).has("welcome");
  decision = forced || (isStandalone() && !hasSeen());
  return decision;
}

/** Nothing on the server: standalone mode is unknowable there. */
function serverSnapshot(): boolean {
  return false;
}

/** Never changes after load, so there is nothing to subscribe to. */
function subscribe(): () => void {
  return () => {};
}

/**
 * The first thing you see after installing the app.
 *
 * Deliberately narrow: it plays when the app is running standalone AND has
 * never played before. A regular visit in a browser tab never triggers it, and
 * neither does the second launch — a splash you cannot get rid of is the
 * fastest way to make an app feel cheap.
 *
 * Add ?welcome=1 to any URL to replay it while working on it.
 */
export default function WelcomeOverlay() {
  const shouldPlay = useSyncExternalStore(
    subscribe,
    shouldPlaySnapshot,
    serverSnapshot
  );
  const [finished, setFinished] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!shouldPlay) return;

    // Written on play, not on dismissal: if the app is closed mid-animation the
    // welcome has still been seen, and replaying it would be worse than missing
    // the tail of it.
    markSeen();

    const hold = prefersReducedMotion() ? REDUCED_DURATION : FULL_DURATION;

    // setState inside a timer callback is asynchronous, so it does not cascade
    // the way a synchronous call in this effect's body would.
    const toLeaving = window.setTimeout(() => setLeaving(true), hold);
    const toGone = window.setTimeout(() => setFinished(true), hold + FADE_OUT);

    return () => {
      window.clearTimeout(toLeaving);
      window.clearTimeout(toGone);
    };
  }, [shouldPlay]);

  if (!shouldPlay || finished) return null;

  function dismiss() {
    setLeaving(true);
    window.setTimeout(() => setFinished(true), FADE_OUT);
  }

  return (
    /*
     * role="status" rather than a dialog: it steals no focus and traps nothing,
     * because it is a greeting that leaves on its own, not something to
     * interact with. Anyone who taps gets rid of it early.
     */
    <div
      role="status"
      aria-label={`Welcome to ${restaurantInfo.name}`}
      onClick={dismiss}
      /*
       * Sized in vmin rather than at breakpoints so it adapts to the short axis
       * whichever way the phone is held — a fixed height that fits portrait
       * overflows a 375px-tall landscape screen, and this overlay cannot
       * scroll. clamp() keeps it sane on a tiny phone and on a desktop window.
       */
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center gap-[clamp(1.25rem,4vmin,2rem)] overflow-hidden bg-bg px-6 py-8 ${
        leaving ? "welcome-leaving" : ""
      }`}
    >
      <div className="relative flex items-center justify-center">
        {/*
         * The ember bloom sits behind the crest and never intercepts a tap.
         * A radial gradient rather than a blurred circle: this element scales
         * and fades at the same time, and a large blur is re-rasterised every
         * frame, which is exactly the kind of thing that stutters on the phone
         * that has just finished installing the app.
         */}
        <span
          aria-hidden
          className="welcome-ember pointer-events-none absolute h-[clamp(8rem,38vmin,15rem)] w-[clamp(8rem,38vmin,15rem)] rounded-full bg-[radial-gradient(circle,var(--color-ember)_0%,transparent_70%)]"
        />

        <svg
          viewBox="0 0 512 512"
          className="relative h-[clamp(5.5rem,26vmin,11rem)] w-[clamp(5.5rem,26vmin,11rem)]"
          aria-hidden
        >
          <circle
            cx="256"
            cy="256"
            r="170"
            fill="none"
            stroke="#c9a24b"
            strokeWidth="14"
            strokeLinecap="round"
            className="welcome-ring"
            /* Starts the stroke at 12 o'clock instead of 3. */
            transform="rotate(-90 256 256)"
            style={{ "--crest-length": RING_LENGTH } as React.CSSProperties}
          />
          <path
            d="M256 120c24 66-48 88-48 154a80 80 0 0 0 160 0c0-24-12-48-24-68 48 24 72 96 72 140a136 136 0 0 1-272 0c0-90 48-140 112-226z"
            fill="#b3432b"
            transform="translate(0 16) scale(0.78) translate(72 40)"
            className="welcome-flame"
          />
        </svg>
      </div>

      <div className="welcome-copy flex flex-col items-center gap-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Howdy
        </p>
        <h1 className="font-display text-[clamp(1.5rem,7vmin,2.25rem)] font-bold leading-tight text-ink">
          {restaurantInfo.name}
        </h1>
        <p className="max-w-xs text-balance text-sm text-muted">
          {restaurantInfo.tagline}
        </p>
      </div>
    </div>
  );
}
