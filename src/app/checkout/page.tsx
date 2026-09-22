"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, generateId } from "@/lib/utils";
import { saveOrder } from "@/lib/storage";
import { Order, OrderType } from "@/lib/types";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, deliveryFee, tax, total, clearCart } = useCart();

  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<Order["paymentMethod"]>("cash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
        <h1 className="font-display text-2xl font-bold text-cream">
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

    const order: Order = {
      id: generateId("ORD"),
      lines,
      type: orderType,
      status: "placed",
      subtotal,
      deliveryFee: orderType === "delivery" ? deliveryFee : 0,
      tax,
      total: orderType === "delivery" ? total : subtotal + tax,
      placedAt: new Date().toISOString(),
      address: orderType === "delivery" ? address : undefined,
      phone,
      customerName: name,
      paymentMethod,
    };

    saveOrder(order);
    clearCart();
    router.push(`/orders/${order.id}`);
  }

  const finalTotal = orderType === "delivery" ? total : subtotal + tax;

  const inputClass =
    "rounded-lg border border-border-strong bg-surface px-4 py-2 text-sm text-cream placeholder:text-faint focus:border-gold focus:outline-none";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-bold text-cream">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-cream">
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
                      : "border-border-strong text-cream hover:bg-surface"
                  }`}
                >
                  {type === "delivery" ? "Delivery" : "Pickup"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-cream">
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
                  className="mb-1 block text-sm font-medium text-cream"
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
                  className="mb-1 block text-sm font-medium text-cream"
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
                    className="mb-1 block text-sm font-medium text-cream"
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
            <h2 className="mb-3 font-display text-lg font-semibold text-cream">
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
                  className="flex items-center gap-3 rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm text-cream"
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
          <h2 className="mb-4 font-display text-lg font-semibold text-cream">
            Order Summary
          </h2>
          <ul className="mb-4 space-y-1 text-sm text-muted">
            {lines.map(({ item, quantity, notes }) => (
              <li key={item.id}>
                <div className="flex justify-between">
                  <span>
                    {quantity} × {item.name}
                  </span>
                  <span className="text-cream">
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
          <div className="space-y-2 border-t border-border pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-cream">{formatPrice(subtotal)}</span>
            </div>
            {orderType === "delivery" && (
              <div className="flex justify-between">
                <span className="text-muted">Delivery Fee</span>
                <span className="text-cream">{formatPrice(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Tax</span>
              <span className="text-cream">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-display text-base font-bold text-gold-soft">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
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
