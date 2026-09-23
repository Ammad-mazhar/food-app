"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { bookingPhone } from "@/lib/restaurant";
import {
  CalendarIcon,
  CloseIcon,
  PhoneIcon,
  FlameIcon,
} from "@/components/icons";

/**
 * Floating action hub, pinned bottom-right on every page. Collapsed it's a
 * single button; expanded it offers the two things a hungry visitor wants
 * fastest — book a table, or just call.
 *
 * Hidden on the booking page itself, where both actions are already the
 * main content.
 */
export default function FloatingHub() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  // Collapse on route change, so the hub never travels open into a new page.
  // Adjusted during render rather than in an effect — React's recommended
  // way to reset state when a value changes, and it avoids a second paint
  // with the menu still open.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  if (pathname === "/book-table") return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
    >
      {/* Actions. Kept mounted so the collapse animates out too; pointer
          events and tab order are removed while collapsed. */}
      <div
        id="floating-hub-actions"
        className={`flex flex-col items-end gap-3 transition-all duration-300 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <Link
          href="/book-table"
          tabIndex={open ? undefined : -1}
          aria-hidden={!open}
          className="flex items-center gap-3 rounded-full border border-border-strong bg-surface/95 py-2.5 pl-5 pr-2.5 text-sm font-semibold text-ink shadow-xl shadow-black/40 backdrop-blur-md transition hover:scale-105 hover:bg-surface-hover active:scale-95"
        >
          Book a Table
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ember text-cream">
            <CalendarIcon className="h-4.5 w-4.5" />
          </span>
        </Link>

        <a
          href={bookingPhone.href}
          tabIndex={open ? undefined : -1}
          aria-hidden={!open}
          className="flex items-center gap-3 rounded-full border border-border-strong bg-surface/95 py-2.5 pl-5 pr-2.5 text-sm font-semibold text-ink shadow-xl shadow-black/40 backdrop-blur-md transition hover:scale-105 hover:bg-surface-hover active:scale-95"
        >
          <span className="flex flex-col items-end leading-tight">
            <span className="text-[0.65rem] font-medium uppercase tracking-wider text-muted">
              Call to reserve
            </span>
            <span className="tabular-nums">{bookingPhone.display}</span>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-bg">
            <PhoneIcon className="h-4.5 w-4.5" />
          </span>
        </a>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="floating-hub-actions"
        aria-label={open ? "Close reservation menu" : "Book a table or call us"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ember text-cream shadow-xl shadow-ember/40 transition hover:scale-110 hover:bg-ember-soft active:scale-95"
      >
        {open ? (
          <CloseIcon className="h-6 w-6" />
        ) : (
          <FlameIcon className="animate-flame h-6 w-6" />
        )}
      </button>
    </div>
  );
}
