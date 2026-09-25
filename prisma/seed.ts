import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { menuItems, tables, promoCodes } from "../src/lib/data";

/**
 * Seeds the menu, tables and promo codes from the static files the app used
 * before it had a database, so a fresh Supabase project matches the site.
 *
 * Idempotent: everything is an upsert keyed on the natural id, so running it
 * twice changes nothing and re-running after a menu edit updates in place.
 * It never touches orders, reservations, reviews or accounts.
 */
const connectionString =
  process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "\nDATABASE_URL is not set. Copy .env.example to .env and add your Supabase connection string first.\n"
  );
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const KIND: Record<string, "PERCENT" | "FIXED" | "DELIVERY"> = {
  percent: "PERCENT",
  fixed: "FIXED",
  delivery: "DELIVERY",
};

async function main() {
  console.log("Seeding menu…");
  for (const [index, item] of menuItems.entries()) {
    const shared = {
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isVeg: item.isVeg,
      isSpicy: Boolean(item.isSpicy),
      isPopular: Boolean(item.isPopular),
      image: item.image ?? null,
      allergens: item.allergens ? [...item.allergens] : [],
      kcal: item.nutrition?.kcal ?? null,
      protein: item.nutrition?.protein ?? null,
      carbs: item.nutrition?.carbs ?? null,
      fat: item.nutrition?.fat ?? null,
      sortOrder: index,
    };
    await prisma.menuItem.upsert({
      where: { id: item.id },
      // isAvailable is left alone on update — staff may have marked something
      // sold out, and a reseed should not quietly put it back on the menu.
      update: shared,
      create: { id: item.id, ...shared },
    });
  }
  console.log(`  ${menuItems.length} dishes`);

  console.log("Seeding tables…");
  for (const table of tables) {
    await prisma.restaurantTable.upsert({
      where: { id: table.id },
      update: { label: table.label, seats: table.seats, location: table.location },
      create: {
        id: table.id,
        label: table.label,
        seats: table.seats,
        location: table.location,
      },
    });
  }
  console.log(`  ${tables.length} tables`);

  console.log("Seeding promo codes…");
  for (const promo of promoCodes) {
    const shared = {
      label: promo.label,
      kind: KIND[promo.kind],
      value: promo.value,
      minSubtotal: promo.minSubtotal,
    };
    await prisma.promoCode.upsert({
      where: { code: promo.code },
      update: shared,
      create: { code: promo.code, ...shared },
    });
  }
  console.log(`  ${promoCodes.length} codes`);

  // A staff login, only when explicitly asked for. Creating a privileged
  // account silently on every seed would be a nasty default.
  const staffEmail = process.env.SEED_STAFF_EMAIL;
  const staffPassword = process.env.SEED_STAFF_PASSWORD;

  if (staffEmail && staffPassword) {
    if (staffPassword.length < 12) {
      console.error("  SEED_STAFF_PASSWORD must be at least 12 characters.");
      process.exit(1);
    }
    await prisma.account.upsert({
      where: { email: staffEmail.toLowerCase() },
      update: { role: "STAFF" },
      create: {
        name: "Restaurant Staff",
        email: staffEmail.toLowerCase(),
        role: "STAFF",
        passwordHash: await bcrypt.hash(staffPassword, 12),
      },
    });
    // Deliberately does not echo the password back.
    console.log(`Staff account ready for ${staffEmail}`);
  } else {
    console.log(
      "No staff account created. Set SEED_STAFF_EMAIL and SEED_STAFF_PASSWORD to make one."
    );
  }

  console.log("\nDone.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
