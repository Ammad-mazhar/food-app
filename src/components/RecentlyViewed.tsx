"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { menuItems } from "@/lib/data";
import { recentlyViewedStore, recordRecentlyViewed } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";

/**
 * Records a visit to one dish. Rendered by the dish page; writes to an
 * external store rather than React state, so it never re-renders the page.
 */
export function TrackRecentlyViewed({ itemId }: { itemId: string }) {
  useEffect(() => {
    recordRecentlyViewed(itemId);
  }, [itemId]);
  return null;
}

/**
 * Strip of dishes the visitor has looked at, newest first. Renders nothing
 * until there are at least two, so it doesn't appear as a one-item shelf on a
 * first visit.
 */
export default function RecentlyViewed({
  excludeId,
  title = "Recently viewed",
}: {
  excludeId?: string;
  title?: string;
}) {
  const ids = useSyncExternalStore(
    recentlyViewedStore.subscribe,
    recentlyViewedStore.read,
    recentlyViewedStore.getServerSnapshot
  );

  const items = ids
    .filter((id) => id !== excludeId)
    .map((id) => menuItems.find((i) => i.id === id))
    .filter((i): i is (typeof menuItems)[number] => Boolean(i));

  if (items.length < 2) return null;

  return (
    <section className="mt-16 border-t border-border pt-8">
      <h2 className="mb-5 font-display text-xl font-bold text-ink">{title}</h2>
      <ul className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <li key={item.id} className="w-40 shrink-0">
            <Link href={`/menu/${item.id}`} className="group block">
              <span className="relative block aspect-4/3 overflow-hidden rounded-xl border border-border bg-bg-elevated">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="160px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </span>
              <span className="mt-2 block truncate text-sm font-medium text-ink group-hover:text-ember">
                {item.name}
              </span>
              <span className="block text-xs text-muted">
                {formatPrice(item.price)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
