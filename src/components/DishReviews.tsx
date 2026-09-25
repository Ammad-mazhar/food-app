"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StarIcon } from "@/components/icons";

export type PublicReview = {
  id: string;
  rating: number;
  author: string;
  comment: string | null;
  createdAt: string;
  accountId: string | null;
};

function Stars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  return (
    <span className="flex items-center gap-0.5 text-gold" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} className={`${className} ${n <= value ? "" : "opacity-25"}`} />
      ))}
    </span>
  );
}

/**
 * Reviews for one dish, stored in the database and visible to everyone.
 *
 * The list arrives from the server render so it's in the HTML; posting and
 * deleting go through the API and then ask Next to re-render the page, which
 * keeps this component free of its own cache.
 */
export default function DishReviews({
  itemId,
  itemName,
  initialReviews,
  initialAverage,
  signedIn,
  currentAccountId,
}: {
  itemId: string;
  itemName: string;
  initialReviews: PublicReview[];
  initialAverage: number;
  signedIn: boolean;
  currentAccountId: string | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Pick a rating from one to five stars.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItemId: itemId, rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Couldn't save that review.");
        return;
      }
      setRating(0);
      setComment("");
      router.refresh();
    } catch {
      setError("Network problem — your review wasn't saved.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/reviews?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const shown = hovered || rating;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-ink">
          Reviews of {itemName}
        </h2>
        {initialReviews.length > 0 && (
          <span className="flex items-center gap-2 text-sm text-muted">
            <Stars value={Math.round(initialAverage)} />
            {initialAverage.toFixed(1)} from {initialReviews.length}{" "}
            {initialReviews.length === 1 ? "review" : "reviews"}
          </span>
        )}
      </div>

      {signedIn ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-surface p-5"
        >
          <fieldset className="border-0 p-0">
            <legend className="mb-2 text-sm font-medium text-ink">
              How was it?
            </legend>
            <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHovered(n)}
                  onFocus={() => setHovered(n)}
                  onBlur={() => setHovered(0)}
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  aria-pressed={rating === n}
                  className="rounded p-0.5 text-gold transition hover:scale-110"
                >
                  <StarIcon className={`h-7 w-7 ${n <= shown ? "" : "opacity-25"}`} />
                </button>
              ))}
            </div>
          </fieldset>

          <label
            htmlFor={`note-${itemId}`}
            className="mt-4 mb-1 block text-sm font-medium text-ink"
          >
            Tell people why{" "}
            <span className="font-normal text-faint">(optional)</span>
          </label>
          <textarea
            id={`note-${itemId}`}
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ask for it medium-rare — worth it."
            className="w-full rounded-lg border border-border-strong bg-field px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-gold focus:outline-none"
          />

          {error && (
            <p role="alert" className="mt-2 text-sm text-ember">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-4 rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-ember-soft disabled:opacity-60"
          >
            {busy ? "Posting…" : "Post review"}
          </button>
        </form>
      ) : (
        <p className="rounded-2xl border border-border bg-surface p-5 text-sm text-muted">
          <Link href="/login" className="font-semibold text-gold-soft hover:underline">
            Log in
          </Link>{" "}
          to leave a review.
        </p>
      )}

      {initialReviews.length > 0 && (
        <ul className="mt-5 flex flex-col gap-3">
          {initialReviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Stars value={r.rating} />
                  <p className="mt-1 text-sm font-medium text-ink">{r.author}</p>
                  <p className="text-xs text-faint">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {/* Only your own review offers a delete control; the API
                    enforces the same rule regardless of what's rendered. */}
                {r.accountId && r.accountId === currentAccountId && (
                  <button
                    onClick={() => remove(r.id)}
                    disabled={busy}
                    className="text-sm text-faint transition hover:text-ember disabled:opacity-60"
                    aria-label="Delete your review"
                  >
                    Delete
                  </button>
                )}
              </div>
              {r.comment && <p className="mt-2 text-sm text-muted">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
