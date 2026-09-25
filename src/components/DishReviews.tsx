"use client";

import { useState, useSyncExternalStore } from "react";
import { reviewsStore, saveReview, deleteReview } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { generateId } from "@/lib/utils";
import { StarIcon } from "@/components/icons";

function Stars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  return (
    <span className="flex items-center gap-0.5 text-gold" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon
          key={n}
          className={`${className} ${n <= value ? "" : "opacity-25"}`}
        />
      ))}
    </span>
  );
}

/**
 * Per-dish ratings, stored on the visitor's own device.
 *
 * Because there's no server, a review is only ever visible to the person who
 * wrote it — so this is a personal tasting note, not social proof, and the
 * copy says as much rather than implying an audience.
 */
export default function DishReviews({
  itemId,
  itemName,
}: {
  itemId: string;
  itemName: string;
}) {
  const { account } = useAuth();
  const all = useSyncExternalStore(
    reviewsStore.subscribe,
    reviewsStore.read,
    reviewsStore.getServerSnapshot
  );
  const reviews = all.filter((r) => r.itemId === itemId);

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Pick a rating from one to five stars.");
      return;
    }
    setError("");
    saveReview({
      id: generateId("REV"),
      itemId,
      rating,
      author: account?.name || "You",
      comment: comment.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
    setRating(0);
    setComment("");
  }

  const shown = hovered || rating;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-ink">
          Your notes on {itemName}
        </h2>
        {reviews.length > 0 && (
          <span className="flex items-center gap-2 text-sm text-muted">
            <Stars value={Math.round(average)} />
            {average.toFixed(1)} from {reviews.length}{" "}
            {reviews.length === 1 ? "note" : "notes"}
          </span>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-surface p-5"
      >
        <fieldset className="border-0 p-0">
          <legend className="mb-2 text-sm font-medium text-ink">
            How was it?
          </legend>
          <div
            className="flex items-center gap-1"
            onMouseLeave={() => setHovered(0)}
          >
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

        <label htmlFor={`note-${itemId}`} className="mt-4 mb-1 block text-sm font-medium text-ink">
          Anything to remember? <span className="font-normal text-faint">(optional)</span>
        </label>
        <textarea
          id={`note-${itemId}`}
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ask for it medium-rare next time."
          className="w-full rounded-lg border border-border-strong bg-field px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-gold focus:outline-none"
        />

        {error && (
          <p role="alert" className="mt-2 text-sm text-ember">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-4 rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-ember-soft"
        >
          Save note
        </button>
        <p className="mt-3 text-xs text-faint">
          Saved on this device only — nobody else can see it.
        </p>
      </form>

      {reviews.length > 0 && (
        <ul className="mt-5 flex flex-col gap-3">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Stars value={r.rating} />
                  <p className="mt-1 text-sm font-medium text-ink">{r.author}</p>
                  <p className="text-xs text-faint">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteReview(r.id)}
                  className="text-sm text-faint transition hover:text-ember"
                  aria-label="Delete this note"
                >
                  Delete
                </button>
              </div>
              {r.comment && (
                <p className="mt-2 text-sm text-muted">{r.comment}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
