import { getMenu, getMenuCategories, getFavouriteIds } from "@/lib/queries";
import MenuBrowser from "@/components/MenuBrowser";

/**
 * The menu now comes from the database, so staff can change a price or mark a
 * dish sold out without a deploy. Reading it here rather than in the browser
 * means the page ships with its content already in the HTML.
 *
 * Not cached: an out-of-date menu takes orders for food the kitchen can't
 * make. Correctness wins over the handful of milliseconds caching would save.
 */
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [menuItems, menuCategories, favouriteIds] = await Promise.all([
    getMenu(),
    getMenuCategories(),
    getFavouriteIds(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          The Menu
        </span>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink">
          Fire-Grilled Favorites
        </h1>
        <p className="mt-1 text-muted">
          Freshly prepared, available for delivery, pickup, or dine-in. Prices
          shown are indicative — please confirm current pricing with the
          restaurant.
        </p>
      </div>

      <MenuBrowser
        menuItems={menuItems}
        menuCategories={menuCategories}
        favouriteIds={favouriteIds}
      />
    </div>
  );
}
