import "server-only";

import { prisma } from "@/lib/prisma";
import { getSessionAccount } from "@/lib/session";
import type { MenuItem, Allergen, Nutrition } from "@/lib/types";

/**
 * Server-side reads for Server Components.
 *
 * Pages call these directly instead of fetching their own API over HTTP — a
 * server component talking to its own route handler pays for a second request
 * and loses the session cookie unless it is forwarded by hand. The route
 * handlers in /api stay for the browser and any future mobile client.
 */

/** Database row -> the MenuItem shape the existing components already expect. */
type MenuRow = Awaited<ReturnType<typeof prisma.menuItem.findMany>>[number];

function toMenuItem(row: MenuRow): MenuItem & { isAvailable: boolean } {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category as MenuItem["category"],
    isVeg: row.isVeg,
    isSpicy: row.isSpicy,
    isPopular: row.isPopular,
    image: row.image ?? undefined,
    allergens: row.allergens as Allergen[],
    nutrition:
      row.kcal !== null
        ? ({
            kcal: row.kcal,
            protein: row.protein ?? 0,
            carbs: row.carbs ?? 0,
            fat: row.fat ?? 0,
          } satisfies Nutrition)
        : undefined,
    isAvailable: row.isAvailable,
  };
}

export async function getMenu() {
  const rows = await prisma.menuItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return rows.map(toMenuItem);
}

export async function getMenuItem(id: string) {
  const row = await prisma.menuItem.findUnique({ where: { id } });
  return row ? toMenuItem(row) : null;
}

export async function getMenuCategories() {
  const rows = await prisma.menuItem.findMany({
    distinct: ["category"],
    select: { category: true, sortOrder: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((r) => r.category);
}

export async function getReviews(menuItemId: string) {
  const reviews = await prisma.review.findMany({
    where: { menuItemId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      rating: true,
      author: true,
      comment: true,
      createdAt: true,
      accountId: true,
    },
  });

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return { reviews, average, count: reviews.length };
}

/** Menu item ids the signed-in visitor has hearted. Empty for guests. */
export async function getFavouriteIds(): Promise<string[]> {
  const account = await getSessionAccount();
  if (!account) return [];

  const rows = await prisma.favourite.findMany({
    where: { accountId: account.id },
    orderBy: { createdAt: "desc" },
    select: { menuItemId: true },
  });
  return rows.map((r) => r.menuItemId);
}

export async function getMyOrders() {
  const account = await getSessionAccount();
  if (!account) return [];

  return prisma.order.findMany({
    where: { accountId: account.id },
    include: { lines: true },
    orderBy: { placedAt: "desc" },
    take: 50,
  });
}

/**
 * One order, with the same rules the API applies: your own, or a guest order
 * whose token you hold. Returns null rather than throwing so the page can show
 * a plain "not found" without leaking whether the reference exists.
 */
export async function getOrder(reference: string, token?: string) {
  const order = await prisma.order.findUnique({
    where: { reference },
    include: { lines: true },
  });
  if (!order) return null;

  const account = await getSessionAccount();

  if (order.accountId) {
    const allowed =
      account &&
      (account.id === order.accountId ||
        account.role === "STAFF" ||
        account.role === "ADMIN");
    return allowed ? order : null;
  }

  if (account?.role === "STAFF" || account?.role === "ADMIN") return order;
  if (!order.accessToken || !token) return null;
  return order.accessToken === token ? order : null;
}

export async function getMyReservations() {
  const account = await getSessionAccount();
  if (!account) return [];

  return prisma.reservation.findMany({
    where: { accountId: account.id },
    include: { table: true },
    orderBy: [{ date: "desc" }, { time: "desc" }],
    take: 50,
  });
}

export async function getTables() {
  return prisma.restaurantTable.findMany({ orderBy: { seats: "asc" } });
}

/** Slots already taken on a given day, so the booking form can grey them out. */
export async function getTakenSlots(date: string) {
  const day = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(day.getTime())) return [];

  const rows = await prisma.reservation.findMany({
    where: { date: day, status: { in: ["REQUESTED", "CONFIRMED"] } },
    select: { tableId: true, time: true },
  });
  return rows;
}
