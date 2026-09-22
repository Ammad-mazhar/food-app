"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import DishIcon from "@/components/DishIcon";

export default function CartPage() {
  const { lines, updateQuantity, removeItem, subtotal, deliveryFee, tax, total } =
    useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-surface text-gold">
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9" cy="21" r="1" />
            <circle cx="18" cy="21" r="1" />
            <path d="M3 3h2l2.4 12.4a2 2 0 002 1.6h8.4a2 2 0 002-1.6L21 8H6" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-cream">
          Your cart is empty
        </h1>
        <p className="mt-2 text-muted">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/menu"
          className="mt-6 rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-bold text-cream">
        Your Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          {lines.map(({ item, quantity }) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-bg-elevated text-gold">
                <DishIcon category={item.category} className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-cream">{item.name}</h3>
                <p className="text-sm text-muted">
                  {formatPrice(item.price)} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  className="h-8 w-8 rounded-full border border-border-strong text-lg leading-none text-cream"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-6 text-center font-medium text-cream">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                  className="h-8 w-8 rounded-full border border-border-strong text-lg leading-none text-cream"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <div className="w-24 text-right font-display font-semibold text-gold-soft">
                {formatPrice(item.price * quantity)}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-faint transition hover:text-ember-soft"
                aria-label="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-cream">
            Order Summary
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-cream">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Delivery Fee</span>
              <span className="text-cream">{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Tax</span>
              <span className="text-cream">{formatPrice(tax)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-display text-base font-bold text-gold-soft">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-lg bg-ember px-6 py-3 text-center font-semibold text-cream transition hover:bg-ember-soft"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
