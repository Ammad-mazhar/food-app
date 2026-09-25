import { MenuItem, PromoCode, RestaurantTable } from "./types";

// Dish names and descriptions are based on real, publicly documented menu
// items for Texas Steak House (Rawalpindi). Prices were not publicly listed,
// so the figures below are indicative estimates for this demo — please
// confirm current prices with the restaurant directly.

export const menuItems: MenuItem[] = [
  {
    id: "s1",
    name: "Loaded Nachos",
    description:
      "Crisp tortilla chips piled with melted cheese, jalapeños, salsa, and sour cream.",
    price: 650,
    category: "Starters",
    isVeg: true,
    isPopular: true,
    image: "/images/pexels-himanuuu-36989884.jpg",
    allergens: ["Dairy", "Gluten"],
    nutrition: { kcal: 620, protein: 18, carbs: 52, fat: 38 },
  },
  {
    id: "s2",
    name: "Garlic Bread",
    description: "Warm, buttery garlic bread — a Texas Steak House classic starter.",
    price: 350,
    category: "Starters",
    isVeg: true,
    isPopular: true,
    image: "/images/pexels-jack-baghel-2199968-20446381.jpg",
    allergens: ["Gluten", "Dairy"],
    nutrition: { kcal: 380, protein: 9, carbs: 44, fat: 18 },
  },
  {
    id: "s3",
    name: "Harvest Salad",
    description: "Fresh greens, seasonal vegetables, and a light house dressing.",
    price: 550,
    category: "Starters",
    isVeg: true,
    image: "/images/pexels-visualstoriesbytugba-36425896.jpg",
    allergens: ["Mustard"],
    nutrition: { kcal: 180, protein: 6, carbs: 18, fat: 9 },
  },
  {
    id: "m1",
    name: "Texas Fire Steak",
    description:
      "Our signature fire-grilled steak, fresh never frozen, finished with a smoky spice rub.",
    price: 2200,
    category: "Main Course",
    isVeg: false,
    isSpicy: true,
    isPopular: true,
    image: "/images/pexels-madknoxxdeluxe-37923406.jpg",
    allergens: [],
    nutrition: { kcal: 720, protein: 58, carbs: 6, fat: 52 },
  },
  {
    id: "m2",
    name: "New York Strip",
    description: "A classic hand-cut strip steak, char-grilled to your liking.",
    price: 2600,
    category: "Main Course",
    isVeg: false,
    isPopular: true,
    image: "/images/pexels-lunajoie-19285833.jpg",
    allergens: [],
    nutrition: { kcal: 680, protein: 55, carbs: 4, fat: 49 },
  },
  {
    id: "m3",
    name: "Twin Steak Combo",
    description: "Beef and chicken steak served together with grilled vegetables.",
    price: 2400,
    category: "Main Course",
    isVeg: false,
    isPopular: true,
    image: "/images/pexels-nosh-caterers-2148640437-30203310.jpg",
    allergens: [],
    nutrition: { kcal: 890, protein: 72, carbs: 14, fat: 60 },
  },
  {
    id: "m4",
    name: "Chicken Fried Steak",
    description: "Breaded and pan-fried steak, smothered in creamy country gravy.",
    price: 1800,
    category: "Main Course",
    isVeg: false,
    image: "/images/pexels-erwin-quintana-917658-7963208.jpg",
    allergens: ["Gluten", "Egg", "Dairy"],
    nutrition: { kcal: 840, protein: 46, carbs: 48, fat: 52 },
  },
  {
    id: "m5",
    name: "Iron Skillet Steak",
    description: "Sizzling steak served straight from the skillet with sautéed onions.",
    price: 2100,
    category: "Main Course",
    isVeg: false,
    isSpicy: true,
    image: "/images/pexels-drmkhawarnazir-34193415.jpg",
    allergens: [],
    nutrition: { kcal: 700, protein: 54, carbs: 10, fat: 48 },
  },
  {
    id: "m6",
    name: "Super Cheesy Chicken",
    description: "Grilled chicken breast smothered in a rich, gooey cheese sauce.",
    price: 1600,
    category: "Main Course",
    isVeg: false,
    image: "/images/pexels-dhiraj-jain-207743066-12737805.jpg",
    allergens: ["Dairy"],
    nutrition: { kcal: 760, protein: 52, carbs: 12, fat: 55 },
  },
  {
    id: "b1",
    name: "Texas Chili Burger",
    description: "A hearty beef patty topped with spiced chili and melted cheese.",
    price: 950,
    category: "Burgers & Sandwiches",
    isVeg: false,
    isSpicy: true,
    isPopular: true,
    image: "/images/pexels-abdelilah-hibat-allah-1652683667-33408979.jpg",
    allergens: ["Gluten", "Dairy", "Sesame"],
    nutrition: { kcal: 820, protein: 42, carbs: 54, fat: 46 },
  },
  {
    id: "b2",
    name: "Texas Chicken Burger",
    description: "Crispy chicken fillet burger with lettuce, tomato, and house sauce.",
    price: 850,
    category: "Burgers & Sandwiches",
    isVeg: false,
    image: "/images/pexels-shameel-mukkath-3421394-5639696.jpg",
    allergens: ["Gluten", "Egg", "Sesame"],
    nutrition: { kcal: 780, protein: 38, carbs: 58, fat: 42 },
  },
  {
    id: "b3",
    name: "Chicken Salad Sandwich",
    description: "Grilled chicken, fresh greens, and mayo on toasted bread.",
    price: 750,
    category: "Burgers & Sandwiches",
    isVeg: false,
    image: "/images/pexels-rajesh-tp-749235-1633525.jpg",
    allergens: ["Gluten", "Egg"],
    nutrition: { kcal: 590, protein: 32, carbs: 46, fat: 30 },
  },
  {
    id: "sd1",
    name: "Black & Blue Sirloin Salad",
    description: "Blackened sirloin strips over crisp greens with blue cheese crumble.",
    price: 1450,
    category: "Salads",
    isVeg: false,
    isPopular: true,
    image: "/images/pexels-kamrujjamanjewel-24866519.jpg",
    allergens: ["Dairy"],
    nutrition: { kcal: 520, protein: 40, carbs: 12, fat: 34 },
  },
  {
    id: "d1",
    name: "New York Cheesecake",
    description: "Rich, creamy cheesecake with a buttery biscuit base.",
    price: 480,
    category: "Desserts",
    isVeg: true,
    isPopular: true,
    image: "/images/dessert5.jpg",
    allergens: ["Gluten", "Dairy", "Egg"],
    nutrition: { kcal: 450, protein: 8, carbs: 38, fat: 29 },
  },
  {
    id: "d2",
    name: "Chocolate Brownie",
    description: "Warm fudge brownie served with a scoop of vanilla ice cream.",
    price: 420,
    category: "Desserts",
    isVeg: true,
    image: "/images/dessert6.jpg",
    allergens: ["Gluten", "Dairy", "Egg"],
    nutrition: { kcal: 520, protein: 7, carbs: 58, fat: 28 },
  },
  {
    id: "v1",
    name: "Fresh Lime Soda",
    description: "Refreshing lime, soda, and a hint of mint.",
    price: 250,
    category: "Beverages",
    isVeg: true,
    image: "/images/fresh lime soda.jpg",
    allergens: [],
    nutrition: { kcal: 90, protein: 0, carbs: 23, fat: 0 },
  },
  {
    id: "v2",
    name: "Iced Tea",
    description: "Chilled, lightly sweetened black tea.",
    price: 280,
    category: "Beverages",
    isVeg: true,
    isPopular: true,
    image: "/images/iced tea.jpg",
    allergens: [],
    nutrition: { kcal: 70, protein: 0, carbs: 18, fat: 0 },
  },
];

