import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionAccount, isStaff } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import {
  pointsForOrderTotal,
  LOYALTY_POINTS_PER_REWARD,
  LOYALTY_REWARD_VALUE,
} from "@/lib/pricing";
import AccountProfile from "@/components/AccountProfile";
import { UsersIcon, SparkleIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const account = await getSessionAccount();

  if (!account) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="mb-8 font-display text-3xl font-bold text-ink">
          My Account
        </h1>

        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold">
            <UsersIcon className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-semibold text-ink">
            You&apos;re not signed in
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Sign in to keep your details on hand at checkout and see your orders
            and reservations in one place.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-ember-soft"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border border-border-strong px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-hover"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [orders, reservationCount] = await Promise.all([
    prisma.order.findMany({
      where: { accountId: account.id, status: { not: "CANCELLED" } },
      select: { total: true, pointsEarned: true },
    }),
    prisma.reservation.count({ where: { accountId: account.id } }),
  ]);

  const spent = orders.reduce((sum, o) => sum + o.total, 0);
  // Orders placed before loyalty existed have no stored figure, so recompute
  // from their total rather than showing them as worth nothing.
  const points = orders.reduce(
    (sum, o) => sum + (o.pointsEarned || pointsForOrderTotal(o.total)),
    0
  );
  const rewards = Math.floor(points / LOYALTY_POINTS_PER_REWARD);
  const toNextReward =
    LOYALTY_POINTS_PER_REWARD - (points % LOYALTY_POINTS_PER_REWARD);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">
            My Account
          </h1>
          <p className="mt-1 text-muted">
            Signed in as <span className="text-ink">{account.email}</span>
          </p>
        </div>
        {isStaff(account) && (
          <Link
            href="/admin"
            className="rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-ember-soft"
          >
            Kitchen Dashboard
          </Link>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {[
          { label: "Orders", value: orders.length },
          { label: "Reservations", value: reservationCount },
          { label: "Total Spent", value: formatPrice(spent) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-surface p-5 text-center"
          >
            <p className="font-display text-2xl font-bold text-gold-soft">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Loyalty */}
      <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold">
              <SparkleIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-ink">
                {points} {points === 1 ? "point" : "points"}
              </p>
              <p className="text-sm text-muted">
                {rewards > 0
                  ? `Worth ${formatPrice(rewards * LOYALTY_REWARD_VALUE)} off your next order.`
                  : `${toNextReward} more for ${formatPrice(LOYALTY_REWARD_VALUE)} off.`}
              </p>
            </div>
          </div>
          <p className="text-xs text-faint">1 point per Rs. 100 spent</p>
        </div>

        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-bg-elevated"
          role="progressbar"
          aria-valuenow={points % LOYALTY_POINTS_PER_REWARD}
          aria-valuemin={0}
          aria-valuemax={LOYALTY_POINTS_PER_REWARD}
          aria-label="Progress to next reward"
        >
          <div
            className="h-full rounded-full bg-gold transition-all"
            style={{
              width: `${((points % LOYALTY_POINTS_PER_REWARD) / LOYALTY_POINTS_PER_REWARD) * 100}%`,
            }}
          />
        </div>
        <p className="mt-3 text-xs text-faint">
          Points are tracked against your account but can&apos;t be redeemed at
          the till yet.
        </p>
      </div>

      <AccountProfile
        name={account.name}
        email={account.email}
        phone={account.phone}
        address={account.address}
      />

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-3 font-display font-semibold text-ink">
          Quick Links
        </h2>
        <ul className="flex flex-col gap-2 text-sm">
          <li>
            <Link href="/orders" className="text-gold-soft hover:underline">
              My Orders ({orders.length})
            </Link>
          </li>
          <li>
            <Link href="/reservations" className="text-gold-soft hover:underline">
              My Reservations ({reservationCount})
            </Link>
          </li>
          <li>
            <Link href="/favourites" className="text-gold-soft hover:underline">
              Favourites
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
