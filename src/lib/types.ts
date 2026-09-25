export type MenuCategory =
  | "Starters"
  | "Main Course"
  | "Burgers & Sandwiches"
  | "Salads"
  | "Desserts"
  | "Beverages";

/**
 * Allergens we surface on the dish page.
 *
 * ⚠️ These are indicative, derived from each dish's description — not a
 * verified kitchen allergen matrix. The UI says so next to every list. Anyone
 * with a real allergy must be told to confirm with staff; do not present this
 * as authoritative until the kitchen has signed off on a proper matrix.
 */
export type Allergen =
  | "Gluten"
  | "Dairy"
  | "Egg"
  | "Soy"
  | "Nuts"
  | "Mustard"
  | "Sesame";

/** Rough per-serving figures. Estimates, labelled as such wherever shown. */
export interface Nutrition {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in PKR
  category: MenuCategory;
  isVeg: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  /** Path under /public to a real photo for this dish. Falls back to illustrated art when absent. */
  image?: string;
  allergens?: Allergen[];
  nutrition?: Nutrition;
}

/** A diner's rating of one dish, stored on their own device. */
export interface Review {
  id: string;
  itemId: string;
  rating: number; // 1-5
  author: string;
  comment?: string;
  createdAt: string;
}

export type PromoKind = "percent" | "fixed" | "delivery";

export interface PromoCode {
  code: string;
  label: string;
  kind: PromoKind;
  /** Percent off, rupees off, or ignored for a free-delivery code. */
  value: number;
  minSubtotal: number;
}

export interface CartLine {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderType = "delivery" | "pickup";
export type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "out-for-delivery"
  | "ready-for-pickup"
  | "completed"
  | "cancelled";

export interface Order {
  id: string;
  lines: CartLine[];
  type: OrderType;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  placedAt: string;
  address?: string;
  phone: string;
  customerName: string;
  paymentMethod: "cash" | "card" | "wallet";
  /** Promo applied at checkout, kept so the receipt can show the saving. */
  promoCode?: string;
  discount?: number;
  /** Loyalty points this order earned, frozen at the time it was placed. */
  pointsEarned?: number;
}

/**
 * A locally-stored demo account. This app has no backend, so accounts live in
 * localStorage on the visitor's own device and never leave it. The password is
 * kept only as a SHA-256 digest (see `hashPassword` in lib/auth) so a plaintext
 * password is never written to storage — but this is still demo-grade auth, not
 * a real authentication system. Swap it for a server before handling real
 * customer accounts.
 */
export interface Account {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  passwordHash: string;
  createdAt: string;
}

export type ReservationStatus = "requested" | "confirmed" | "cancelled" | "completed";

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  partySize: number;
  tableId?: string;
  notes?: string;
  status: ReservationStatus;
}

export interface RestaurantTable {
  id: string;
  label: string;
  seats: number;
  location: "Indoor" | "Outdoor" | "Rooftop" | "Private Room";
}
