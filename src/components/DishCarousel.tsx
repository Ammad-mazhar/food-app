"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, FlameIcon } from "./icons";

export type DishSlide = {
  kicker: string;
  title: string;
  text: string;
  price?: number;
  src: string;
  alt: string;
  href: string;
};

/**
 * Autoplaying image carousel for the homepage. Used twice: once for the
 * signature dishes, and once for photos of the dining room (where slides
 * carry no price).
 *
 * Slides crossfade rather than slide horizontally, so the underlying <Image>
 * elements never move — all slides are stacked and only the active one is
 * opaque. Autoplay stops while the pointer or keyboard focus is inside the
 * carousel, while the tab is hidden, and entirely under
 * `prefers-reduced-motion` (where it becomes a manual, button-driven
 * carousel instead).
 */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

/** On the server we can't know the preference; assume motion is fine and let
 *  hydration correct it. */
function getReducedMotionOnServer() {
  return false;
}

/** True when slide `i` is the active slide or sits either side of it, wrapping
 *  around the ends. Used to decide which slide images are worth mounting. */
function isNeighbour(i: number, index: number, count: number) {
  const gap = Math.abs(i - index);
  return Math.min(gap, count - gap) <= 1;
}

export default function DishCarousel({
  slides,
  interval = 5000,
  label = "Signature dishes",
  ctaLabel = "Order This",
}: {
  slides: readonly DishSlide[];
  interval?: number;
  /** Accessible name for the carousel region. */
  label?: string;
  ctaLabel?: string;
}) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer
  );
  const autoplay = !reducedMotion && count > 1;

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (!autoplay || paused) return;
    const id = window.setInterval(() => {
      // Browsers throttle rather than stop timers in a background tab, so
      // skip the tick instead of racing through slides nobody can see.
      if (document.hidden) return;
      setIndex((i) => (i + 1) % count);
    }, interval);
    return () => window.clearInterval(id);
  }, [autoplay, paused, count, interval]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;
    const delta = e.changedTouches[0].clientX - start;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) next();
    else prev();
  };

  const active = slides[index];

  return (
    <div
      className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-border bg-bg-elevated sm:h-[560px]"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          next();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          prev();
        }
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          {/* Every slide fills the container, so a stacked <Image> counts as
              in-viewport and lazy loading won't hold it back — rendering all
              of them would fetch the whole carousel on first paint. Only the
              current slide and its two neighbours are mounted; one step of
              lookahead is enough for the next image to be decoded before it
              fades in. */}
          {isNeighbour(i, index, count) && (
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 1024px, 100vw"
              className={`object-cover transition-transform duration-[6000ms] ease-out ${
                i === index ? "scale-105" : "scale-100"
              }`}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
        </div>
      ))}

      {/* Slide copy. Re-keyed per slide so the staggered entrance replays. */}
      <div className="relative z-10 flex h-full items-end">
        <div
          key={index}
          className="animate-hero w-full max-w-xl p-6 pb-20 sm:p-10 sm:pb-24"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-soft backdrop-blur-sm">
            <FlameIcon className="animate-flame h-3.5 w-3.5" />
            {active.kicker}
          </span>
          <h3 className="font-display text-3xl font-bold leading-tight text-cream drop-shadow-lg sm:text-4xl">
            {active.title}
          </h3>
          <p className="mt-3 max-w-md text-sm text-cream/85 drop-shadow sm:text-base">
            {active.text}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Link
              href={active.href}
              className="rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-cream shadow-lg shadow-ember/30 transition hover:scale-105 hover:bg-ember-soft active:scale-95"
            >
              {ctaLabel}
            </Link>
            {active.price !== undefined && (
              <span className="font-display text-lg font-bold text-gold-soft">
                {formatPrice(active.price)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Live region for screen readers, since autoplay changes content. */}
      <p className="sr-only" aria-live="polite">
        {`Slide ${index + 1} of ${count}: ${active.title}`}
      </p>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous dish"
        className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 bg-black/40 text-cream backdrop-blur-sm transition hover:scale-110 hover:bg-black/70 active:scale-95 sm:left-5"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next dish"
        className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 bg-black/40 text-cream backdrop-blur-sm transition hover:scale-110 hover:bg-black/70 active:scale-95 sm:right-5"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>

      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="flex items-center justify-center gap-2.5 pb-5">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${slide.title}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-7 bg-gold"
                  : "w-2 bg-cream/40 hover:bg-cream/70"
              }`}
            />
          ))}
        </div>
        {/* Autoplay progress bar — restarts with each slide via the key. */}
        {autoplay && (
          <div className="h-0.5 w-full bg-cream/10">
            <div
              key={index}
              className="animate-carousel-progress h-full bg-gold"
              style={{
                animationDuration: `${interval}ms`,
                animationPlayState: paused ? "paused" : "running",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
