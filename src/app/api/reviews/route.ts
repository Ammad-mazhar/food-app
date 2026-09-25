import { prisma } from "@/lib/prisma";
import { getSessionAccount } from "@/lib/session";
import {
  badRequest,
  createReviewSchema,
  handle,
  notFound,
  ok,
  unauthorized,
} from "@/lib/api";

/** Reviews for one dish: /api/reviews?menuItemId=m1 */
export async function GET(request: Request) {
  return handle(async () => {
    const menuItemId = new URL(request.url).searchParams.get("menuItemId");
    if (!menuItemId) return badRequest("menuItemId is required.");

    const reviews = await prisma.review.findMany({
      where: { menuItemId },
      orderBy: { createdAt: "desc" },
      take: 100,
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
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

    return ok({ reviews, average, count: reviews.length });
  });
}

/** Leave a review. Signing in is required so one person can't flood a dish. */
export async function POST(request: Request) {
  return handle(async () => {
    const account = await getSessionAccount();
    if (!account) return unauthorized();

    const body = await request.json().catch(() => null);
    const parsed = createReviewSchema.safeParse(body);
    if (!parsed.success) return badRequest("Check your review.");

    const { menuItemId, rating, comment } = parsed.data;

    const item = await prisma.menuItem.findUnique({ where: { id: menuItemId } });
    if (!item) return notFound("That dish is no longer on the menu.");

    const review = await prisma.review.create({
      data: {
        menuItemId,
        accountId: account.id,
        author: account.name,
        rating,
        comment: comment || null,
      },
    });

    return ok({ review }, { status: 201 });
  });
}

/** Delete your own review. */
export async function DELETE(request: Request) {
  return handle(async () => {
    const account = await getSessionAccount();
    if (!account) return unauthorized();

    const id = new URL(request.url).searchParams.get("id");
    if (!id) return badRequest("id is required.");

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return notFound();
    // Staff can remove anything; everyone else only their own.
    if (review.accountId !== account.id && account.role !== "STAFF") {
      return unauthorized();
    }

    await prisma.review.delete({ where: { id } });
    return ok({ ok: true });
  });
}
