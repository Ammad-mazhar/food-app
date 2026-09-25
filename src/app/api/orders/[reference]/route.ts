import type { Order } from "@/../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionAccount, safeEqual } from "@/lib/session";
import { handle, notFound, ok } from "@/lib/api";

/**
 * Decides whether this caller may see this order.
 *
 * The reference is short enough to be guessed, so it is never sufficient on
 * its own:
 *
 *   - An order owned by an account needs that account's session (or staff).
 *   - A guest order needs the 128-bit token issued at checkout, compared in
 *     constant time so a wrong guess leaks nothing through timing.
 *
 * Returns the same `notFound` for "no such order" and "wrong token", so the
 * endpoint can't be used to test which references exist.
 */
async function authorize(
  order: Order,
  suppliedToken: string | null
): Promise<"ok" | "denied"> {
  if (order.accountId) {
    const account = await getSessionAccount();
    const allowed =
      account && (account.id === order.accountId || account.role === "STAFF");
    return allowed ? "ok" : "denied";
  }

  // Guest order. Staff can always see it from the dashboard.
  const account = await getSessionAccount();
  if (account?.role === "STAFF") return "ok";

  if (!order.accessToken || !suppliedToken) return "denied";
  return safeEqual(order.accessToken, suppliedToken) ? "ok" : "denied";
}

/** Track one order: /api/orders/TSH-ABCD1234?token=… for guests. */
export async function GET(
  request: Request,
  ctx: RouteContext<"/api/orders/[reference]">
) {
  return handle(async () => {
    const { reference } = await ctx.params;
    const token = new URL(request.url).searchParams.get("token");

    const order = await prisma.order.findUnique({
      where: { reference },
      include: { lines: true },
    });

    if (!order) return notFound("We couldn't find that order.");
    if ((await authorize(order, token)) === "denied") {
      return notFound("We couldn't find that order.");
    }

    // Never echo the token back on a read — it only goes out once, at
    // checkout. undefined is dropped by JSON.stringify.
    return ok({ order: { ...order, accessToken: undefined } });
  });
}

/** Cancel your own order, while it's still early enough to be plausible. */
export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/orders/[reference]">
) {
  return handle(async () => {
    const { reference } = await ctx.params;
    const url = new URL(request.url);
    const body = await request.json().catch(() => null);

    if (!body || body.status !== "CANCELLED") {
      return Response.json(
        { error: "Customers can only cancel an order." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({ where: { reference } });
    if (!order) return notFound("We couldn't find that order.");

    const token =
      url.searchParams.get("token") ??
      (typeof body.token === "string" ? body.token : null);

    if ((await authorize(order, token)) === "denied") {
      return notFound("We couldn't find that order.");
    }

    if (order.status !== "PLACED" && order.status !== "CONFIRMED") {
      return Response.json(
        { error: "This order is already being prepared — please call us." },
        { status: 409 }
      );
    }

    const updated = await prisma.order.update({
      where: { reference },
      data: { status: "CANCELLED" },
      include: { lines: true },
    });

    return ok({ order: { ...updated, accessToken: undefined } });
  });
}
