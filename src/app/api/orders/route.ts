import { prisma } from "@/lib/prisma";
import { getSessionAccount } from "@/lib/session";
import {
  badRequest,
  createOrderSchema,
  handle,
  makeAccessToken,
  makeReference,
  notFound,
  ok,
} from "@/lib/api";
import { DELIVERY_FEE, TAX_RATE, LOYALTY_RUPEES_PER_POINT } from "@/lib/pricing";

/** The signed-in customer's own orders, newest first. */
export async function GET() {
  return handle(async () => {
    const account = await getSessionAccount();
    if (!account) return ok({ orders: [] });

    const orders = await prisma.order.findMany({
      where: { accountId: account.id },
      include: { lines: true },
      orderBy: { placedAt: "desc" },
      take: 50,
    });

    return ok({ orders });
  });
}

/**
 * Place an order.
 *
 * The client sends dish ids and quantities only. Every price, the discount, the
 * tax and the total are computed here from the database — a request that tried
 * to set its own total would be ignored. Guests can order without an account.
 */
export async function POST(request: Request) {
  return handle(async () => {
    const body = await request.json().catch(() => null);
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Check your order details.", parsed.error.issues);
    }

    const input = parsed.data;
    if (input.type === "DELIVERY" && !input.address?.trim()) {
      return badRequest("A delivery address is required for delivery orders.");
    }

    const account = await getSessionAccount();

    // Look up the real dishes. Anything unavailable or unknown stops the order
    // rather than silently dropping a line the customer thinks they're buying.
    const ids = input.lines.map((l) => l.menuItemId);
    const items = await prisma.menuItem.findMany({ where: { id: { in: ids } } });
    const byId = new Map(items.map((i) => [i.id, i]));

    const missing = ids.filter((id) => !byId.has(id));
    if (missing.length > 0) {
      return notFound(`Some items are no longer on the menu: ${missing.join(", ")}`);
    }

    const unavailable = items.filter((i) => !i.isAvailable).map((i) => i.name);
    if (unavailable.length > 0) {
      return badRequest(`Sold out right now: ${unavailable.join(", ")}`);
    }

    const lines = input.lines.map((line) => {
      const item = byId.get(line.menuItemId)!;
      return {
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: line.quantity,
        notes: line.notes || null,
      };
    });

    const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

    // Promo, validated server-side: active, in date, under its usage cap and
    // over its minimum. The client's opinion of the discount is not consulted.
    let discount = 0;
    let waivesDelivery = false;
    let appliedCode: string | null = null;

    if (input.promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: input.promoCode.trim().toUpperCase() },
      });
      const usable =
        promo &&
        promo.isActive &&
        (!promo.expiresAt || promo.expiresAt > new Date()) &&
        (promo.usageLimit === null || promo.usedCount < promo.usageLimit) &&
        subtotal >= promo.minSubtotal;

      if (usable) {
        appliedCode = promo.code;
        if (promo.kind === "PERCENT") {
          discount = Math.round((subtotal * promo.value) / 100);
        } else if (promo.kind === "FIXED") {
          discount = Math.min(promo.value, subtotal);
        } else {
          waivesDelivery = true;
        }
      } else {
        return badRequest("That promo code can't be used on this order.");
      }
    }

    const baseDelivery = input.type === "DELIVERY" ? DELIVERY_FEE : 0;
    const deliveryFee = waivesDelivery ? 0 : baseDelivery;
    const tax = Math.round(subtotal * TAX_RATE);
    const total = Math.max(0, subtotal - discount + deliveryFee + tax);
    const pointsEarned = Math.floor(total / LOYALTY_RUPEES_PER_POINT);

    // Guests get a secret to open their own order with; account holders are
    // authorized by their session, so they don't need one.
    const accessToken = account ? null : makeAccessToken();

    // One transaction: the order and its promo usage count move together, so a
    // failure can't leave a code counted against an order that never existed.
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          reference: makeReference("TSH"),
          accessToken,
          accountId: account?.id ?? null,
          type: input.type,
          customerName: input.customerName,
          phone: input.phone,
          address: input.type === "DELIVERY" ? input.address : null,
          paymentMethod: input.paymentMethod,
          subtotal,
          discount,
          promoCode: appliedCode,
          deliveryFee,
          tax,
          total,
          pointsEarned,
          lines: { create: lines },
        },
        include: { lines: true },
      });

      if (appliedCode) {
        await tx.promoCode.update({
          where: { code: appliedCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      return created;
    });

    // The access token is returned exactly once, here, so the client can build
    // the tracking link. It is not included in any later read of the order.
    return ok({ order, accessToken }, { status: 201 });
  });
}
