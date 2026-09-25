import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { menuItems } from "@/lib/data";
import { restaurantInfo } from "@/lib/restaurant";
import { formatPrice } from "@/lib/utils";
import DishArt from "@/components/DishArt";
import MenuItemCard from "@/components/MenuItemCard";
import AddToCartPanel from "@/components/AddToCartPanel";
import FavoriteButton from "@/components/FavoriteButton";
import ShareButton from "@/components/ShareButton";
import DishReviews from "@/components/DishReviews";
import RecentlyViewed, {
  TrackRecentlyViewed,
} from "@/components/RecentlyViewed";
import { FlameIcon, LeafIcon, ClockIcon, PinIcon } from "@/components/icons";

/** Prerender every dish page at build time — the menu is a fixed list. */
export function generateStaticParams() {
  return menuItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/menu/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = menuItems.find((i) => i.id === id);
  if (!item) return { title: `Dish not found | ${restaurantInfo.name}` };

  return {
    title: `${item.name} | ${restaurantInfo.name}`,
    description: item.description,
    openGraph: {
      title: `${item.name} — ${formatPrice(item.price)}`,
      description: item.description,
      images: item.image ? [{ url: item.image }] : undefined,
    },
  };
}

export default async function DishPage({ params }: PageProps<"/menu/[id]">) {
  const { id } = await params;
  const item = menuItems.find((i) => i.id === id);
  if (!item) notFound();

  const related = menuItems
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <Link href="/menu" className="hover:text-gold-soft">
          Menu
        </Link>
        <span className="mx-2 text-faint">/</span>
        <span className="text-ink">{item.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border bg-bg-elevated">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <DishArt category={item.category} className="h-full w-full" />
          )}
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border-strong px-3 py-1 text-xs font-semibold text-ink">
              {item.category}
            </span>
            {item.isPopular && (
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-bg">
                Signature
              </span>
            )}
            {item.isSpicy && (
              <span className="flex items-center gap-1 rounded-full bg-ember px-3 py-1 text-xs font-bold uppercase tracking-wide text-cream">
                <FlameIcon className="h-3 w-3" />
                Spicy
              </span>
            )}
            <span
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                item.isVeg
                  ? "border-green-500/40 text-green-400"
                  : "border-ember/40 text-ember-soft"
              }`}
            >
              {item.isVeg && <LeafIcon className="h-3 w-3" />}
              {item.isVeg ? "Vegetarian" : "Non-vegetarian"}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              {item.name}
            </h1>
            <div className="flex shrink-0 gap-2">
              <FavoriteButton
                itemId={item.id}
                itemName={item.name}
                variant="inline"
              />
              <ShareButton title={item.name} text={item.description} />
            </div>
          </div>
          <p className="mt-3 text-muted">{item.description}</p>

          <p className="mt-6 font-display text-3xl font-bold text-gold-soft">
            {formatPrice(item.price)}
          </p>
          <p className="mt-1 text-xs text-faint">
            Price is indicative — please confirm current pricing with the
            restaurant.
          </p>

          <AddToCartPanel item={item} />

          {(item.allergens || item.nutrition) && (
            <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
              {item.allergens && (
                <div>
                  <h2 className="text-sm font-semibold text-ink">Allergens</h2>
                  {item.allergens.length > 0 ? (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {item.allergens.map((a) => (
                        <li
                          key={a}
                          className="rounded-full border border-border-strong px-2.5 py-0.5 text-xs font-medium text-ink"
                        >
                          {a}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted">
                      None of the common allergens.
                    </p>
                  )}
                  <p className="mt-2 text-xs text-faint">
                    Indicative only. If you have an allergy, please tell your
                    server — they will check with the kitchen.
                  </p>
                </div>
              )}

              {item.nutrition && (
                <div>
                  <h2 className="text-sm font-semibold text-ink">
                    Per serving
                  </h2>
                  <dl className="mt-2 grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: "kcal", value: item.nutrition.kcal },
                      { label: "Protein", value: `${item.nutrition.protein}g` },
                      { label: "Carbs", value: `${item.nutrition.carbs}g` },
                      { label: "Fat", value: `${item.nutrition.fat}g` },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="rounded-lg border border-border bg-surface px-1 py-2"
                      >
                        <dt className="sr-only">{row.label}</dt>
                        <dd className="font-display text-base font-bold text-ink">
                          {row.value}
                        </dd>
                        <p className="text-[10px] uppercase tracking-wide text-faint">
                          {row.label}
                        </p>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-2 text-xs text-faint">
                    Estimated figures, not lab-tested.
                  </p>
                </div>
              )}
            </div>
          )}

          <dl className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm">
            <div className="flex items-start gap-3">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <div>
                <dt className="font-medium text-ink">Available</dt>
                <dd className="text-muted">{restaurantInfo.hours}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <div>
                <dt className="font-medium text-ink">
                  Dine-in, pickup or delivery
                </dt>
                <dd className="text-muted">
                  Cooked to order at both our Saddar and E-7 kitchens.
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      <TrackRecentlyViewed itemId={item.id} />

      <DishReviews itemId={item.id} itemName={item.name} />

      <RecentlyViewed excludeId={item.id} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-ink">
            More from {item.category}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <MenuItemCard key={r.id} item={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
