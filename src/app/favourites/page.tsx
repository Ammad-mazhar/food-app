import Link from "next/link";
import { getFavouriteIds, getMenu } from "@/lib/queries";
import { getSessionAccount } from "@/lib/session";
import MenuItemCard from "@/components/MenuItemCard";
import { HeartIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function FavouritesPage() {
  const account = await getSessionAccount();

  if (!account) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border-strong text-gold">
          <HeartIcon className="h-7 w-7" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Sign in to save favourites
        </h1>
        <p className="mt-2 max-w-sm text-muted">
          Hearted dishes follow your account, so they&apos;re there on every
          device.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft"
          >
            Log In
          </Link>
          <Link
            href="/menu"
            className="rounded-lg border border-border-strong px-6 py-3 font-semibold text-ink transition hover:bg-surface"
          >
            Browse the Menu
          </Link>
        </div>
      </div>
    );
  }

  const [ids, menu] = await Promise.all([getFavouriteIds(), getMenu()]);
  const byId = new Map(menu.map((item) => [item.id, item]));

  // Keep the visitor's own ordering (newest first) rather than menu order.
  const items = ids
    .map((id) => byId.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border-strong text-gold">
          <HeartIcon className="h-7 w-7" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Nothing saved yet
        </h1>
        <p className="mt-2 max-w-sm text-muted">
          Tap the heart on any dish and it&apos;ll wait for you here.
        </p>
        <Link
          href="/menu"
          className="mt-6 rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft"
        >
          Browse the Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Favourites</h1>
        <p className="mt-1 text-muted">
          {items.length} {items.length === 1 ? "dish" : "dishes"} saved to your
          account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {items.map((item, i) => (
          <MenuItemCard
            key={item.id}
            item={item}
            priority={i < 4}
            initialFavourite
            soldOut={!item.isAvailable}
          />
        ))}
      </div>
    </div>
  );
}
