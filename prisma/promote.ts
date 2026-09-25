import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Changes an existing account's role. Nothing else is touched — the password
 * stays exactly as it was.
 *
 *   npm run db:promote -- --email owner@example.com --role admin
 *   npm run db:promote -- --email someone@example.com --role customer
 *
 * `db:staff` also sets roles, but it resets the password at the same time,
 * which is the wrong tool when the only thing wrong is the role.
 */
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. See BACKEND.md.");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const email = argValue("--email")?.trim().toLowerCase();
  const roleArg = argValue("--role")?.trim().toLowerCase();

  if (!email || !roleArg) {
    console.error(
      "Usage: npm run db:promote -- --email <address> --role <customer|staff|admin>"
    );
    process.exit(1);
  }

  const roles = { customer: "CUSTOMER", staff: "STAFF", admin: "ADMIN" } as const;
  const role = roles[roleArg as keyof typeof roles];
  if (!role) {
    console.error("--role must be customer, staff or admin.");
    process.exit(1);
  }

  const existing = await prisma.account.findUnique({ where: { email } });
  if (!existing) {
    console.error(`No account found for ${email}.`);
    console.error("Create one with: npm run db:staff -- --email " + email);
    process.exit(1);
  }

  if (existing.role === role) {
    console.log(`${email} is already ${role}. Nothing changed.`);
    return;
  }

  // Refuse to remove the last admin — locking yourself out of /admin with a
  // typo is easy, and recovering needs database access.
  if (existing.role === "ADMIN" && role !== "ADMIN") {
    const admins = await prisma.account.count({ where: { role: "ADMIN" } });
    if (admins <= 1) {
      console.error(
        `${email} is the only ADMIN. Promote someone else first, or you'll lock yourself out.`
      );
      process.exit(1);
    }
  }

  await prisma.account.update({ where: { email }, data: { role } });
  console.log(`${email}: ${existing.role} -> ${role}`);
  console.log("Password unchanged.");
}

main()
  .catch((error) => {
    console.error("Failed: " + String(error?.message ?? error).split("\n")[0]);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
