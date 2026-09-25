import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Lists accounts and their roles.
 *
 *   npm run db:accounts:list
 *
 * Prints emails and roles only — never a hash, never a password. Useful for
 * confirming who can reach /admin after creating accounts.
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
  const accounts = await prisma.account.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: {
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true, reservations: true } },
    },
  });

  if (accounts.length === 0) {
    console.log("No accounts yet.");
    return;
  }

  console.log(`${accounts.length} account(s):\n`);
  console.log(
    "  " +
      "ROLE".padEnd(10) +
      "EMAIL".padEnd(34) +
      "ORDERS".padStart(7) +
      "BOOKINGS".padStart(10)
  );
  console.log("  " + "-".repeat(61));

  for (const a of accounts) {
    console.log(
      "  " +
        a.role.padEnd(10) +
        a.email.padEnd(34) +
        String(a._count.orders).padStart(7) +
        String(a._count.reservations).padStart(10)
    );
  }

  const admins = accounts.filter((a) => a.role === "ADMIN").length;
  const staff = accounts.filter((a) => a.role === "STAFF").length;
  console.log(`\n  ${admins} admin, ${staff} staff, can reach /admin: ${admins + staff}`);
  if (admins === 0) {
    console.log("\n  No ADMIN yet. Promote one with:");
    console.log("    npm run db:promote -- --email <address> --role admin");
  }
}

main()
  .catch((error) => {
    console.error("Failed: " + String(error?.message ?? error).split("\n")[0]);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
