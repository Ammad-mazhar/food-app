"use client";

import { useSyncExternalStore } from "react";
import { favouritesStore, toggleFavourite } from "@/lib/storage";
import { HeartIcon } from "@/components/icons";

/**
 * Heart toggle for one dish. Reads through the favourites store so every
 * instance on the page — the card, the dish header, the favourites list —
 * stays in step without prop drilling.
 */
export default function FavoriteButton({
  itemId,
  itemName,
  variant = "overlay",
}: {
  itemId: string;
  itemName: string;
  /** "overlay" sits on a photo; "inline" sits on a paper surface. */
  variant?: "overlay" | "inline";
}) {
  const favourites = useSyncExternalStore(
    favouritesStore.subscribe,
    favouritesStore.read,
    favouritesStore.getServerSnapshot
  );
  const isFav = favourites.includes(itemId);

  const label = isFav
    ? `Remove ${itemName} from favourites`
    : `Save ${itemName} to favourites`;

  return (
    <button
      type="button"
      // Cards wrap their image in a link; without this the heart would
      // navigate to the dish instead of toggling.
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavourite(itemId);
      }}
      aria-pressed={isFav}
      aria-label={label}
      title={label}
      className={
        variant === "overlay"
          ? `flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-sm transition hover:scale-110 active:scale-95 ${
              isFav
                ? "border-ember bg-ember text-cream"
                : "border-cream/40 bg-black/35 text-cream hover:bg-black/60"
            }`
          : `flex h-10 w-10 items-center justify-center rounded-full border transition hover:scale-110 active:scale-95 ${
              isFav
                ? "border-ember bg-ember text-cream"
                : "border-border-strong text-ink hover:border-ember hover:text-ember"
            }`
      }
    >
      <HeartIcon
        className={variant === "overlay" ? "h-4 w-4" : "h-5 w-5"}
        filled={isFav}
      />
    </button>
  );
}
