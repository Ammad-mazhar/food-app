import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Creates several staff/admin accounts in one go, from .env.
 *
 *   npm run db:accounts
 *
 * Reads these, all optional — whichever pairs are present get created:
 *
 *   SEED_STAFF_1_EMAIL / SEED_STAFF_1_PASSWORD
 *   SEED_STAFF_2_EMAIL / SEED_STAFF_2_PASSWORD
 *   SEED_STAFF_3_EMAIL / SEED_STAFF_3_PASSWORD
 *   SEED_ADMIN_EMAIL   / SEED_ADMIN_PASSWORD
 *
 * ⚠️ These are real passwords sitting in plaintext on disk. .env is gitignored,
 * but a file is a file: DELETE the password lines once the accounts exist. This
 * script reminds you at the end. `npm run db:staff` avoids the problem entirely
 * by prompting with the echo off — prefer it when you're creating one account.
 *
 * Re-running is safe: an existing email is promoted and its password reset,
 * never duplicated.
 */
const MIN_PASSWORD = 12;
const BCRYPT_ROUNDS = 12;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. See BACKEND.md.");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

type Slot = { emailVar: string; passVar: string; role: "STAFF" | "ADMIN" };

const SLOTS: Slot[] = [
  { emailVar: "SEED_STAFF_1_EMAIL", passVar: "SEED_STAFF_1_PASSWORD", role: "STAFF" },
  { emailVar: "SEED_STAFF_2_EMAIL", passVar: "SEED_STAFF_2_PASSWORD", role: "STAFF" },
  { emailVar: "SEED_STAFF_3_EMAIL", passVar: "SEED_STAFF_3_PASSWORD", role: "STAFF" },
  { emailVar: "SEED_ADMIN_EMAIL", passVar: "SEED_ADMIN_PASSWORD", role: "ADMIN" },
  // Back-compat with the single pair the seed script already supported.
  { emailVar: "SEED_STAFF_EMAIL", passVar: "SEED_STAFF_PASSWORD", role: "STAFF" },
];

async function main() {
  const problems: string[] = [];
  const created: string[] = [];
  let anyConfigured = false;

  for (const slot of SLOTS) {
    const email = process.env[slot.emailVar]?.trim().toLowerCase();
    const password = process.env[slot.passVar];

    // Skip silently when neither half is set — most slots are unused.
    if (!email && !password) continue;
    anyConfigured = true;

    if (!email) {
      problems.push(`${slot.passVar} is set but ${slot.emailVar} is missing.`);
      continue;
    }
    if (!password) {
      problems.push(`${slot.emailVar} is set but ${slot.passVar} is missing.`);
      continue;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      problems.push(`${slot.emailVar} isn't a valid email address.`);
      continue;
    }
    if (password.length < MIN_PASSWORD) {
      // Names the variable, never the value.
      problems.push(
        `${slot.passVar} is ${password.length} characters — needs at least ${MIN_PASSWORD}.`
      );
      continue;
    }

    const existing = await prisma.account.findUnique({ where: { email } });
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await prisma.account.upsert({
      where: { email },
      update: { role: slot.role, passwordHash },
      create: {
        email,
        name: slot.role === "ADMIN" ? "Administrator" : "Restaurant Staff",
        role: slot.role,
        passwordHash,
      },
    });

    created.push(
      `  ${slot.role.padEnd(5)} ${email}${existing ? "  (existing account updated)" : ""}`
    );
  }

  if (!anyConfigured) {
    console.log("Nothing to do — none of these are set in .env:\n");
    for (const s of SLOTS) console.log(`  ${s.emailVar} / ${s.passVar}`);
    console.log("\nOr create one interactively with: npm run db:staff");
    return;
  }

  if (created.length > 0) {
    console.log("Accounts ready:\n" + created.join("\n"));
  }

  if (problems.length > 0) {
    console.log("\nSkipped:");
    for (const p of problems) console.log("  - " + p);
  }

  if (created.length > 0) {
    console.log(
      "\n⚠️  Now delete the SEED_*_PASSWORD lines from .env — the accounts " +
        "exist in the database and the file no longer needs them."
    );
  }

  const staff = await prisma.account.count({
    where: { role: { in: ["STAFF", "ADMIN"] } },
  });
  console.log(`\n${staff} account(s) can now reach /admin.`);
}

main()
  .catch((error) => {
    console.error("\nFailed: " + String(error?.message ?? error).split("\n")[0]);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
