"use client";

import { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DishArt from "@/components/DishArt";
import FavoriteButton from "@/components/FavoriteButton";
import { FlameIcon } from "@/components/icons";

export default function MenuItemCard({
  item,
  priority = false,
}: {
  item: MenuItem;
  /** Set on the cards in the first row so the LCP image isn't lazy-loaded. */
  priority?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(item, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="animate-card-enter group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_12px_36px_-14px_rgba(201,162,75,0.3)]">
      <Link
        href={`/menu/${item.id}`}
        className="relative aspect-16/10 w-full overflow-hidden bg-bg-elevated"
        aria-label={`View ${item.name}`}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <DishArt
            category={item.category}
            className="h-full w-full transition duration-500 group-hover:scale-105"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {item.isPopular && (
            <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-bg shadow">
              Signature
            </span>
          )}
          {item.isSpicy && (
            <span className="flex items-center gap-1 rounded-full bg-ember px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cream shadow">
              <FlameIcon className="h-2.5 w-2.5" />
              Spicy
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ring-2 ring-bg ${
              item.isVeg ? "bg-green-500" : "bg-ember"
            }`}
            title={item.isVeg ? "Vegetarian" : "Non-vegetarian"}
          />
          <FavoriteButton itemId={item.id} itemName={item.name} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/menu/${item.id}`} className="w-fit">
          <h3 className="font-display text-lg font-semibold text-ink transition hover:text-ember">
            {item.name}
          </h3>
        </Link>
        <p className="mt-1 flex-1 text-sm text-muted">{item.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-gold-soft">
            {formatPrice(item.price)}
          </span>
          <button
            onClick={handleAdd}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${
              added
                ? "animate-pop bg-green-600 text-white"
                : "bg-ember text-cream hover:scale-105 hover:bg-ember-soft active:scale-95"
            }`}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
