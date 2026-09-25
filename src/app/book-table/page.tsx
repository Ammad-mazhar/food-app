import { getTables } from "@/lib/queries";
import BookTableForm from "@/components/BookTableForm";

/** Tables come from the database so staff can add or retire one. */
export const dynamic = "force-dynamic";

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
