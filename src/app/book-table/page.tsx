"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { tables } from "@/lib/data";
import { saveReservation } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import { Reservation } from "@/lib/types";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function BookTablePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("19:00");
  const [partySize, setPartySize] = useState(2);
  const [tableId, setTableId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const suitableTables = tables.filter((t) => t.seats >= partySize);
  const inputClass =
    "w-full rounded-lg border border-border-strong bg-field px-4 py-2 text-sm text-ink placeholder:text-faint focus:border-gold focus:outline-none";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date || !time) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSubmitting(true);

    const reservation: Reservation = {
      id: generateId("RES"),
      name,
      phone,
      date,
      time,
      partySize,
      tableId: tableId || undefined,
      notes: notes || undefined,
      status: "requested",
    };

    saveReservation(reservation);
    router.push("/reservations");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <span className="text-xs font-semibold uppercase tracking-widest text-gold">
        Reserve
      </span>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink">
        Book a Table
      </h1>
      <p className="mb-8 mt-1 text-muted">
        Reserve your spot for a great dine-in experience.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Phone number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="03XX-XXXXXXX"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Date
            </label>
            <input
              type="date"
              value={date}
              min={todayISO()}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Party size
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={partySize}
              onChange={(e) => {
                setPartySize(Number(e.target.value));
                setTableId("");
              }}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Preferred table (optional)
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {suitableTables.length === 0 && (
              <p className="col-span-full text-sm text-faint">
                No tables fit that party size — we&apos;ll seat you at the
                best available spot.
              </p>
            )}
            {suitableTables.map((table) => (
              <button
                type="button"
                key={table.id}
                onClick={() =>
                  setTableId(tableId === table.id ? "" : table.id)
                }
                className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                  tableId === table.id
                    ? "border-gold bg-gold text-bg"
                    : "border-border-strong text-ink hover:bg-bg-elevated"
                }`}
              >
                <div className="font-semibold">{table.label}</div>
                <div
                  className={
                    tableId === table.id ? "text-bg/70" : "text-faint"
                  }
                >
                  {table.seats} seats · {table.location}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Special requests (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="Birthday celebration, window seat, high chair needed, etc."
          />
        </div>

        {error && (
          <p className="rounded-lg border border-ember/40 bg-ember/10 px-4 py-2 text-sm text-ember-soft">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft disabled:opacity-60"
        >
          {submitting ? "Booking..." : "Confirm Reservation"}
        </button>
      </form>
    </div>
  );
}
