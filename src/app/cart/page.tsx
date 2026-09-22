"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import DishArt from "@/components/DishArt";

export default function CartPage() {
  const {
    lines,
    updateQuantity,
    updateNotes,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    total,
  } = useCart();

  const [confirmingClear, setConfirmingClear] = useState(false);
  const [openNoteFor, setOpenNoteFor] = useState<string | null>(null);

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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-cream">
          Your Cart
        </h1>
        {confirmingClear ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">Remove everything?</span>
            <button
              onClick={() => {
                clearCart();
                setConfirmingClear(false);
              }}
              className="rounded-lg bg-ember px-3.5 py-1.5 font-semibold text-cream transition hover:bg-ember-soft"
            >
              Yes, clear it
            </button>
            <button
              onClick={() => setConfirmingClear(false)}
              className="rounded-lg border border-border-strong px-3.5 py-1.5 font-semibold text-cream transition hover:bg-surface"
            >
              Keep
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingClear(true)}
            className="text-sm font-semibold text-faint transition hover:text-ember-soft"
          >
            Clear cart
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          {lines.map(({ item, quantity, notes }) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex items-center gap-4">
                <Link
                  href={`/menu/${item.id}`}
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-bg-elevated"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <DishArt category={item.category} className="h-full w-full" />
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/menu/${item.id}`}
                    className="font-semibold text-cream hover:text-gold-soft"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted">
                    {formatPrice(item.price)} each
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                    className="h-8 w-8 rounded-full border border-border-strong text-lg leading-none text-cream transition hover:bg-surface-hover"
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-medium text-cream">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    className="h-8 w-8 rounded-full border border-border-strong text-lg leading-none text-cream transition hover:bg-surface-hover"
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    +
                  </button>
                </div>

                <div className="hidden w-24 text-right font-display font-semibold text-gold-soft sm:block">
                  {formatPrice(item.price * quantity)}
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-faint transition hover:text-ember-soft"
                  aria-label={`Remove ${item.name}`}
                >
                  ✕
                </button>
              </div>

              <div className="mt-3 border-t border-border pt-3">
                {openNoteFor === item.id ? (
                  <div>
                    <label
                      htmlFor={`note-${item.id}`}
                      className="mb-1 block text-xs font-medium text-muted"
                    >
                      Note for the kitchen
                    </label>
                    <input
                      id={`note-${item.id}`}
                      autoFocus
                      defaultValue={notes ?? ""}
                      onBlur={(e) => {
                        updateNotes(item.id, e.target.value);
                        setOpenNoteFor(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                        if (e.key === "Escape") setOpenNoteFor(null);
                      }}
                      placeholder="e.g. well done, no jalapeños"
                      className="w-full rounded-lg border border-border-strong bg-bg-elevated px-3 py-1.5 text-sm text-cream placeholder:text-faint focus:border-gold focus:outline-none"
                    />
                  </div>
                ) : notes ? (
                  <button
                    onClick={() => setOpenNoteFor(item.id)}
                    className="text-left text-sm italic text-muted hover:text-cream"
                  >
                    &ldquo;{notes}&rdquo;{" "}
                    <span className="not-italic text-gold-soft">Edit</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setOpenNoteFor(item.id)}
                    className="text-sm font-medium text-gold-soft hover:underline"
                  >
                    + Add a note for the kitchen
                  </button>
                )}
              </div>
            </div>
          ))}

          <Link
            href="/menu"
            className="w-fit text-sm font-semibold text-gold-soft hover:underline"
          >
            ← Continue shopping
          </Link>
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
          <p className="mt-3 text-xs text-faint">
            Delivery fee is dropped automatically if you choose pickup at
            checkout.
          </p>
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
