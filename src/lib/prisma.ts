import "server-only";

import { PrismaClient } from "@/../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma client for the running app.
 *
 * Uses DATABASE_URL — on Supabase that's the *pooled* connection (port 6543).
 * Migrations use DIRECT_DATABASE_URL instead; see prisma7.config.ts for why
 * the two are not interchangeable.
 *
 * Two things this file is careful about:
 *
 * 1. LAZY. The client is built on first query, not on import. `next build`
 *    imports every route to collect its config, so constructing eagerly would
 *    make a database connection string a requirement just to compile — and the
 *    app would refuse to build on any machine or CI runner without one.
 *
 * 2. CACHED. Next's dev server re-evaluates modules on every hot reload, and a
 *    fresh connection pool per reload exhausts the database's connection limit
 *    within a few edits. Stashing it on globalThis survives the reload.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // A named, actionable error beats a driver-level failure at the first
    // query, which reads as a bug rather than as missing configuration.
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and add your Supabase pooled connection string."
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const client = createClient();
    // In production the module is evaluated once, so the global is only
    // strictly needed in dev — but caching in both keeps one code path.
    globalForPrisma.prisma = client;
  }
  return globalForPrisma.prisma;
}

/**
 * Behaves exactly like a PrismaClient, but defers construction until something
 * is actually read off it. `import { prisma }` on its own touches no database.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getClient();
    const value = Reflect.get(client, property, receiver);
    // Methods must keep their `this`, or `prisma.$transaction(...)` breaks.
    return typeof value === "function" ? value.bind(client) : value;
  },
  has(_target, property) {
    return property in getClient();
  },
});
