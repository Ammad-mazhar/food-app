import { prisma } from "@/lib/prisma";

/**
 * Readiness probe, for diagnosing a deploy that can't reach its database.
 *
 * Public on purpose: when the database is down you cannot log in to check a
 * staff-only page, so gating this behind auth would make it useless exactly
 * when it is needed.
 *
 * It therefore reports only whether each variable is PRESENT — never a value,
 * never a host, never a length. "DATABASE_URL: false" tells an attacker
 * nothing they couldn't infer from the site being broken.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const env = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    DIRECT_DATABASE_URL: Boolean(process.env.DIRECT_DATABASE_URL),
    SESSION_SECRET: Boolean(process.env.SESSION_SECRET),
    NEXT_PUBLIC_SITE_URL: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  };

  const missing = Object.entries(env)
    .filter(([, present]) => !present)
    .map(([name]) => name);

  let database: {
    reachable: boolean;
    menuItems?: number;
    error?: string;
    hint?: string;
  };

  if (!env.DATABASE_URL) {
    database = {
      reachable: false,
      error: "DATABASE_URL is not set in this environment.",
      hint: "Local .env files are not deployed. Set it in your host's environment variables.",
    };
  } else {
    try {
      const menuItems = await prisma.menuItem.count();
      database = { reachable: true, menuItems };
    } catch (error) {
      // Scrub anything that could carry credentials out of the driver message.
      const raw = error instanceof Error ? error.message : String(error);
      const scrubbed = raw
        .replace(/postgres(ql)?:\/\/\S+/gi, "<connection string>")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(-2)
        .join(" ");

      database = {
        reachable: false,
        error: scrubbed.slice(0, 300),
        hint: /ENOTFOUND|ENETUNREACH|EHOSTUNREACH|timeout/i.test(scrubbed)
          ? "Use Supabase's Transaction pooler (port 6543, ?pgbouncer=true) — the direct db.<ref>.supabase.co host is IPv6-only and unreachable from most serverless platforms."
          : undefined,
      };
    }
  }

  const ok = missing.length === 0 && database.reachable;

  return Response.json(
    {
      ok,
      env,
      missing,
      database,
      // Useful for confirming a deploy actually picked up your latest push.
      commit: process.env.COMMIT_REF?.slice(0, 7) ?? null,
      checkedAt: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 }
  );
}
