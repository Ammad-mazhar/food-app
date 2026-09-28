"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

interface FavouritesContextValue {
  /** Whether this dish is hearted. False until the fetch lands. */
  isFavourite: (menuItemId: string) => boolean;
  /** Record a known state locally, so every heart for that dish agrees. */
  setFavourite: (menuItemId: string, value: boolean) => void;
}

const FavouritesContext = createContext<FavouritesContextValue | undefined>(
  undefined
);

/**
 * Which dishes the visitor has hearted, fetched once per session.
 *
 * This exists because /menu and /menu/[id] are cached now: their HTML is shared
 * by everyone, so it cannot contain one person's favourites. Fetching in the
 * browser is what lets those pages stay on the CDN.
 *
 * Holding the set here rather than per page also means the two hearts for the
 * same dish on a dish page — the one on the photo and the one in the related
 * list — cannot disagree after a toggle.
 */
export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/favourites");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data.menuItemIds)) {
          setIds(new Set<string>(data.menuItemIds));
        }
      } catch {
        // Offline, or the request was cut short. Hearts stay empty, and
        // toggling still works — the server is the source of truth.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const isFavourite = useCallback(
    (menuItemId: string) => ids.has(menuItemId),
    [ids]
  );

  const setFavourite = useCallback((menuItemId: string, value: boolean) => {
    setIds((current) => {
      if (current.has(menuItemId) === value) return current;
      const next = new Set(current);
      if (value) next.add(menuItemId);
      else next.delete(menuItemId);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ isFavourite, setFavourite }),
    [isFavourite, setFavourite]
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites(): FavouritesContextValue {
  const ctx = useContext(FavouritesContext);
  if (!ctx) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return ctx;
}
