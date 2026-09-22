"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Drives the `.reveal` scroll-in animation defined in globals.css.
 *
 * Safety-first design: `.reveal` elements are visible by default. On
 * mount (and on every route change), any `.reveal` element that is
 * currently below the fold gets a `.reveal-pending` class (which is what
 * actually hides it), then an IntersectionObserver removes that class the
 * moment the element scrolls into view. Elements already on screen at
 * mount, browsers without IntersectionObserver, and people with
 * `prefers-reduced-motion` all just see the content immediately — nothing
 * ever renders as permanently hidden.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.reveal-visible)")
    );
    if (elements.length === 0) return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      return;
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const belowFold = elements.filter(
      (el) => el.getBoundingClientRect().top > viewportHeight * 0.92
    );
    belowFold.forEach((el) => el.classList.add("reveal-pending"));

    if (belowFold.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    belowFold.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
