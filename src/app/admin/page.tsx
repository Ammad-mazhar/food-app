import Link from "next/link";
import { getSessionAccount } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import AdminOrderQueue from "@/components/AdminOrderQueue";
import { UsersIcon } from "@/components/icons";

/**
 * Staff dashboard.
 *
 * Rendered on the server and gated there: an unauthorised visitor never
 * receives the order data at all, rather than being redirected away from a
 * page that already loaded it. Dynamic by nature — it reads cookies.
 */
export default async function AdminPage() {
  const account = await getSessionAccount();

  if (!account || account.role !== "STAFF") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border-strong text-gold">
          <UsersIcon className="h-6 w-6" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Staff only
        </h1>
        <p className="mt-2 text-muted">
          {account
            ? "This account doesn't have kitchen access."
            : "Sign in with a staff account to see the order queue."}
        </p>
        <Link
          href="/login"
          className="mt-6 rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft"
        >
          {account ? "Switch account" : "Log In"}
        </Link>
      </div>
    );
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [open, todays, bookings] = await Promise.all([
    prisma.order.findMany({
      where: { status: { notIn: ["COMPLETED", "CANCELLED"] } },
      include: { lines: true },
      orderBy: { placedAt: "asc" },
      take: 100,
    }),
    prisma.order.findMany({
      where: { placedAt: { gte: todayStart }, status: { not: "CANCELLED" } },
      select: { total: true },
    }),
    prisma.reservation.findMany({
      where: {
        date: new Date(
          Date.UTC(
            todayStart.getFullYear(),
            todayStart.getMonth(),
            todayStart.getDate()
          )
        ),
        status: { in: ["REQUESTED", "CONFIRMED"] },
      },
      include: { table: true },
      orderBy: { time: "asc" },
    }),
  ]);

  const revenue = todays.reduce((sum, o) => sum + o.total, 0);
  const covers = bookings.reduce((sum, b) => sum + b.partySize, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">
          Kitchen Dashboard
        </h1>
        <p className="mt-1 text-muted">
          Signed in as {account.name} · {account.email}
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Open orders", value: open.length },
          { label: "Orders today", value: todays.length },
          { label: "Revenue today", value: formatPrice(revenue) },
          { label: "Covers booked", value: covers },
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

      <AdminOrderQueue
        initialOrders={open.map((o) => ({
          reference: o.reference,
          status: o.status,
          type: o.type,
          customerName: o.customerName,
          phone: o.phone,
          address: o.address,
          total: o.total,
          placedAt: o.placedAt.toISOString(),
          lines: o.lines.map((l) => ({
            name: l.name,
            quantity: l.quantity,
            notes: l.notes,
          })),
        }))}
      />

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-bold text-ink">
          Today&apos;s bookings
        </h2>
        {bookings.length === 0 ? (
          <p className="rounded-2xl border border-border bg-surface p-6 text-muted">
            No tables booked for today.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4"
              >
                <div>
                  <p className="font-semibold text-ink">
                    {b.time} · {b.name}
                  </p>
                  <p className="text-sm text-muted">
                    {b.partySize} guests
                    {b.table ? ` · Table ${b.table.label}` : " · no table assigned"}
                    {` · ${b.phone}`}
                  </p>
                  {b.notes && (
                    <p className="mt-1 text-sm italic text-faint">
                      &ldquo;{b.notes}&rdquo;
                    </p>
                  )}
                </div>
                <span className="rounded-full border border-border-strong px-3 py-1 text-xs font-semibold capitalize text-ink">
                  {b.status.toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
