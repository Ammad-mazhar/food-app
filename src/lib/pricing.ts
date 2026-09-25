/**
 * Pricing rules shared by the browser and the server.
 *
 * Deliberately free of any import so it can be pulled into a route handler, a
 * server component or the client bundle without dragging the menu with it. The
 * server is the authority — these constants exist here so the cart can show an
 * accurate running total before the order is posted, not so the client can
 * decide what to charge.
 */

export const DELIVERY_FEE = 150;
export const TAX_RATE = 0.05;

/** One point per Rs. 100 spent; 100 points is worth Rs. 500 off. */
export const LOYALTY_RUPEES_PER_POINT = 100;
export const LOYALTY_POINTS_PER_REWARD = 100;
export const LOYALTY_REWARD_VALUE = 500;

export function pointsForOrderTotal(total: number): number {
  return Math.floor(total / LOYALTY_RUPEES_PER_POINT);
}
