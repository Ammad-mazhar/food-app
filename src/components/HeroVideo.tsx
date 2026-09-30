"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

/**
 * The homepage banner: a looping video on a connection that can afford it, and
 * the still poster on one that can't.
 *
 * WHY THIS EXISTS. The banner video is 2.9 MB and the element carried both
 * `autoPlay` and `preload="none"`. Those contradict each other and autoplay
 * wins — a browser cannot start playing without fetching, so every visitor
 * downloaded the whole file. It was over half the homepage's ~4.5 MB first
 * load, paid on mobile data, for decoration behind a headline.
 *
 * The poster is 69 KB. On a phone that is a 40x saving for a banner nobody
 * visits the site to watch.
 *
 * Deliberately NOT a CSS media query: `<video>` fetches whether or not it is
 * visible, so hiding it with `hidden md:block` would still cost the download.
 * The element has to be absent from the DOM entirely.
 */
export default function HeroVideo({
  src,
  poster,
  posterAlt,
  className = "",
}: {
  src: string;
  poster: string;
  posterAlt: string;
  className?: string;
}) {
  const playVideo = useSyncExternalStore(
    subscribeNever,
    shouldPlaySnapshot,
    serverSnapshot
  );

  if (!playVideo) {
    return (
      <Image
        src={poster}
        alt={posterAlt}
        fill
        priority
        sizes="100vw"
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <video
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

/*
 * Decided once and cached. getSnapshot must return a stable value or React
 * re-renders without end, and none of these inputs change meaningfully within
 * a page view.
 */
let decision: boolean | null = null;

function shouldPlaySnapshot(): boolean {
  if (decision !== null) return decision;

  // Someone who asked for less motion should not be served an autoplaying loop,
  // and should not pay for it either.
  const reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Phones and small tablets: the banner is mostly covered by the headline
  // scrim at this size anyway.
  const bigEnough =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(min-width: 768px)").matches;

  /*
   * Chromium exposes the Network Information API; Safari and Firefox do not, in
   * which case the screen-size test alone decides. Data Saver is an explicit
   * request not to spend the user's money.
   */
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  const thriftyConnection =
    connection?.saveData === true ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "slow-2g";

  decision = bigEnough && !reduceMotion && !thriftyConnection;
  return decision;
}

/**
 * The server cannot know the screen or the connection. Returning false means
 * the poster is what gets prerendered, so the cached HTML is the cheap variant
 * and only capable clients upgrade to video after hydration.
 */
function serverSnapshot(): boolean {
  return false;
}

function subscribeNever(): () => void {
  return () => {};
}
