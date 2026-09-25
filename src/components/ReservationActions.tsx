"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Lets a diner cancel their own booking. The server re-checks ownership and
 * status, so hiding this button on a closed booking is a courtesy rather than
 * the enforcement.
 */
export default function ReservationActions({
  reference,
}: {
  reference: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function cancel() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, status: "CANCELLED" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Couldn't cancel that booking.");
        return;
      }
      setConfirming(false);
      router.refresh();
    } catch {
      setError("Network problem — the booking was not cancelled.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {confirming ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Cancel this booking?</span>
          <button
            onClick={cancel}
            disabled={busy}
            className="rounded-lg bg-ember px-4 py-2 text-sm font-semibold text-cream transition hover:bg-ember-soft disabled:opacity-60"
          >
            {busy ? "Cancelling…" : "Yes, cancel"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={busy}
            className="rounded-lg border border-border-strong px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface-hover"
          >
            Keep it
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="rounded-lg border border-ember/40 px-4 py-2 text-sm font-semibold text-ember-soft transition hover:bg-ember/10"
        >
          Cancel Booking
        </button>
      )}

      {error && (
        <p role="alert" className="mt-2 text-sm text-ember">
          {error}
        </p>
      )}
    </div>
  );
}
