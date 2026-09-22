"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { restaurantInfo } from "@/lib/restaurant";
import { FlameIcon } from "@/components/icons";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About Us" },
  { href: "/book-table", label: "Book a Table" },
  { href: "/orders", label: "My Orders" },
  { href: "/reservations", label: "My Reservations" },
];

export default function Navbar() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-border bg-bg/95 shadow-lg shadow-black/30 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-black/55 via-black/20 to-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-surface/80 text-gold backdrop-blur-sm">
            <FlameIcon className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-wide text-cream">
            {restaurantInfo.name}
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-cream/80 transition hover:text-gold-soft"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="hidden text-sm font-medium text-cream/80 transition hover:text-gold-soft md:block"
          >
            Account
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 rounded-full bg-ember px-4 py-2 text-sm font-semibold text-cream shadow-md shadow-black/30 transition hover:scale-105 hover:bg-ember-soft active:scale-95"
          >
            Cart
            {itemCount > 0 && (
              <span
                key={itemCount}
                className="animate-badge-pop absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-bg"
              >
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="rounded-md border border-border-strong/70 bg-bg/30 px-2 py-2 text-sm text-cream backdrop-blur-sm md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur-md md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-2 py-2 text-sm font-medium text-cream hover:bg-surface"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/account"
            className="rounded px-2 py-2 text-sm font-medium text-cream hover:bg-surface"
            onClick={() => setOpen(false)}
          >
            Account
          </Link>
        </div>
      )}
    </header>
  );
}
