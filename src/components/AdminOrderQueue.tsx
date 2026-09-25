"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

type QueueLine = { name: string; quantity: number; notes: string | null };

export type QueueOrder = {
  reference: string;
  status: string;
  type: string;
  customerName: string;
  phone: string;
  address: string | null;
  total: number;
  placedAt: string;
  lines: QueueLine[];
};

/**
 * The next status in the kitchen's workflow, which differs by order type —
 * a pickup order is never "out for delivery".
 */
function nextStatus(status: string, type: string): string | null {
  const flow =
    type === "DELIVERY"
      ? ["PLACED", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "COMPLETED"]
      : ["PLACED", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "COMPLETED"];
  const i = flow.indexOf(status);
  return i === -1 || i === flow.length - 1 ? null : flow[i + 1];
}

function label(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/** How long an order has been waiting — the number the kitchen cares about. */
function waitedFor(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function AdminOrderQueue({
  initialOrders,
}: {
  initialOrders: QueueOrder[];
}) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function setStatus(reference: string, status: string) {
    setBusy(reference);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Couldn't update that order.");
        return;
      }
      // Completed and cancelled orders leave the queue.
      if (status === "COMPLETED" || status === "CANCELLED") {
        setOrders((list) => list.filter((o) => o.reference !== reference));
      } else {
        setOrders((list) =>
          list.map((o) => (o.reference === reference ? { ...o, status } : o))
        );
      }
      // Refresh the server-rendered counters above the queue.
      router.refresh();
    } catch {
      setError("Network problem — the order was not updated.");
    } finally {
      setBusy(null);
    }
  }

  if (orders.length === 0) {
    return (
      <section>
        <h2 className="mb-4 font-display text-2xl font-bold text-ink">
          Order queue
        </h2>
        <p className="rounded-2xl border border-border bg-surface p-6 text-muted">
          Nothing waiting. New orders appear here as they come in.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-4 font-display text-2xl font-bold text-ink">
        Order queue ({orders.length})
      </h2>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-ember/40 bg-ember/10 px-4 py-2 text-sm text-ember"
        >
          {error}
        </p>
      )}

      <ul className="grid gap-4 lg:grid-cols-2">
        {orders.map((order) => {
          const next = nextStatus(order.status, order.type);
          return (
            <li
              key={order.reference}
              className="flex flex-col rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-ink">
                    {order.reference}
                  </p>
                  <p className="text-sm text-muted">
                    {order.customerName} · {order.phone}
                  </p>
                  <p className="text-sm text-muted">
                    {order.type === "DELIVERY" ? "Delivery" : "Pickup"} ·
                    waiting {waitedFor(order.placedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                    {label(order.status)}
                  </span>
                  <p className="mt-1 font-display font-bold text-ink">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>

              {order.address && (
                <p className="mt-3 rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-ink">
                  {order.address}
                </p>
              )}

              <ul className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-sm">
                {order.lines.map((line, i) => (
                  <li key={i}>
                    <span className="font-medium text-ink">
                      {line.quantity} × {line.name}
                    </span>
                    {line.notes && (
                      <span className="block text-xs italic text-ember">
                        {line.notes}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                {next && (
                  <button
                    onClick={() => setStatus(order.reference, next)}
                    disabled={busy === order.reference}
                    className="rounded-lg bg-ember px-4 py-2 text-sm font-semibold text-cream transition hover:bg-ember-soft disabled:opacity-60"
                  >
                    {busy === order.reference ? "Saving…" : `Mark ${label(next)}`}
                  </button>
                )}
                <button
                  onClick={() => setStatus(order.reference, "CANCELLED")}
                  disabled={busy === order.reference}
                  className="rounded-lg border border-ember/40 px-4 py-2 text-sm font-semibold text-ember transition hover:bg-ember/10 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
