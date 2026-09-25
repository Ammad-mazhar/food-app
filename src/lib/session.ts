import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Account } from "@/../generated/prisma/client";

export const SESSION_COOKIE = "tsh_session";
const SESSION_DAYS = 30;

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value) {
    throw new Error(
      'SESSION_SECRET is not set. Generate one with `node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"` and add it to .env.'
    );
  }
  return value;
}

/**
 * The cookie carries a random token; the database stores only an HMAC of it.
 *
 * That way a dump of the session table is not a list of working credentials —
 * an attacker would also need SESSION_SECRET to derive a usable token. It also
 * means we can look a session up by exact id rather than scanning.
 */
function tokenToId(token: string): string {
  return createHmac("sha256", secret()).update(token).digest("hex");
}

export async function createSession(accountId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { id: tokenToId(token), accountId, expiresAt },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/** The signed-in account, or null. Safe to call from any server context. */
export async function getSessionAccount(): Promise<Account | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { id: tokenToId(token) },
    include: { account: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    // Clean up as we go rather than relying on a cron to sweep.
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return session.account;
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session
      .delete({ where: { id: tokenToId(token) } })
      .catch(() => {
        // Already gone — logging out twice is not an error.
      });
  }

  store.delete(SESSION_COOKIE);
}

/**
 * True for STAFF and ADMIN — admin is staff plus more, never less.
 *
 * Typed as a predicate so `if (!isStaff(account)) return …` narrows `account`
 * to non-null afterwards, rather than every caller needing its own null check.
 */
export function isStaff(account: Account | null): account is Account {
  return account?.role === "STAFF" || account?.role === "ADMIN";
}

export function isAdmin(account: Account | null): account is Account {
  return account?.role === "ADMIN";
}

/** Throws a 401-shaped error unless the caller is signed in as staff or admin. */
export async function requireStaff(): Promise<Account> {
  const account = await getSessionAccount();
  if (!isStaff(account)) throw new UnauthorizedError();
  return account;
}

/** Throws unless the caller is an admin specifically. */
export async function requireAdmin(): Promise<Account> {
  const account = await getSessionAccount();
  if (!isAdmin(account)) throw new UnauthorizedError();
  return account;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Not authorized");
    this.name = "UnauthorizedError";
  }
}

/**
 * Constant-time string compare, for anywhere a secret is checked directly.
 * `===` leaks length and position through timing.
 */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
