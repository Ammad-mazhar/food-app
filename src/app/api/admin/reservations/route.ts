import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/session";
import {
  badRequest,
  handle,
  notFound,
  ok,
  reservationStatusSchema,
} from "@/lib/api";

/** Bookings for a given day (defaults to today). Staff only. */
export async function GET(request: Request) {
  return handle(async () => {
    await requireStaff();

    const dateParam = new URL(request.url).searchParams.get("date");
    const day = dateParam ? new Date(`${dateParam}T00:00:00.000Z`) : new Date();
    if (Number.isNaN(day.getTime())) return badRequest("That date isn't valid.");

    const start = new Date(
      Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate())
    );

    const reservations = await prisma.reservation.findMany({
      where: { date: start },
      include: { table: true },
      orderBy: { time: "asc" },
    });

    return ok({ reservations, date: start.toISOString().slice(0, 10) });
  });
}

/** Confirm or cancel a booking. Staff only. */
export async function PATCH(request: Request) {
  return handle(async () => {
    await requireStaff();

    const body = await request.json().catch(() => null);
    const reference =
      body && typeof body.reference === "string" ? body.reference : null;
    if (!reference) return badRequest("reference is required.");

    const parsed = reservationStatusSchema.safeParse(body);
    if (!parsed.success) return badRequest("That status isn't valid.");

    const existing = await prisma.reservation.findUnique({ where: { reference } });
    if (!existing) return notFound("We couldn't find that booking.");

    const reservation = await prisma.reservation.update({
      where: { reference },
      data: { status: parsed.data.status },
      include: { table: true },
    });

    return ok({ reservation });
  });
}
