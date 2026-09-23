"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, isSignedIn } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "w-full rounded-lg border border-border-strong bg-field px-4 py-2 text-sm text-ink placeholder:text-faint focus:border-gold focus:outline-none";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);
    const result = await signUp({ name, email, phone, password });
    setSubmitting(false);

    if (result.ok) router.push("/account");
    else setError(result.error);
  }

  if (isSignedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-ink">
          You already have an account here
        </h1>
        <Link
          href="/account"
          className="mt-6 inline-block rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft"
        >
          Go to My Account
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">
        Create your account
      </h1>
      <p className="mb-8 mt-1 text-muted">
        Sign up to order faster and manage your reservations.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6"
      >
        <div>
          <label htmlFor="signup-name" className="mb-1 block text-sm font-medium text-ink">
            Full name
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="signup-phone" className="mb-1 block text-sm font-medium text-ink">
            Phone number{" "}
            <span className="font-normal text-faint">(optional)</span>
          </label>
          <input
            id="signup-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="03XX-XXXXXXX"
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
            aria-describedby="signup-password-hint"
          />
          <p id="signup-password-hint" className="mt-1 text-xs text-faint">
            At least {MIN_PASSWORD_LENGTH} characters.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-ember/40 bg-ember/10 px-3 py-2 text-sm text-ember-soft"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-gold-soft hover:underline">
          Log in
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-faint">
        Your details stay in this browser — nothing is sent to a server, and
        your password is only ever stored as a one-way hash.
      </p>
    </div>
  );
}
