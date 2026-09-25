import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Connectivity and contents check.
 *
 * Deliberately uses DATABASE_URL — the same connection the running app uses —
 * so a pass here means the app can actually reach the database, not just that
 * migrations could. Run it after changing .env or deploying.
 *
 *   npm run db:check
 *
 * Prints no connection details, so its output is safe to paste into an issue.
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set. See BACKEND.md.");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const started = Date.now();

  const [menu, available, tables, promos, accounts, staff, orders, reservations, reviews] =
    await Promise.all([
      prisma.menuItem.count(),
      prisma.menuItem.count({ where: { isAvailable: true } }),
      prisma.restaurantTable.count(),
      prisma.promoCode.count({ where: { isActive: true } }),
      prisma.account.count(),
      prisma.account.count({ where: { role: "STAFF" } }),
      prisma.order.count(),
      prisma.reservation.count(),
      prisma.review.count(),
    ]);

  console.log(`Connected in ${Date.now() - started}ms\n`);
  console.log("  menu items      " + menu + " (" + available + " available)");
  console.log("  tables          " + tables);
  console.log("  active promos   " + promos);
  console.log("  accounts        " + accounts + " (" + staff + " staff)");
  console.log("  orders          " + orders);
  console.log("  reservations    " + reservations);
  console.log("  reviews         " + reviews);

  const problems: string[] = [];
  if (menu === 0) problems.push("No menu items — run `npm run db:seed`.");
  if (tables === 0) problems.push("No tables — run `npm run db:seed`.");
  if (staff === 0) {
    problems.push(
      "No staff account — /admin will be unreachable. See BACKEND.md step 4."
    );
  }

  if (problems.length > 0) {
    console.log("\nTo do:");
    for (const p of problems) console.log("  - " + p);
  } else {
    console.log("\nAll good.");
  }
}

main()
  .catch((error: unknown) => {
    console.error("\nCould not reach the database.");

    // Prisma leads with a code frame and buries the real cause underneath, so
    // taking the first few lines showed the source of this file rather than
    // what actually went wrong. Walk the cause chain and keep the lines that
    // name a failure instead.
    const parts: string[] = [];
    let current: unknown = error;
    while (current instanceof Error && parts.length < 4) {
      parts.push(current.message);
      current = current.cause;
    }

    const scrubbed = parts
      .join("\n")
      .replace(/postgres(ql)?:\/\/\S+/gi, "<connection string>");

    const meaningful = scrubbed
      .split("\n")
      .map((l) => l.trim())
      .filter(
        (l) =>
          l.length > 0 &&
          !/^\d+\s*$/.test(l) && // bare line numbers from the code frame
          !l.startsWith("const ") &&
          !l.includes("check.ts")
      );

    for (const line of meaningful.slice(-6)) console.error("  " + line);

    if (/ENETUNREACH|EHOSTUNREACH|ENOTFOUND|timeout|ETIMEDOUT/i.test(scrubbed)) {
      console.error(
        "\n  This usually means DATABASE_URL points at Supabase's DIRECT host\n" +
          "  (db.<ref>.supabase.co), which is IPv6-only. Use the Transaction\n" +
          "  pooler string instead — port 6543, ending in ?pgbouncer=true."
      );
    }
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
