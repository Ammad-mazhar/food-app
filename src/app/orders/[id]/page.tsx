"use client";

import { useSyncExternalStore } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Order } from "@/lib/types";
import { ordersStore } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";
import OrderActions from "@/components/OrderActions";

const statusSteps: Order["status"][] = [
  "placed",
  "confirmed",
  "preparing",
  "out-for-delivery",
  "completed",
];

const pickupSteps: Order["status"][] = [
  "placed",
  "confirmed",
  "preparing",
  "ready-for-pickup",
  "completed",
];

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orders = useSyncExternalStore(
    ordersStore.subscribe,
    ordersStore.read,
    ordersStore.getServerSnapshot
  );
  const order = orders.find((o) => o.id === params.id);

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-ink">
          Order not found
        </h1>
        <p className="mt-2 text-muted">
          We couldn&apos;t find that order on this device.
        </p>
        <Link
          href="/orders"
          className="mt-6 inline-block rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft"
        >
          View My Orders
        </Link>
      </div>
    );
  }

  const steps = order.type === "delivery" ? statusSteps : pickupSteps;
  const currentIndex = steps.indexOf(order.status);
  const cancelled = order.status === "cancelled";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div
        className={`mb-6 rounded-xl border p-5 text-center ${
          cancelled ? "border-ember/40 bg-ember/10" : "border-gold/30 bg-surface"
        }`}
      >
        <h1
          className={`font-display text-xl font-bold ${
            cancelled ? "text-ember-soft" : "text-gold-soft"
          }`}
        >
          {cancelled ? "This order was cancelled" : "Order placed successfully!"}
        </h1>
        <p className="text-sm text-muted">Order ID: {order.id}</p>
      </div>

      {/* Status tracker */}
      {!cancelled && (
        <div className="mb-8 rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-display font-semibold text-ink">
            Order Status
          </h2>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-1 flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    index <= currentIndex
                      ? "bg-gold text-bg"
                      : "bg-bg-elevated text-faint"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-2 text-center text-[11px] capitalize text-muted">
                  {step.replace(/-/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8 flex justify-center">
        <OrderActions order={order} layout="stack" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-3 font-display font-semibold text-ink">
            Delivery Details
          </h2>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Type</dt>
              <dd className="capitalize text-ink">{order.type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Name</dt>
              <dd className="text-ink">{order.customerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Phone</dt>
              <dd className="text-ink">{order.phone}</dd>
            </div>
            {order.address && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Address</dt>
                <dd className="text-right text-ink">{order.address}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Payment</dt>
              <dd className="capitalize text-ink">{order.paymentMethod}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-3 font-display font-semibold text-ink">Items</h2>
          <ul className="mb-3 space-y-1 text-sm text-muted">
            {order.lines.map(({ item, quantity, notes }) => (
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
          <div className="space-y-1 border-t border-border pt-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-ink">{formatPrice(order.subtotal)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted">Delivery Fee</span>
                <span className="text-ink">
                  {formatPrice(order.deliveryFee)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Tax</span>
              <span className="text-ink">{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-display font-bold text-gold-soft">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/menu"
          className="rounded-lg border border-border-strong px-6 py-3 font-semibold text-ink transition hover:bg-surface"
        >
          Order More Food
        </Link>
      </div>
    </div>
  );
}
