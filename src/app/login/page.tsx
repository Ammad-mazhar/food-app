import Link from "next/link";

export default function LoginPage() {
  const inputClass =
    "w-full rounded-lg border border-border-strong bg-bg-elevated px-4 py-2 text-sm text-cream placeholder:text-faint focus:border-gold focus:outline-none";

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-cream">
        Welcome back
      </h1>
      <p className="mb-8 mt-1 text-muted">
        Log in to track your orders and reservations.
      </p>

      <form className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-cream">
            Email
          </label>
          <input type="email" className={inputClass} placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-cream">
            Password
          </label>
          <input type="password" className={inputClass} placeholder="••••••••" />
        </div>
        <button
          type="submit"
          className="mt-2 rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft"
        >
          Log In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-gold-soft hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
