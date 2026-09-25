"use client";

import { Account, Order, Reservation, Review } from "./types";

const ORDERS_KEY = "food-app:orders";
const ORDERS_EVENT = "food-app:orders-changed";
const RESERVATIONS_KEY = "food-app:reservations";
const RESERVATIONS_EVENT = "food-app:reservations-changed";
const ACCOUNTS_KEY = "food-app:accounts";
const ACCOUNTS_EVENT = "food-app:accounts-changed";
const SESSION_KEY = "food-app:session";
const SESSION_EVENT = "food-app:session-changed";

/**
 * useSyncExternalStore compares snapshots with Object.is and keeps re-reading
 * until two consecutive reads match, so a getter that builds a fresh `[]` each
 * call looks like an endless stream of changes. Every store below returns this
 * one shared empty array instead.
 */
const EMPTY: readonly never[] = [];

function emptyOf<T>(): T[] {
  return EMPTY as unknown as T[];
}

/**
 * Creates a small external store backed by localStorage, safe to use with
 * React's useSyncExternalStore (avoids setState-in-effect and hydration
 * mismatches entirely).
 */
function createListStore<T>(key: string, eventName: string) {
  let cachedRaw: string | null = null;
  let cachedParsed: T[] = emptyOf<T>();

  function read(): T[] {
    if (typeof window === "undefined") return emptyOf<T>();
    const raw = localStorage.getItem(key);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cachedParsed = raw ? (JSON.parse(raw) as T[]) : emptyOf<T>();
      } catch {
        cachedParsed = emptyOf<T>();
      }
    }
    return cachedParsed;
  }

  function getServerSnapshot(): T[] {
    return emptyOf<T>();
  }

  function subscribe(callback: () => void) {
    window.addEventListener(eventName, callback);
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener(eventName, callback);
      window.removeEventListener("storage", callback);
    };
  }

  function write(next: T[]) {
    localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event(eventName));
  }

  function add(item: T) {
    write([item, ...read()]);
  }

  /** Replaces the list with the result of `updater`, then notifies readers. */
  function update(updater: (items: T[]) => T[]) {
    write(updater(read()));
  }

  return { read, getServerSnapshot, subscribe, write, add, update };
}

/** Same idea as createListStore, but holds a single nullable value. */
function createValueStore<T>(key: string, eventName: string) {
  let cachedRaw: string | null = null;
  let cachedParsed: T | null = null;

  function read(): T | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(key);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cachedParsed = raw ? (JSON.parse(raw) as T) : null;
      } catch {
        cachedParsed = null;
      }
    }
    return cachedParsed;
  }

  function getServerSnapshot(): T | null {
    return null;
  }

  function subscribe(callback: () => void) {
    window.addEventListener(eventName, callback);
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener(eventName, callback);
      window.removeEventListener("storage", callback);
    };
  }

  function write(next: T | null) {
    if (next === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event(eventName));
  }

  return { read, getServerSnapshot, subscribe, write };
}

export const ordersStore = createListStore<Order>(ORDERS_KEY, ORDERS_EVENT);
export const reservationsStore = createListStore<Reservation>(
  RESERVATIONS_KEY,
  RESERVATIONS_EVENT
);
export const accountsStore = createListStore<Account>(
  ACCOUNTS_KEY,
  ACCOUNTS_EVENT
);
/** Holds the signed-in account's id, not the account itself. */
export const sessionStore = createValueStore<string>(SESSION_KEY, SESSION_EVENT);

export function saveOrder(order: Order): void {
  ordersStore.add(order);
}

export function saveReservation(reservation: Reservation): void {
  reservationsStore.add(reservation);
}

export function updateOrderStatus(id: string, status: Order["status"]): void {
  ordersStore.update((orders) =>
    orders.map((order) => (order.id === id ? { ...order, status } : order))
  );
}

export function updateReservationStatus(
  id: string,
  status: Reservation["status"]
): void {
  reservationsStore.update((list) =>
    list.map((res) => (res.id === id ? { ...res, status } : res))
  );
}

/* ---------------------------------------------------------------- *
 * Favourites, reviews and recently-viewed.
 *
 * All three are per-device: they never leave this browser, so a diner
 * who switches phones starts fresh, and reviews are visible only to
 * their author. When these move to Supabase, swap the bodies below —
 * every caller goes through these functions, not localStorage.
 * ---------------------------------------------------------------- */

const FAVOURITES_KEY = "food-app:favourites";
const FAVOURITES_EVENT = "food-app:favourites-changed";
const REVIEWS_KEY = "food-app:reviews";
const REVIEWS_EVENT = "food-app:reviews-changed";
const RECENT_KEY = "food-app:recently-viewed";
const RECENT_EVENT = "food-app:recently-viewed-changed";

/** Menu item ids the visitor has hearted. */
export const favouritesStore = createListStore<string>(
  FAVOURITES_KEY,
  FAVOURITES_EVENT
);
export const reviewsStore = createListStore<Review>(REVIEWS_KEY, REVIEWS_EVENT);
export const recentlyViewedStore = createListStore<string>(
  RECENT_KEY,
  RECENT_EVENT
);

export function isFavourite(id: string): boolean {
  return favouritesStore.read().includes(id);
}

export function toggleFavourite(id: string): void {
  favouritesStore.update((ids) =>
    ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids]
  );
}

export function saveReview(review: Review): void {
  reviewsStore.add(review);
}

export function deleteReview(id: string): void {
  reviewsStore.update((list) => list.filter((r) => r.id !== id));
}

const RECENT_LIMIT = 8;

/** Moves an id to the front, de-duplicated, capped at RECENT_LIMIT. */
export function recordRecentlyViewed(id: string): void {
  const current = recentlyViewedStore.read();
  if (current[0] === id) return; // already the most recent — don't churn storage
  recentlyViewedStore.write(
    [id, ...current.filter((x) => x !== id)].slice(0, RECENT_LIMIT)
  );
}
