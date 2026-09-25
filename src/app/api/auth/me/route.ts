import { prisma } from "@/lib/prisma";
import { getSessionAccount } from "@/lib/session";
import { badRequest, handle, ok, profileSchema, unauthorized } from "@/lib/api";

/** Who am I? Returns null rather than 401 so the client can render a guest UI. */
export async function GET() {
  return handle(async () => {
    const account = await getSessionAccount();
    if (!account) return ok({ account: null });

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

/** Update the signed-in account's own profile. */
export async function PATCH(request: Request) {
  return handle(async () => {
    const account = await getSessionAccount();
    if (!account) return unauthorized();

    const body = await request.json().catch(() => null);
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) return badRequest("Those details aren't valid.");

    const { name, phone, address } = parsed.data;
    const updated = await prisma.account.update({
      where: { id: account.id },
      // Email and role are deliberately not updatable here — changing an email
      // needs verification, and nobody promotes themselves to staff.
      data: {
        ...(name ? { name } : {}),
        phone: phone === "" ? null : phone ?? account.phone,
        address: address === "" ? null : address ?? account.address,
      },
    });

    return ok({
      account: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        role: updated.role,
      },
    });
  });
}
