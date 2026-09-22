import { FlameIcon } from "@/components/icons";

/**
 * Shown while a route segment streams in. Deliberately quiet — a single
 * flickering flame rather than a full skeleton, since most pages here render
 * almost immediately.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold">
        <FlameIcon className="animate-flame h-7 w-7" />
      </span>
      <p className="text-sm text-muted">Firing up the grill…</p>
      <span className="sr-only" role="status">
        Loading
      </span>
    </div>
  );
}
