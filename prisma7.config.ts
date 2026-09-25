import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma CLI configuration (migrate, db pull, studio).
 *
 * Prisma 7 keeps the connection URL out of schema.prisma, so it is read from
 * the environment here and never committed.
 *
 * Supabase gives you two connection strings and they are not interchangeable:
 *
 *   DIRECT_DATABASE_URL  port 5432, a direct session connection. Migrations
 *                        need this — they take advisory locks and issue DDL,
 *                        which a transaction pooler drops.
 *   DATABASE_URL         port 6543, the pooled connection. That one is for the
 *                        running app (see src/lib/prisma.ts).
 *
 * Falls back to DATABASE_URL so a plain local Postgres works with one variable.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_DATABASE_URL"] ?? process.env["DATABASE_URL"],
  },
});
