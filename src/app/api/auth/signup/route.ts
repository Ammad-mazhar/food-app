import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { badRequest, conflict, handle, ok, signupSchema } from "@/lib/api";

const BCRYPT_ROUNDS = 12;

export async function POST(request: Request) {
  return handle(async () => {
    const body = await request.json().catch(() => null);
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Check the form and try again.", parsed.error.issues);
    }

    const { name, email, phone, password } = parsed.data;

    const existing = await prisma.account.findUnique({ where: { email } });
    if (existing) {
      return conflict("An account with that email already exists.");
    }

    const account = await prisma.account.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
      },
    });

    await createSession(account.id);

    // Never return passwordHash, even to its owner.
    return ok(
      {
        account: {
          id: account.id,
          name: account.name,
          email: account.email,
          phone: account.phone,
          address: account.address,
          role: account.role,
        },
      },
      { status: 201 }
    );
  });
}