export const menuCategories = Array.from(
  new Set(menuItems.map((item) => item.category))
);

export const tables: RestaurantTable[] = [
  { id: "t1", label: "T1", seats: 2, location: "Indoor" },
  { id: "t2", label: "T2", seats: 2, location: "Indoor" },
  { id: "t3", label: "T3", seats: 4, location: "Indoor" },
  { id: "t4", label: "T4", seats: 4, location: "Outdoor" },
  { id: "t5", label: "T5", seats: 6, location: "Outdoor" },
  { id: "t6", label: "T6", seats: 8, location: "Rooftop" },
  { id: "t7", label: "T7", seats: 10, location: "Private Room" },
];

/*
 * Pricing rules now live in lib/pricing.ts so the server can share them. These
 * re-exports keep the existing imports across the app working.
 */
export {
  DELIVERY_FEE,
  TAX_RATE,
  LOYALTY_RUPEES_PER_POINT,
  LOYALTY_POINTS_PER_REWARD,
  LOYALTY_REWARD_VALUE,
  pointsForOrderTotal,
} from "./pricing";

/**
 * Promo codes accepted at checkout.
 *
 * ⚠️ These are demo codes with no server behind them — anyone can read them out
 * of the JavaScript bundle, and nothing stops a code being reused forever.
 * Before running a real promotion, move validation to the backend so codes can
 * be issued, limited and revoked.
 */
export const promoCodes: PromoCode[] = [
  {
    code: "HOWDY10",
    label: "10% off your order",
    kind: "percent",
    value: 10,
    minSubtotal: 1000,
  },
  {
    code: "SADDAR200",
    label: "Rs. 200 off orders over Rs. 2,000",
    kind: "fixed",
    value: 200,
    minSubtotal: 2000,
  },
  {
    code: "FREEDEL",
    label: "Free delivery",
    kind: "delivery",
    value: 0,
    minSubtotal: 1500,
  },
];

/** Returns the discount in rupees, plus whether delivery is waived. */
export function applyPromo(
  promo: PromoCode,
  subtotal: number,
  deliveryFee: number
): { discount: number; waivesDelivery: boolean } {
  if (subtotal < promo.minSubtotal) return { discount: 0, waivesDelivery: false };
  if (promo.kind === "percent")
    return { discount: Math.round((subtotal * promo.value) / 100), waivesDelivery: false };
  if (promo.kind === "fixed")
    return { discount: Math.min(promo.value, subtotal), waivesDelivery: false };
  return { discount: 0, waivesDelivery: deliveryFee > 0 };
}

export function findPromo(code: string): PromoCode | undefined {
  const normalized = code.trim().toUpperCase();
  return promoCodes.find((p) => p.code === normalized);
}
