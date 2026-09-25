import Link from "next/link";
import { getMyOrders } from "@/lib/queries";
import { getSessionAccount } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import OrderActions from "@/components/OrderActions";

/** Per-visitor data behind a session cookie — never cached. */
export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PLACED: "Order Placed",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  READY_FOR_PICKUP: "Ready for Pickup",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default async function OrdersPage() {
  const account = await getSessionAccount();

  if (!account) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-ink">
          Sign in to see your orders
        </h1>
        <p className="mt-2 text-muted">
          Orders placed as a guest are reachable from the link you got at
          checkout.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft"
          >
            Log In
          </Link>
          <Link
            href="/menu"
            className="rounded-lg border border-border-strong px-6 py-3 font-semibold text-ink transition hover:bg-surface"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const orders = await getMyOrders();

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-ink">
          No orders yet
        </h1>
        <p className="mt-2 text-muted">Your placed orders will show up here.</p>
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
              href={`/orders/${order.reference}`}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-ink">{order.reference}</p>
                <p className="text-sm text-muted">
                  {order.placedAt.toLocaleString()} · {order.lines.length}{" "}
                  item(s) · {order.type.toLowerCase()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full border bg-bg-elevated px-3 py-1 text-xs font-semibold ${
                    order.status === "CANCELLED"
                      ? "border-ember/40 text-ember-soft"
                      : "border-gold/30 text-gold-soft"
                  }`}
                >
                  {statusLabels[order.status] ?? order.status}
                </span>
                <span className="font-display font-semibold text-gold-soft">
                  {formatPrice(order.total)}
                </span>
              </div>
            </Link>

            <div className="mt-4 border-t border-border pt-4">
              <OrderActions
                reference={order.reference}
                status={order.status}
                lines={order.lines.map((l) => ({
                  menuItemId: l.menuItemId,
                  name: l.name,
                  price: l.price,
                  quantity: l.quantity,
                  notes: l.notes,
                }))}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
