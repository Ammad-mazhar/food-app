"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { Order, OrderType, PromoCode } from "@/lib/types";
import { applyPromo, pointsForOrderTotal } from "@/lib/data";
import { TagIcon, CheckIcon } from "@/components/icons";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  // `total` from the cart is deliberately unused — checkout recomputes it
  // below once order type and any promo code are known.
  const { lines, subtotal, deliveryFee, tax, clearCart } = useCart();

  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<Order["paymentMethod"]>("cash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");

  // Fill the form from the signed-in profile once per account, adjusted during
  // render so it lands before first paint and never clobbers later typing.
  const { account } = useAuth();
  const [prefilledFor, setPrefilledFor] = useState<string | null>(null);
  if (account && prefilledFor !== account.id) {
    setPrefilledFor(account.id);
    setName(account.name);
    if (account.phone) setPhone(account.phone);
    if (account.address) setAddress(account.address);
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-ink">
          Nothing to check out
        </h1>
        <p className="mt-2 text-muted">Add some items to your cart first.</p>
        <Link
          href="/menu"
          className="mt-6 inline-block rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  /**
   * Sends the order to the server, which is where it becomes real: the
   * kitchen sees it in /admin and the customer gets a reference.
   *
   * Only dish ids and quantities go up. Every price, the discount, the tax and
   * the total are recomputed server-side from the database — the figures shown
   * below are a preview for the customer, not an instruction to the server.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!name.trim() || !phone.trim()) {
      setError("Please fill in your name and phone number.");
      return;
    }
    if (orderType === "delivery" && !address.trim()) {
      setError("Please provide a delivery address.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: orderType === "delivery" ? "DELIVERY" : "PICKUP",
          customerName: name.trim(),
          phone: phone.trim(),
          address: orderType === "delivery" ? address.trim() : undefined,
          paymentMethod: paymentMethod.toUpperCase(),
          promoCode: promo?.code,
          lines: lines.map((line) => ({
            menuItemId: line.item.id,
            quantity: line.quantity,
            notes: line.notes,
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "We couldn't place that order. Please try again.");
        setSubmitting(false);
        return;
      }

      // Only clear the cart once the server has the order — a failed request
      // must not lose someone's basket.
      clearCart();

      // Guests get a one-time token in the tracking link; signed-in customers
      // are authorized by their session and don't need one.
      const query = data.accessToken
        ? `?token=${encodeURIComponent(data.accessToken)}`
        : "";
      router.push(`/orders/${data.order.reference}${query}`);
    } catch {
      setError("Network problem — your order was not placed.");
      setSubmitting(false);
    }
  }

  /** Previews a code against the live promo table before checkout. */
  async function handleApplyPromo() {
    const code = promoInput.trim();
    if (!code) return;

    setPromoError("");
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.valid) {
        setPromoError(data.error || "That code can't be used right now.");
        return;
      }

      setPromo({
        code: data.code,
        label: data.label,
        kind: String(data.kind).toLowerCase() as PromoCode["kind"],
        value: data.value,
        minSubtotal: data.minSubtotal,
      });
      setPromoInput("");
    } catch {
      setPromoError("Couldn't check that code. Please try again.");
    }
  }

  // Delivery is only charged on delivery orders, and a FREEDEL-style code
  // waives it. Percent and fixed codes come off the subtotal instead.
  const baseDelivery = orderType === "delivery" ? deliveryFee : 0;
  const { discount, waivesDelivery } = promo
    ? applyPromo(promo, subtotal, baseDelivery)
    : { discount: 0, waivesDelivery: false };
  const chargedDelivery = waivesDelivery ? 0 : baseDelivery;
  // Clamp at zero so a large fixed discount can never produce a negative bill.
  const finalTotal = Math.max(0, subtotal - discount + chargedDelivery + tax);

  const inputClass =
    "rounded-lg border border-border-strong bg-field px-4 py-2 text-sm text-ink placeholder:text-faint focus:border-gold focus:outline-none";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-bold text-ink">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">
              Order Type
            </h2>
            <div className="flex gap-3">
              {(["delivery", "pickup"] as OrderType[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold capitalize transition ${
                    orderType === type
                      ? "border-gold bg-gold text-bg"
                      : "border-border-strong text-ink hover:bg-surface"
                  }`}
                >
                  {type === "delivery" ? "Delivery" : "Pickup"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">
              Contact Details
            </h2>
            {account ? (
              <p className="mb-3 text-sm text-muted">
                Filled in from your account.{" "}
                <Link href="/account" className="text-gold-soft hover:underline">
                  Update details
                </Link>
              </p>
            ) : (
              <p className="mb-3 text-sm text-muted">
                <Link href="/login" className="text-gold-soft hover:underline">
                  Log in
                </Link>{" "}
                to fill this in automatically next time.
              </p>
            )}
            <div className="flex flex-col gap-3">
              <div>
                <label
                  htmlFor="checkout-name"
                  className="mb-1 block text-sm font-medium text-ink"
                >
                  Full name
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${inputClass} w-full`}
                />
              </div>
              <div>
                <label
                  htmlFor="checkout-phone"
                  className="mb-1 block text-sm font-medium text-ink"
                >
                  Phone number
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="03XX-XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${inputClass} w-full`}
                />
              </div>
              {orderType === "delivery" && (
                <div>
                  <label
                    htmlFor="checkout-address"
                    className="mb-1 block text-sm font-medium text-ink"
                  >
                    Delivery address
                  </label>
                  <textarea
                    id="checkout-address"
                    autoComplete="street-address"
                    placeholder="House, street, area, city"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className={`${inputClass} w-full`}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">
              Payment Method
            </h2>
            <div className="flex flex-col gap-2">
              {(
                [
                  {
                    id: "cash",
                    label:
                      "Cash on " + (orderType === "delivery" ? "Delivery" : "Pickup"),
                  },
                  { id: "card", label: "Credit / Debit Card" },
                  { id: "wallet", label: "Mobile Wallet (JazzCash / Easypaisa)" },
                ] as { id: Order["paymentMethod"]; label: string }[]
              ).map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm text-ink"
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                    className="accent-gold"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-ember/40 bg-ember/10 px-4 py-2 text-sm text-ember-soft">
              {error}
            </p>
          )}
        </div>

        <div className="h-fit rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">
            Order Summary
          </h2>
          <ul className="mb-4 space-y-1 text-sm text-muted">
            {lines.map(({ item, quantity, notes }) => (
              <li key={item.id}>
                <div className="flex justify-between">
                  <span>
                    {quantity} × {item.name}
                  </span>
                  <span className="text-ink">
                    {formatPrice(item.price * quantity)}
                  </span>
                </div>
                {notes && (
                  <p className="mt-0.5 text-xs italic text-faint">
                    &ldquo;{notes}&rdquo;
                  </p>
                )}
              </li>
            ))}
          </ul>
          {/* Promo code */}
          <div className="border-t border-border pt-3">
            {promo ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2">
                <span className="flex min-w-0 items-center gap-2 text-sm">
                  <CheckIcon className="h-4 w-4 shrink-0 text-gold" />
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink">
                      {promo.code}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {promo.label}
                    </span>
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setPromo(null)}
                  className="shrink-0 text-xs font-semibold text-faint transition hover:text-ember"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="promo"
                  className="mb-1 flex items-center gap-1.5 text-sm font-medium text-ink"
                >
                  <TagIcon className="h-4 w-4 text-gold" />
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => {
                      // Enter here must not submit the whole order.
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyPromo();
                      }
                    }}
                    placeholder="HOWDY10"
                    className="w-full rounded-lg border border-border-strong bg-field px-3 py-2 text-sm uppercase text-ink placeholder:text-faint placeholder:normal-case focus:border-gold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="shrink-0 rounded-lg border border-border-strong px-4 text-sm font-semibold text-ink transition hover:bg-surface-hover"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p role="alert" className="mt-1.5 text-xs text-ember">
                    {promoError}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-ink">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-gold">
                <span>Discount ({promo?.code})</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            {orderType === "delivery" && (
              <div className="flex justify-between">
                <span className="text-muted">Delivery Fee</span>
                {waivesDelivery ? (
                  <span className="text-gold">
                    <s className="text-faint">{formatPrice(deliveryFee)}</s> Free
                  </span>
                ) : (
                  <span className="text-ink">{formatPrice(chargedDelivery)}</span>
                )}
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Tax</span>
              <span className="text-ink">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-display text-base font-bold text-gold-soft">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
            <p className="pt-1 text-xs text-faint">
              Earns {pointsForOrderTotal(finalTotal)} loyalty points.
            </p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft disabled:opacity-60"
          >
            {submitting ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
