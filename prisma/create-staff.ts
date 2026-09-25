import "dotenv/config";
import readline from "node:readline";
import { Writable } from "node:stream";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Creates (or promotes) a staff or admin account for the /admin dashboard.
 *
 *   npm run db:staff
 *   npm run db:staff -- --email kitchen@example.com
 *   npm run db:staff -- --email owner@example.com --role admin
 *
 * Prompts for the password with the terminal echo suppressed, so it doesn't
 * end up in shell history the way `SEED_STAFF_PASSWORD=... npm run ...` does.
 * There is deliberately no flag for the password.
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

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

/** Same as ask(), but nothing the user types is echoed back. */
function askHidden(question: string): Promise<string> {
  let muted = false;
  const mutable = new Writable({
    write(chunk, _encoding, callback) {
      if (!muted) process.stdout.write(chunk);
      callback();
    },
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: mutable,
    terminal: true,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer.trim());
    });
    muted = true;
  });
}

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const roleArg = (argValue("--role") || "staff").toLowerCase();
  if (roleArg !== "staff" && roleArg !== "admin") {
    console.error("--role must be 'staff' or 'admin'.");
    process.exit(1);
  }
  const role = roleArg === "admin" ? "ADMIN" : "STAFF";

  const email = (
    argValue("--email") || (await ask(`${role} email: `))
  ).toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("That doesn't look like an email address.");
    process.exit(1);
  }

  const existing = await prisma.account.findUnique({ where: { email } });
  if (existing) {
    console.log(`\nAn account already exists for ${email}.`);
    const answer = await ask(
      `Promote it to ${role} and reset its password? (y/N) `
    );
    if (answer.toLowerCase() !== "y") {
      console.log("Nothing changed.");
      return;
    }
  }

  const password = await askHidden(`Password (min ${MIN_PASSWORD} chars, hidden): `);
  if (password.length < MIN_PASSWORD) {
    console.error(`Too short — needs at least ${MIN_PASSWORD} characters.`);
    process.exit(1);
  }

  const confirm = await askHidden("Confirm password: ");
  if (confirm !== password) {
    console.error("The two passwords don't match. Nothing changed.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  await prisma.account.upsert({
    where: { email },
    update: { role, passwordHash },
    create: {
      email,
      name:
        existing?.name ||
        (role === "ADMIN" ? "Administrator" : "Restaurant Staff"),
      role,
      passwordHash,
    },
  });

  // Deliberately does not print the password back.
  console.log(`\n${role} access granted to ${email}.`);
  console.log("Log in at /login, then open /admin.");
}

main()
  .catch((error) => {
    console.error("\nFailed: " + String(error?.message ?? error).split("\n")[0]);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
