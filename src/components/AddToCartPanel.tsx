"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

/**
 * Quantity picker + add button for the dish detail page. Split out as its own
 * client component so the page itself can stay a Server Component and keep its
 * generateMetadata / generateStaticParams.
 */
export default function AddToCartPanel({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(item, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-border-strong p-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="h-9 w-9 rounded-full text-lg leading-none text-cream transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center font-medium text-cream" aria-live="polite">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            disabled={quantity >= 20}
            className="h-9 w-9 rounded-full text-lg leading-none text-cream transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          className={`flex-1 rounded-lg px-6 py-3 font-semibold transition ${
            added
              ? "animate-pop bg-green-600 text-white"
              : "bg-ember text-cream shadow-lg shadow-ember/20 hover:scale-105 hover:bg-ember-soft active:scale-95"
          }`}
        >
          {added
            ? "Added to cart ✓"
            : `Add ${quantity} to cart · ${formatPrice(item.price * quantity)}`}
        </button>
      </div>

      {added && (
        <Link
          href="/cart"
          className="mt-3 inline-block text-sm font-semibold text-gold-soft hover:underline"
        >
          Go to cart →
        </Link>
      )}
    </div>
  );
}
