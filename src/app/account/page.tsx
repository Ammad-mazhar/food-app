"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useAuth } from "@/context/AuthContext";
import { ordersStore, reservationsStore } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";
import { UsersIcon, CheckIcon } from "@/components/icons";

export default function AccountPage() {
  const { account, isSignedIn, logOut, updateProfile } = useAuth();

  const orders = useSyncExternalStore(
    ordersStore.subscribe,
    ordersStore.read,
    ordersStore.getServerSnapshot
  );
  const reservations = useSyncExternalStore(
    reservationsStore.subscribe,
    reservationsStore.read,
    reservationsStore.getServerSnapshot
  );

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saved, setSaved] = useState(false);

  const inputClass =
    "w-full rounded-lg border border-border-strong bg-bg-elevated px-4 py-2 text-sm text-cream placeholder:text-faint focus:border-gold focus:outline-none";

  function startEditing() {
    setName(account?.name ?? "");
    setPhone(account?.phone ?? "");
    setAddress(account?.address ?? "");
    setEditing(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({
      name: name.trim() || account?.name,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
    });
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  if (!isSignedIn || !account) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="mb-8 font-display text-3xl font-bold text-cream">
          My Account
        </h1>

        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold">
            <UsersIcon className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-semibold text-cream">
            You&apos;re not signed in
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Sign in to keep your details on hand at checkout and see your
            orders and reservations in one place.
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
              className="rounded-lg border border-border-strong px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-surface-hover"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-3 font-display font-semibold text-cream">
            Browse without an account
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link href="/orders" className="text-gold-soft hover:underline">
                My Orders
              </Link>
            </li>
            <li>
              <Link href="/reservations" className="text-gold-soft hover:underline">
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
    );
  }

  const spent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cream">
            My Account
          </h1>
          <p className="mt-1 text-muted">
            Signed in as <span className="text-cream">{account.email}</span>
          </p>
        </div>
        <button
          onClick={logOut}
          className="rounded-lg border border-border-strong px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-surface-hover"
        >
          Log Out
        </button>
      </div>

      {saved && (
        <p
          role="status"
          className="mb-6 flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm text-gold-soft"
        >
          <CheckIcon className="h-4 w-4" />
          Profile updated.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        {[
          { label: "Orders", value: orders.length },
          { label: "Reservations", value: reservations.length },
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

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-cream">
            Profile
          </h2>
          {!editing && (
            <button
              onClick={startEditing}
              className="text-sm font-semibold text-gold-soft hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label htmlFor="acct-name" className="mb-1 block text-sm font-medium text-cream">
                Full name
              </label>
              <input
                id="acct-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="acct-phone" className="mb-1 block text-sm font-medium text-cream">
                Phone number
              </label>
              <input
                id="acct-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="03XX-XXXXXXX"
              />
            </div>
            <div>
              <label htmlFor="acct-address" className="mb-1 block text-sm font-medium text-cream">
                Default delivery address
              </label>
              <textarea
                id="acct-address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClass}
                placeholder="House, street, area, city"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-ember-soft"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg border border-border-strong px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-surface-hover"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Name</dt>
              <dd className="text-cream">{account.name}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="text-cream">{account.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="text-cream">
                {account.phone || <span className="text-faint">Not set</span>}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Default address</dt>
              <dd className="text-cream">
                {account.address || <span className="text-faint">Not set</span>}
              </dd>
            </div>
          </dl>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-3 font-display font-semibold text-cream">
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
              My Reservations ({reservations.length})
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
  );
}
