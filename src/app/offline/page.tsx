import Link from "next/link";
import type { Metadata } from "next";
import { restaurantInfo } from "@/lib/restaurant";
import { FlameIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: `Offline | ${restaurantInfo.name}`,
  description: "You're offline. Some pages are still available.",
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border-strong text-gold">
        <FlameIcon className="h-8 w-8" />
      </div>

      <h1 className="font-display text-3xl font-bold text-ink">
        You&apos;re offline
      </h1>
      <p className="mt-3 text-muted">
        This page needs a connection. Anything you looked at earlier is still
        here, and your cart is saved.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/menu"
          className="rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:scale-105 hover:bg-ember-soft active:scale-95"
        >
          Browse the Menu
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-border-strong px-6 py-3 font-semibold text-ink transition hover:scale-105 hover:bg-surface active:scale-95"
        >
          Back Home
        </Link>
      </div>

      <p className="mt-10 text-sm text-muted">
        To order right now, call{" "}
        <a
          href={`tel:${restaurantInfo.phone}`}
          className="font-semibold text-gold-soft hover:underline"
        >
          {restaurantInfo.phone}
        </a>
      </p>
    </div>
  );
}
