"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { CartLine, MenuItem } from "@/lib/types";
import { DELIVERY_FEE, TAX_RATE } from "@/lib/data";

interface CartContextValue {
  lines: CartLine[];
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  /** Kitchen note for one line, e.g. "no jalapeños". Empty string clears it. */
  updateNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "food-app:cart";
const CART_EVENT = "food-app:cart-changed";

// useSyncExternalStore compares snapshots with Object.is and re-renders until
// two consecutive reads match, so both snapshot getters must return a stable
// reference. Returning a fresh `[]` from getServerSnapshot makes every read
// look like a change, which React reports as a potential infinite loop.
const EMPTY_LINES: CartLine[] = [];

let cachedRaw: string | null = null;
let cachedLines: CartLine[] = EMPTY_LINES;

function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedLines = raw ? (JSON.parse(raw) as CartLine[]) : EMPTY_LINES;
    } catch {
      cachedLines = EMPTY_LINES;
    }
  }
  return cachedLines;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY_LINES;
}

function subscribe(callback: () => void) {
  window.addEventListener(CART_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CART_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function writeCart(next: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, readCart, getServerSnapshot);

  const addItem = useCallback((item: MenuItem, quantity = 1) => {
    const current = readCart();
    const existing = current.find((line) => line.item.id === item.id);
    const next = existing
      ? current.map((line) =>
          line.item.id === item.id
            ? { ...line, quantity: line.quantity + quantity }
            : line
        )
      : [...current, { item, quantity }];
    writeCart(next);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    writeCart(readCart().filter((line) => line.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    const current = readCart();
    const next =
      quantity <= 0
        ? current.filter((line) => line.item.id !== itemId)
        : current.map((line) =>
            line.item.id === itemId ? { ...line, quantity } : line
          );
    writeCart(next);
  }, []);

  const updateNotes = useCallback((itemId: string, notes: string) => {
    const trimmed = notes.trim();
    writeCart(
      readCart().map((line) =>
        line.item.id === itemId
          ? { ...line, notes: trimmed || undefined }
          : line
      )
    );
  }, []);

  const clearCart = useCallback(() => writeCart(EMPTY_LINES), []);

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0),
    [lines]
  );

  const deliveryFee = lines.length > 0 ? DELIVERY_FEE : 0;
  const tax = useMemo(() => Math.round(subtotal * TAX_RATE), [subtotal]);
  const total = subtotal + deliveryFee + tax;

  const value: CartContextValue = {
    lines,
    addItem,
    removeItem,
    updateQuantity,
    updateNotes,
    clearCart,
    itemCount,
    subtotal,
    deliveryFee,
    tax,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
