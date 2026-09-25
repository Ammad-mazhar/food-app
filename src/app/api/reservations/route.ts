import { prisma } from "@/lib/prisma";
import { getSessionAccount } from "@/lib/session";
import {
  badRequest,
  conflict,
  createReservationSchema,
  handle,
  makeReference,
  ok,
} from "@/lib/api";

export async function GET() {
  return handle(async () => {
    const account = await getSessionAccount();
    if (!account) return ok({ reservations: [] });

    const reservations = await prisma.reservation.findMany({
      where: { accountId: account.id },
      include: { table: true },
      orderBy: [{ date: "desc" }, { time: "desc" }],
      take: 50,
    });

    return ok({ reservations });
  });
}

/**
 * Request a table.
 *
 * Availability is enforced by a unique index on (tableId, date, time), not by
 * an application-level check. Two people booking the same slot at the same
 * instant would both pass a "is it free?" query; only one can win the insert.
 */
export async function POST(request: Request) {
  return handle(async () => {
    const body = await request.json().catch(() => null);
    const parsed = createReservationSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Check the booking details.", parsed.error.issues);
    }

    const input = parsed.data;
    const date = new Date(`${input.date}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) return badRequest("That date isn't valid.");

    // Compare date-only against today in UTC, matching how the column is stored.
    const today = new Date();
    const todayUtc = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
    );
    if (date < todayUtc) {
      return badRequest("Pick a date from today onwards.");
    }

    const account = await getSessionAccount();

    let tableId = input.tableId ?? null;
    if (tableId) {
      const table = await prisma.restaurantTable.findUnique({
        where: { id: tableId },
      });
      if (!table) return badRequest("That table doesn't exist.");
      if (table.seats < input.partySize) {
        return badRequest(
          `Table ${table.label} seats ${table.seats}. Pick a larger one for ${input.partySize}.`
        );
      }
    } else {
      // No preference: take the smallest free table that fits the party.
      const candidates = await prisma.restaurantTable.findMany({
        where: { seats: { gte: input.partySize } },
        orderBy: { seats: "asc" },
      });
      const taken = await prisma.reservation.findMany({
        where: {
          date,
          time: input.time,
          status: { in: ["REQUESTED", "CONFIRMED"] },
        },
        select: { tableId: true },
      });
      const takenIds = new Set(taken.map((t) => t.tableId));
      tableId = candidates.find((t) => !takenIds.has(t.id))?.id ?? null;
    }

    try {
      const reservation = await prisma.reservation.create({
        data: {
          reference: makeReference("TBL"),
          accountId: account?.id ?? null,
          tableId,
          name: input.name,
          phone: input.phone,
          date,
          time: input.time,
          partySize: input.partySize,
          notes: input.notes || null,
        },
        include: { table: true },
      });

      return ok({ reservation }, { status: 201 });
    } catch (error) {
      // P2002 = unique constraint violation, i.e. that slot just went.
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
      ) {
        return conflict(
          "That table was just booked for this time. Please pick another slot."
        );
      }
      throw error;
    }
  });
}
