import { getMenu } from "@/lib/queries";
import MenuBrowser from "@/components/MenuBrowser";

/**
 * The menu comes from the database, so staff can change a price or mark a dish
 * sold out without a deploy. Reading it here rather than in the browser means
 * the page ships with its content already in the HTML.
 *
 * CACHED FOR 60 SECONDS, where it used to be force-dynamic.
 *
 * The old comment argued that a stale menu takes orders for food the kitchen
 * can't make. That risk is real but it is not what force-dynamic was buying:
 * the cost was a database round trip to Sydney on every single page view, which
 * measured 2.3s. Sixty seconds of staleness is a much smaller version of the
 * same risk — and if it matters more than that, the answer is
 * revalidatePath("/menu") when staff edit a dish, so a change lands
 * immediately AND the page stays cached. That is strictly better than paying
 * for a fresh read on every visitor.
 *
 * Caching also means this page must not contain anything visitor-specific —
 * hence favourites are now loaded in the browser by MenuBrowser rather than
 * being baked into shared HTML.
 */
export const revalidate = 60;

export default async function MenuPage() {
  /*
   * One query, not three in a Promise.all.
   *
   * Categories are derivable from the rows we already have, and favourites
   * moved to the client. The parallel version was actively slower: each
   * concurrent query opened its own pooler connection and paid a ~1.8s
   * handshake (see the note in src/lib/prisma.ts).
   */
  const menuItems = await getMenu();

  const menuCategories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

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

      <MenuBrowser menuItems={menuItems} menuCategories={menuCategories} />
    </div>
  );
}
