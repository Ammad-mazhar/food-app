import "server-only";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { UnauthorizedError } from "@/lib/session";

/**
 * Shared shapes for the route handlers.
 *
 * Every endpoint validates its body with zod before it reaches Prisma. The
 * client is not trusted for prices either: a request says *which* dish and how
 * many, and the server looks the price up. Otherwise anyone could post an order
 * with `price: 1`.
 */

export const emailSchema = z.string().trim().toLowerCase().email();
export const phoneSchema = z.string().trim().min(7).max(20);

export const signupSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal("")),
  password: z.string().min(8).max(200),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(200),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  phone: phoneSchema.optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
});

export const orderLineInputSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
  notes: z.string().trim().max(200).optional(),
});

export const createOrderSchema = z.object({
  type: z.enum(["DELIVERY", "PICKUP"]),
  customerName: z.string().trim().min(1).max(80),
  phone: phoneSchema,
  address: z.string().trim().max(300).optional(),
  paymentMethod: z.enum(["CASH", "CARD", "WALLET"]),
  promoCode: z.string().trim().max(40).optional(),
  lines: z.array(orderLineInputSchema).min(1).max(50),
});

export const createReservationSchema = z.object({
  name: z.string().trim().min(1).max(80),
  phone: phoneSchema,
  // YYYY-MM-DD
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  // HH:mm
  time: z.string().regex(/^\d{2}:\d{2}$/),
  partySize: z.number().int().min(1).max(30),
  tableId: z.string().optional(),
  notes: z.string().trim().max(300).optional(),
});

export const createReviewSchema = z.object({
  menuItemId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(500).optional(),
  author: z.string().trim().min(1).max(80).optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    "PLACED",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "READY_FOR_PICKUP",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export const reservationStatusSchema = z.object({
  status: z.enum(["REQUESTED", "CONFIRMED", "CANCELLED", "COMPLETED"]),
});

// ------------------------------------------------------------- responses

export function ok<T>(data: T, init?: ResponseInit) {
  return Response.json(data, init);
}

export function badRequest(message: string, issues?: unknown) {
  return Response.json({ error: message, issues }, { status: 400 });
}

export function unauthorized() {
  return Response.json({ error: "Not authorized" }, { status: 401 });
}

export function notFound(message = "Not found") {
  return Response.json({ error: message }, { status: 404 });
}

export function conflict(message: string) {
  return Response.json({ error: message }, { status: 409 });
}

/**
 * Wraps a handler so unexpected failures become a clean 500 instead of leaking
 * a stack trace or a Prisma error string to the client. The detail still goes
 * to the server log where staff can find it.
 */
export async function handle(
  fn: () => Promise<Response>
): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof UnauthorizedError) return unauthorized();
    if (error instanceof z.ZodError) {
      return badRequest("Those details aren't valid.", error.issues);
    }
    console.error("[api]", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Crockford-ish alphabet: no 0/O/1/I/L, so a code can be read down a phone
 * line without ambiguity. Exactly 32 characters, which matters below.
 */
const REFERENCE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/**
 * Short, unambiguous code for staff and customers to say out loud.
 *
 * This is an IDENTIFIER, NOT A SECRET. It is short enough to brute-force, so
 * nothing may be authorized by possession of a reference alone — guest order
 * lookup uses the separate high-entropy token below. See BACKEND.md.
 *
 * Still generated with a CSPRNG rather than Math.random(): V8's PRNG state can
 * be recovered from a handful of observed outputs, which would let anyone who
 * placed one order enumerate their neighbours' references. Predictable ids are
 * worth avoiding even when they aren't the access control.
 *
 * 256 is divisible by 32, so `byte % 32` is uniform — no modulo bias.
 */
export function makeReference(prefix: string): string {
  const bytes = randomBytes(8);
  let out = "";
  for (const byte of bytes) {
    out += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
  }
  return `${prefix}-${out}`;
}

/**
 * 128-bit URL-safe token. This IS the secret: it's what lets someone who
 * checked out as a guest open their own order and nobody else's, since there
 * is no account to authenticate against.
 *
 * Returned once at checkout, carried in the tracking link, and compared in
 * constant time on the way back in.
 */
export function makeAccessToken(): string {
  return randomBytes(16).toString("base64url");
}
