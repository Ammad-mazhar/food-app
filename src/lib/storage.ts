"use client";

import { Order, Reservation } from "./types";

const ORDERS_KEY = "food-app:orders";
const ORDERS_EVENT = "food-app:orders-changed";
const RESERVATIONS_KEY = "food-app:reservations";
const RESERVATIONS_EVENT = "food-app:reservations-changed";

/**
 * Creates a small external store backed by localStorage, safe to use with
 * React's useSyncExternalStore (avoids setState-in-effect and hydration
 * mismatches entirely).
 */
function createListStore<T>(key: string, eventName: string) {
  let cachedRaw: string | null = null;
  let cachedParsed: T[] = [];

  function read(): T[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(key);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cachedParsed = raw ? (JSON.parse(raw) as T[]) : [];
      } catch {
        cachedParsed = [];
      }
    }
    return cachedParsed;
  }

  function getServerSnapshot(): T[] {
    return [];
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

  return { read, getServerSnapshot, subscribe, write, add };
}

export const ordersStore = createListStore<Order>(ORDERS_KEY, ORDERS_EVENT);
export const reservationsStore = createListStore<Reservation>(
  RESERVATIONS_KEY,
  RESERVATIONS_EVENT
);

export function saveOrder(order: Order): void {
  ordersStore.add(order);
}

export function saveReservation(reservation: Reservation): void {
  reservationsStore.add(reservation);
}
