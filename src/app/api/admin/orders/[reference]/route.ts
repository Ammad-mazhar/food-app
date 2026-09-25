import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/session";
import { badRequest, handle, notFound, ok, orderStatusSchema } from "@/lib/api";

/** Advance an order through the kitchen. Staff only. */
export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/orders/[reference]">
) {
  return handle(async () => {
    await requireStaff();

    const { reference } = await ctx.params;
    const body = await request.json().catch(() => null);
    const parsed = orderStatusSchema.safeParse(body);
    if (!parsed.success) return badRequest("That status isn't valid.");

    const existing = await prisma.order.findUnique({ where: { reference } });
    if (!existing) return notFound("We couldn't find that order.");

    const order = await prisma.order.update({
      where: { reference },
      data: { status: parsed.data.status },
      include: { lines: true },
    });

    return ok({ order });
  });
}
