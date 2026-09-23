"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Reservation } from "@/lib/types";
import { reservationsStore, updateReservationStatus } from "@/lib/storage";

const statusStyles: Record<Reservation["status"], string> = {
  requested: "border-gold/30 text-gold-soft",
  confirmed: "border-green-500/30 text-green-400",
  cancelled: "border-ember/30 text-ember-soft",
  completed: "border-border-strong text-muted",
};

export default function ReservationsPage() {
  const reservations = useSyncExternalStore(
    reservationsStore.subscribe,
    reservationsStore.read,
    reservationsStore.getServerSnapshot
  );
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

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
                  {res.date} at {res.time}
                </p>
                <p className="text-sm text-muted">
                  {res.partySize} guest(s)
                  {res.tableId ? ` · Table ${res.tableId.toUpperCase()}` : ""}
                </p>
                {res.notes && (
                  <p className="text-sm italic text-faint">
                    &ldquo;{res.notes}&rdquo;
                  </p>
                )}
              </div>
              <span
                className={`w-fit rounded-full border bg-bg-elevated px-3 py-1 text-xs font-semibold capitalize ${statusStyles[res.status]}`}
              >
                {res.status}
              </span>
            </div>

            {(res.status === "requested" || res.status === "confirmed") && (
              <div className="mt-4 border-t border-border pt-4">
                {confirmingId === res.id ? (
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-muted">Cancel this booking?</span>
                    <button
                      onClick={() => {
                        updateReservationStatus(res.id, "cancelled");
                        setConfirmingId(null);
                      }}
                      className="rounded-lg bg-ember px-4 py-2 text-sm font-semibold text-cream transition hover:bg-ember-soft"
                    >
                      Yes, cancel
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="rounded-lg border border-border-strong px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface-hover"
                    >
                      Keep it
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingId(res.id)}
                    className="rounded-lg border border-ember/40 px-4 py-2 text-sm font-semibold text-ember-soft transition hover:bg-ember/10"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
