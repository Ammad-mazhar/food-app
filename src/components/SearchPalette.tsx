"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { menuItems } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { SearchIcon } from "@/components/icons";

const OPEN_EVENT = "food-app:open-search";

const PAGES = [
  { label: "Menu", href: "/menu" },
  { label: "Book a Table", href: "/book-table" },
  { label: "My Orders", href: "/orders" },
  { label: "My Reservations", href: "/reservations" },
  { label: "Favourites", href: "/favourites" },
  { label: "About Us", href: "/about" },
  { label: "My Account", href: "/account" },
  { label: "Cart", href: "/cart" },
];

type Result =
  | { kind: "dish"; id: string; label: string; sub: string; href: string; image?: string }
  | { kind: "page"; id: string; label: string; sub: string; href: string; image?: undefined };

/**
 * Cmd/Ctrl+K palette for jumping to a dish or page.
 *
 * Opening is a keyboard shortcut plus the navbar button; the dialog itself is
 * a plain focus-trapped overlay rather than a library, since it only ever has
 * one input and one list.
 */
export default function SearchPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function close() {
    setOpen(false);
    setQuery("");
    setActive(0);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    // Named handler so it can actually be removed again.
    function onOpenRequest() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpenRequest);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpenRequest);
    };
  }, []);

  // Focus on open. A DOM side effect with no setState, so it belongs here.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();

    const dishes: Result[] = menuItems
      .filter(
        (i) =>
          !q ||
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map((i) => ({
        kind: "dish",
        id: i.id,
        label: i.name,
        sub: `${i.category} · ${formatPrice(i.price)}`,
        href: `/menu/${i.id}`,
        image: i.image,
      }));

    const pages: Result[] = PAGES.filter(
      (p) => !q || p.label.toLowerCase().includes(q)
    ).map((p) => ({
      kind: "page",
      id: p.href,
      label: p.label,
      sub: "Page",
      href: p.href,
    }));

    return [...dishes, ...pages].slice(0, 10);
  }, [query]);

  function go(href: string) {
    close();
    router.push(href);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <SearchIcon className="h-5 w-5 shrink-0 text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                go(results[active].href);
              }
            }}
            placeholder="Search dishes and pages…"
            aria-label="Search dishes and pages"
            className="w-full bg-transparent py-4 text-ink placeholder:text-faint focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-border-strong px-1.5 py-0.5 text-[10px] text-faint sm:block">
            Esc
          </kbd>
        </div>

        {results.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-faint">
            Nothing matches that. Try a dish name or a category.
          </p>
        ) : (
          <ul className="max-h-[50vh] overflow-y-auto py-2">
            {results.map((r, i) => (
              <li key={`${r.kind}-${r.id}`}>
                <button
                  onClick={() => go(r.href)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                    i === active ? "bg-surface-hover" : ""
                  }`}
                >
                  {r.image ? (
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border">
                      <Image src={r.image} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border text-faint">
                      <SearchIcon className="h-4 w-4" />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-ink">
                      {r.label}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {r.sub}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
