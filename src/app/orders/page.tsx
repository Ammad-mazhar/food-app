"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Order } from "@/lib/types";
import { ordersStore } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";

const statusLabels: Record<Order["status"], string> = {
  placed: "Order Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  "out-for-delivery": "Out for Delivery",
  "ready-for-pickup": "Ready for Pickup",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const orders = useSyncExternalStore(
    ordersStore.subscribe,
    ordersStore.read,
    ordersStore.getServerSnapshot
  );

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-cream">
          No orders yet
        </h1>
        <p className="mt-2 text-muted">
          Your placed orders will show up here.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-block rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-bold text-cream">
        My Orders
      </h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-5 transition hover:border-border-strong sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-cream">{order.id}</p>
              <p className="text-sm text-muted">
                {new Date(order.placedAt).toLocaleString()} ·{" "}
                {order.lines.length} item(s) · {order.type}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="rounded-full border border-gold/30 bg-bg-elevated px-3 py-1 text-xs font-semibold text-gold-soft">
                {statusLabels[order.status]}
              </span>
              <span className="font-display font-semibold text-gold-soft">
                {formatPrice(order.total)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
