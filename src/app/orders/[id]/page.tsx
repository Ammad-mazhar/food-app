import Link from "next/link";
import { getOrder } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import OrderActions from "@/components/OrderActions";
import PrintReceiptButton from "@/components/PrintReceiptButton";

export const dynamic = "force-dynamic";

const deliverySteps = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
];
const pickupSteps = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "COMPLETED",
];

function label(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * The [id] segment carries the order reference. Guests reach their own order
 * with ?token=… from the checkout link; account holders are authorized by
 * their session and need no token.
 */
export default async function OrderDetailPage({
  params,
  searchParams,
}: PageProps<"/orders/[id]">) {
  const { id } = await params;
  const { token } = await searchParams;

  const order = await getOrder(id, typeof token === "string" ? token : undefined);

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-ink">
          Order not found
        </h1>
        <p className="mt-2 text-muted">
          That reference doesn&apos;t match an order you can see. If you ordered
          as a guest, use the tracking link from your confirmation.
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

  const steps = order.type === "DELIVERY" ? deliverySteps : pickupSteps;
  const currentIndex = steps.indexOf(order.status);
  const cancelled = order.status === "CANCELLED";

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
        <p className="text-sm text-muted">Order reference: {order.reference}</p>
      </div>

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
                <span className="mt-2 text-center text-[11px] text-muted">
                  {label(step)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="no-print mb-8 flex flex-wrap items-center justify-center gap-2">
        <OrderActions
          reference={order.reference}
          status={order.status}
          token={typeof token === "string" ? token : undefined}
          layout="stack"
          lines={order.lines.map((l) => ({
            menuItemId: l.menuItemId,
            name: l.name,
            price: l.price,
            quantity: l.quantity,
            notes: l.notes,
          }))}
        />
        <PrintReceiptButton />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-3 font-display font-semibold text-ink">
            Delivery Details
          </h2>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Type</dt>
              <dd className="text-ink">{label(order.type)}</dd>
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
              <dd className="text-ink">{label(order.paymentMethod)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-3 font-display font-semibold text-ink">Items</h2>
          <ul className="mb-3 space-y-1 text-sm text-muted">
            {order.lines.map((line) => (
              <li key={line.id}>
                <div className="flex justify-between">
                  <span>
                    {line.quantity} × {line.name}
                  </span>
                  <span className="text-ink">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                </div>
                {line.notes && (
                  <p className="mt-0.5 text-xs italic text-faint">
                    &ldquo;{line.notes}&rdquo;
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
            {order.discount > 0 && (
              <div className="flex justify-between text-gold">
                <span>
                  Discount{order.promoCode ? ` (${order.promoCode})` : ""}
                </span>
                <span>−{formatPrice(order.discount)}</span>
              </div>
            )}
            {order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted">Delivery Fee</span>
                <span className="text-ink">{formatPrice(order.deliveryFee)}</span>
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
            {order.pointsEarned > 0 && (
              <p className="pt-1 text-xs text-faint">
                Earned {order.pointsEarned} loyalty points.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="no-print mt-8 flex justify-center">
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
