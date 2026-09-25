import { prisma } from "@/lib/prisma";
import { getSessionAccount } from "@/lib/session";
import { badRequest, handle, ok, unauthorized } from "@/lib/api";

export async function GET() {
  return handle(async () => {
    const account = await getSessionAccount();
    if (!account) return ok({ menuItemIds: [] });

    const rows = await prisma.favourite.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: "desc" },
      select: { menuItemId: true },
    });

    return ok({ menuItemIds: rows.map((r) => r.menuItemId) });
  });
}

/** Toggle one dish. Returns the new state so the client doesn't have to guess. */
export async function POST(request: Request) {
  return handle(async () => {
    const account = await getSessionAccount();
    if (!account) return unauthorized();

    const body = await request.json().catch(() => null);
    const menuItemId =
      body && typeof body.menuItemId === "string" ? body.menuItemId : null;
    if (!menuItemId) return badRequest("menuItemId is required.");

    const key = { accountId: account.id, menuItemId };
    const existing = await prisma.favourite.findUnique({
      where: { accountId_menuItemId: key },
    });

    if (existing) {
      await prisma.favourite.delete({ where: { accountId_menuItemId: key } });
      return ok({ menuItemId, isFavourite: false });
    }

    await prisma.favourite.create({ data: key });
    return ok({ menuItemId, isFavourite: true });
  });
}
