"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/types";
import { updateOrderStatus } from "@/lib/storage";
import { useCart } from "@/context/CartContext";

/** Once the kitchen is past these, cancelling online is no longer offered. */
const CANCELLABLE: Order["status"][] = ["placed", "confirmed"];

export function isCancellable(order: Order) {
  return CANCELLABLE.includes(order.status);
}

/**
 * Cancel + reorder controls, shared by the orders list and the order detail
 * page. Reordering drops the order's lines back into the cart; cancelling
 * flips the stored status and is offered only while the order is still early
 * enough for it to be plausible.
 */
export default function OrderActions({
  order,
  layout = "row",
}: {
  order: Order;
  layout?: "row" | "stack";
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [confirming, setConfirming] = useState(false);

  function handleReorder() {
    order.lines.forEach((line) => addItem(line.item, line.quantity));
    router.push("/cart");
  }

  const base =
    "rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-60";

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted">Cancel this order?</span>
        <button
          onClick={() => {
            updateOrderStatus(order.id, "cancelled");
            setConfirming(false);
          }}
          className={`${base} bg-ember text-cream hover:bg-ember-soft`}
        >
          Yes, cancel
        </button>
        <button
          onClick={() => setConfirming(false)}
          className={`${base} border border-border-strong text-ink hover:bg-surface-hover`}
        >
          Keep it
        </button>
      </div>
    );
  }

  return (
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
      {isCancellable(order) && (
        <button
          onClick={() => setConfirming(true)}
          className={`${base} border border-ember/40 text-ember-soft hover:bg-ember/10`}
        >
          Cancel Order
        </button>
      )}
    </div>
  );
}
