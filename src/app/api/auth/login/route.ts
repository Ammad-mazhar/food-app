import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { badRequest, handle, loginSchema, ok } from "@/lib/api";

/**
 * A hash of a throwaway password, compared against when no account matches.
 *
 * Without it, a missing email returns in microseconds while a real one takes
 * bcrypt's full work factor — a timing difference that tells an attacker which
 * addresses are registered.
 */
const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEe.7Xo1WQQ0yNBv1wqvQZVuW0V6CpLQhVu";

export async function POST(request: Request) {
  return handle(async () => {
    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Enter your email and password.");
    }

    const { email, password } = parsed.data;
    const account = await prisma.account.findUnique({ where: { email } });

    const matches = await bcrypt.compare(
      password,
      account?.passwordHash ?? DUMMY_HASH
    );

    // One message for both failures — saying which half was wrong reveals
    // whether an email is registered.
    if (!account || !matches) {
      return Response.json(
        { error: "Email or password is incorrect." },
        { status: 401 }
      );
    }

    await createSession(account.id);

    return ok({
      account: {
        id: account.id,
        name: account.name,
        email: account.email,
        phone: account.phone,
        address: account.address,
        role: account.role,
      },
    });
  });
}
