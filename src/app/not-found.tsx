import Link from "next/link";
import { FlameIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-gold">
        <FlameIcon className="animate-flame h-8 w-8" />
      </div>

      <p className="font-display text-6xl font-bold text-gold/25">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">
        This page went cold
      </h1>
      <p className="mt-3 text-muted">
        The page you were after doesn&apos;t exist, or it moved. The grill is
        still on, though.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/menu"
          className="rounded-lg bg-ember px-6 py-3 font-semibold text-cream shadow-lg shadow-ember/20 transition hover:scale-105 hover:bg-ember-soft active:scale-95"
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

      <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
        <Link href="/book-table" className="hover:text-gold-soft">
          Book a Table
        </Link>
        <Link href="/orders" className="hover:text-gold-soft">
          Track an Order
        </Link>
        <Link href="/about" className="hover:text-gold-soft">
          About Us
        </Link>
      </div>
    </div>
  );
}
