"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Order } from "@/lib/types";
import { ordersStore } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";
import OrderActions from "@/components/OrderActions";

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
        <h1 className="font-display text-2xl font-bold text-ink">
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
      <h1 className="mb-8 font-display text-3xl font-bold text-ink">
        My Orders
      </h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-border bg-surface p-5 transition hover:border-border-strong"
          >
            <Link
              href={`/orders/${order.id}`}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-ink">{order.id}</p>
                <p className="text-sm text-muted">
                  {new Date(order.placedAt).toLocaleString()} ·{" "}
                  {order.lines.length} item(s) · {order.type}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full border bg-bg-elevated px-3 py-1 text-xs font-semibold ${
                    order.status === "cancelled"
                      ? "border-ember/40 text-ember-soft"
                      : "border-gold/30 text-gold-soft"
                  }`}
                >
                  {statusLabels[order.status]}
                </span>
                <span className="font-display font-semibold text-gold-soft">
                  {formatPrice(order.total)}
                </span>
              </div>
            </Link>

            <div className="mt-4 border-t border-border pt-4">
              <OrderActions order={order} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
