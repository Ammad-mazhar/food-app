import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/session";
import { handle, ok } from "@/lib/api";

/**
 * The kitchen queue. Staff only — requireStaff throws, and handle() turns that
 * into a 401 rather than leaking whether any orders exist.
 *
 * Open orders first and oldest-first within that, because the queue is worked
 * front to back; completed and cancelled ones sort to the end.
 */
export async function GET(request: Request) {
  return handle(async () => {
    await requireStaff();

    const url = new URL(request.url);
    const includeClosed = url.searchParams.get("all") === "1";

    const orders = await prisma.order.findMany({
      where: includeClosed
        ? {}
        : { status: { notIn: ["COMPLETED", "CANCELLED"] } },
      include: { lines: true },
      orderBy: { placedAt: "asc" },
      take: 200,
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todays = await prisma.order.findMany({
      where: { placedAt: { gte: todayStart }, status: { not: "CANCELLED" } },
      select: { total: true },
    });

    return ok({
      orders,
      today: {
        count: todays.length,
        revenue: todays.reduce((sum, o) => sum + o.total, 0),
      },
    });
  });
}
