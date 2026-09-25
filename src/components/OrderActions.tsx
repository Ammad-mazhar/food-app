"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

/** Once the kitchen is past these, cancelling online is no longer offered. */
const CANCELLABLE = ["PLACED", "CONFIRMED"];

export type ReorderLine = {
  menuItemId: string | null;
  name: string;
  price: number;
  quantity: number;
  notes: string | null;
};

/**
 * Cancel + reorder controls.
 *
 * Cancelling goes to the API, which re-checks the status server-side — hiding
 * the button is a courtesy, not the enforcement. Reordering rebuilds the cart
 * from the order's lines; anything since removed from the menu is skipped and
 * called out rather than silently dropped.
 */
export default function OrderActions({
  reference,
  status,
  lines,
  token,
  layout = "row",
}: {
  reference: string;
  status: string;
  lines: ReorderLine[];
  /** Guest orders carry their access token so the cancel call is authorized. */
  token?: string;
  layout?: "row" | "stack";
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const base =
    "rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-60";

  async function handleReorder() {
    const missing: string[] = [];
    for (const line of lines) {
      if (!line.menuItemId) {
        missing.push(line.name);
        continue;
      }
      addItem(
        {
          id: line.menuItemId,
          name: line.name,
          description: "",
          price: line.price,
          category: "Main Course",
          isVeg: false,
        },
        line.quantity
      );
    }

    if (missing.length > 0) {
      setError(`No longer on the menu, so not added: ${missing.join(", ")}`);
      return;
    }
    router.push("/cart");
  }

  async function cancel() {
    setBusy(true);
    setError("");
    try {
      const url = token
        ? `/api/orders/${reference}?token=${encodeURIComponent(token)}`
        : `/api/orders/${reference}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Couldn't cancel that order.");
        return;
      }
      setConfirming(false);
      router.refresh();
    } catch {
      setError("Network problem — the order was not cancelled.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {confirming ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Cancel this order?</span>
          <button
            onClick={cancel}
            disabled={busy}
            className={`${base} bg-ember text-cream hover:bg-ember-soft`}
          >
            {busy ? "Cancelling…" : "Yes, cancel"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={busy}
            className={`${base} border border-border-strong text-ink hover:bg-surface-hover`}
          >
            Keep it
          </button>
        </div>
      ) : (
        <div
          className={`flex gap-2 ${
            layout === "stack" ? "flex-col sm:flex-row" : "flex-wrap"
          }`}
        >
          <button
            onClick={handleReorder}
            className={`${base} border border-border-strong text-ink hover:bg-surface-hover`}
          >
            Reorder
          </button>
          {CANCELLABLE.includes(status) && (
            <button
              onClick={() => setConfirming(true)}
              className={`${base} border border-ember/40 text-ember-soft hover:bg-ember/10`}
            >
              Cancel Order
            </button>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-sm text-ember">
          {error}
        </p>
      )}
    </div>
  );
}
