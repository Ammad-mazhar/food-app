"use client";

import Link from "next/link";
import { FlameIcon } from "@/components/icons";

/**
 * Route-level error boundary. Catches render/data errors in any page under the
 * root layout, so the navbar and footer stay put and the visitor gets a way
 * out instead of Next's default error screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-ember/50 text-ember-soft">
        <FlameIcon className="h-8 w-8" />
      </div>

      <h1 className="font-display text-3xl font-bold text-ink">
        Something burned in the kitchen
      </h1>
      <p className="mt-3 text-muted">
        An unexpected error stopped this page from loading. Trying again often
        sorts it.
      </p>

      {error.digest && (
        <p className="mt-4 rounded-lg border border-border bg-surface px-4 py-2 font-mono text-xs text-faint">
          Reference: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-ember px-6 py-3 font-semibold text-cream shadow-lg shadow-ember/20 transition hover:scale-105 hover:bg-ember-soft active:scale-95"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border-strong px-6 py-3 font-semibold text-ink transition hover:scale-105 hover:bg-surface active:scale-95"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
