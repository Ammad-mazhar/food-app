"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Reservation } from "@/lib/types";
import { reservationsStore } from "@/lib/storage";

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

  if (reservations.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-cream">
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
      <h1 className="mb-8 font-display text-3xl font-bold text-cream">
        My Reservations
      </h1>
      <div className="flex flex-col gap-4">
        {reservations.map((res) => (
          <div
            key={res.id}
            className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-cream">
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
        ))}
      </div>
    </div>
  );
}
