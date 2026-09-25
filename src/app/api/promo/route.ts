import { prisma } from "@/lib/prisma";
import { badRequest, handle, ok } from "@/lib/api";

/**
 * Check a promo code against a subtotal before checkout, so the cart can show
 * the saving. The authoritative check still happens when the order is placed —
 * this endpoint is a preview, not permission.
 */
export async function POST(request: Request) {
  return handle(async () => {
    const body = await request.json().catch(() => null);
    const code =
      body && typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    const subtotal =
      body && typeof body.subtotal === "number" ? body.subtotal : NaN;

    if (!code) return badRequest("Enter a promo code.");
    if (!Number.isFinite(subtotal) || subtotal < 0) {
      return badRequest("Subtotal is required.");
    }

    const promo = await prisma.promoCode.findUnique({ where: { code } });

    // Same message for unknown, expired and used-up: a valid-code oracle lets
    // someone enumerate live promotions.
    const unusable = { valid: false as const, error: "That code can't be used right now." };

    if (!promo || !promo.isActive) return ok(unusable);
    if (promo.expiresAt && promo.expiresAt <= new Date()) return ok(unusable);
    if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
      return ok(unusable);
    }
    if (subtotal < promo.minSubtotal) {
      return ok({
        valid: false as const,
        error: `Spend at least Rs. ${promo.minSubtotal.toLocaleString("en-PK")} to use ${promo.code}.`,
      });
    }

    return ok({
      valid: true as const,
      code: promo.code,
      label: promo.label,
      kind: promo.kind,
      value: promo.value,
      minSubtotal: promo.minSubtotal,
    });
  });
}
