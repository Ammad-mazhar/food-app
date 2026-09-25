"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartIcon } from "@/components/icons";

/**
 * Heart toggle for one dish, backed by the database.
 *
 * The initial state comes from the server render, so there's no flash of an
 * empty heart on a dish the visitor has already saved. The toggle is optimistic
 * and rolls back if the request fails; a 401 means they aren't signed in, which
 * is a prompt rather than an error.
 */
export default function FavoriteButton({
  itemId,
  itemName,
  initialFavourite = false,
  variant = "overlay",
}: {
  itemId: string;
  itemName: string;
  initialFavourite?: boolean;
  /** "overlay" sits on a photo; "inline" sits on a paper surface. */
  variant?: "overlay" | "inline";
}) {
  const router = useRouter();
  const [isFav, setIsFav] = useState(initialFavourite);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [busy, setBusy] = useState(false);

  async function toggle(e: React.MouseEvent) {
    // Cards wrap their image in a link; without this the heart would navigate
    // to the dish instead of toggling.
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;

    const optimistic = !isFav;
    setIsFav(optimistic);
    setBusy(true);
    setNeedsLogin(false);

    try {
      const res = await fetch("/api/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItemId: itemId }),
      });

      if (res.status === 401) {
        setIsFav(!optimistic);
        setNeedsLogin(true);
        return;
      }
      if (!res.ok) {
        setIsFav(!optimistic);
        return;
      }

      const data = await res.json();
      setIsFav(Boolean(data.isFavourite));
      // Keeps the /favourites page in step if it's the next thing they open.
      router.refresh();
    } catch {
      setIsFav(!optimistic);
    } finally {
      setBusy(false);
    }
  }

  const label = needsLogin
    ? "Log in to save favourites"
    : isFav
      ? `Remove ${itemName} from favourites`
      : `Save ${itemName} to favourites`;

  return (
    <button
      type="button"
      onClick={toggle}
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
