import { getTables } from "@/lib/queries";
import BookTableForm from "@/components/BookTableForm";

/**
 * Tables come from the database so staff can add or retire one.
 *
 * Cached for five minutes rather than read per request: the table list is
 * configuration that changes a few times a year, and the round trip to Sydney
 * was costing ~390ms on every view of this page.
 *
 * Caching is safe here because this page carries no availability information.
 * Nothing is pre-checked; a slot is won or lost at submit time, where the unique
 * index on (tableId, date, time) rejects the loser with a P2002 that
 * /api/reservations turns into a "that slot just went" conflict. A stale table
 * list cannot cause a double booking.
 */
export const revalidate = 300;

export default async function BookTablePage() {
  const tables = await getTables();

  return (
    <BookTableForm
      tables={tables.map((t) => ({
        id: t.id,
        label: t.label,
        seats: t.seats,
        location: t.location,
      }))}
    />
  );
}
