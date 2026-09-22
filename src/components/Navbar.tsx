"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
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
  const { account } = useAuth();
  const pathname = usePathname();
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

  // Close the mobile menu when the route changes. Adjusted during render
  // rather than in an effect, which avoids a frame with the menu still open.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  const solid = scrolled || open;

  /** Marks /menu active on /menu/s1 too, but never lets "/" match everything. */
  function isActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-border bg-bg/95 shadow-lg shadow-black/30 backdrop-blur-md"
          : "border-b border-transparent bg-linear-to-b from-black/55 via-black/20 to-transparent"
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
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`relative text-sm font-medium transition after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:bg-gold after:transition-all ${
                isActive(link.href)
                  ? "text-gold-soft after:w-full"
                  : "text-cream/80 after:w-0 hover:text-gold-soft hover:after:w-full"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/account"
            aria-current={isActive("/account") ? "page" : undefined}
            className={`hidden text-sm font-medium transition md:block ${
              isActive("/account")
                ? "text-gold-soft"
                : "text-cream/80 hover:text-gold-soft"
            }`}
          >
            {account ? account.name.split(" ")[0] : "Account"}
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
            aria-expanded={open}
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
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded px-2 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-surface text-gold-soft"
                  : "text-cream hover:bg-surface"
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/account"
            aria-current={isActive("/account") ? "page" : undefined}
            className={`rounded px-2 py-2 text-sm font-medium transition ${
              isActive("/account")
                ? "bg-surface text-gold-soft"
                : "text-cream hover:bg-surface"
            }`}
            onClick={() => setOpen(false)}
          >
            {account ? `${account.name.split(" ")[0]}'s Account` : "Account"}
          </Link>
        </div>
      )}
    </header>
  );
}
