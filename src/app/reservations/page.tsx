import Link from "next/link";
import { getMyReservations } from "@/lib/queries";
import { getSessionAccount } from "@/lib/session";
import ReservationActions from "@/components/ReservationActions";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  REQUESTED: "border-gold/30 text-gold-soft",
  CONFIRMED: "border-green-600/40 text-green-700",
  CANCELLED: "border-ember/30 text-ember-soft",
  COMPLETED: "border-border-strong text-muted",
};

export default async function ReservationsPage() {
  const account = await getSessionAccount();

  if (!account) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-ink">
          Sign in to see your bookings
        </h1>
        <p className="mt-2 text-muted">
          We&apos;ll still have your table — call us if you booked as a guest.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft"
          >
            Log In
          </Link>
          <Link
            href="/book-table"
            className="rounded-lg border border-border-strong px-6 py-3 font-semibold text-ink transition hover:bg-surface"
          >
            Book a Table
          </Link>
        </div>
      </div>
    );
  }

  const reservations = await getMyReservations();

  if (reservations.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-ink">
          No reservations yet
        </h1>
        <p className="mt-2 text-muted">
          Book a table and it will show up here.
        </p>
        <Link
          href="/book-table"
          className="mt-6 inline-block rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft"
        >
          Book a Table
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-bold text-ink">
        My Reservations
      </h1>
      <div className="flex flex-col gap-4">
        {reservations.map((res) => (
          <div
            key={res.id}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-ink">
                  {res.date.toISOString().slice(0, 10)} at {res.time}
                </p>
                <p className="text-sm text-muted">
                  {res.partySize} guest(s)
                  {res.table ? ` · Table ${res.table.label}` : ""}
                  {` · ${res.reference}`}
                </p>
                {res.notes && (
                  <p className="text-sm italic text-faint">
                    &ldquo;{res.notes}&rdquo;
                  </p>
                )}
              </div>
              <span
                className={`w-fit rounded-full border bg-bg-elevated px-3 py-1 text-xs font-semibold capitalize ${
                  statusStyles[res.status] ?? "border-border-strong text-muted"
                }`}
              >
                {res.status.toLowerCase()}
              </span>
            </div>

            {(res.status === "REQUESTED" || res.status === "CONFIRMED") && (
              <div className="mt-4 border-t border-border pt-4">
                <ReservationActions reference={res.reference} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
