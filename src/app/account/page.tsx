import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-bold text-cream">
        My Account
      </h1>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-3 font-display font-semibold text-cream">
            Profile
          </h2>
          <p className="text-sm text-muted">
            Sign in to view and edit your profile details, saved addresses,
            and payment preferences.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-lg bg-ember px-4 py-2 text-sm font-semibold text-cream transition hover:bg-ember-soft"
          >
            Log In
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-3 font-display font-semibold text-cream">
            Quick Links
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link href="/orders" className="text-gold-soft hover:underline">
                My Orders
              </Link>
            </li>
            <li>
              <Link
                href="/reservations"
                className="text-gold-soft hover:underline"
              >
                My Reservations
              </Link>
            </li>
            <li>
              <Link href="/menu" className="text-gold-soft hover:underline">
                Browse Menu
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
