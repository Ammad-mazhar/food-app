import { prisma } from "@/lib/prisma";
import { handle, ok } from "@/lib/api";

/**
 * The live menu, including each dish's average rating.
 *
 * Unavailable dishes are still returned, flagged, so the UI can show them
 * greyed out as "sold out" rather than having them vanish — a regular looking
 * for their usual should see it's off today, not think it never existed.
 */
export async function GET() {
  return handle(async () => {
    const [items, ratings] = await Promise.all([
      prisma.menuItem.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.review.groupBy({
        by: ["menuItemId"],
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    const byItem = new Map(
      ratings.map((r) => [
        r.menuItemId,
        { average: r._avg.rating ?? 0, count: r._count.rating },
      ])
    );

    return ok({
      items: items.map((item) => ({
        ...item,
        rating: byItem.get(item.id) ?? { average: 0, count: 0 },
      })),
    });
  });
}
