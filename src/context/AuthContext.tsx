"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

/** The profile the server is willing to hand back — never the password hash. */
export interface PublicAccount {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: "CUSTOMER" | "STAFF" | "ADMIN";
}

export type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  account: PublicAccount | null;
  isSignedIn: boolean;
  isStaff: boolean;
  /** True until /api/auth/me answers, so callers can avoid guessing wrong. */
  isLoading: boolean;
  signUp: (input: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<AuthResult>;
  logIn: (input: { email: string; password: string }) => Promise<AuthResult>;
  logOut: () => Promise<void>;
  updateProfile: (patch: {
    name?: string;
    phone?: string;
    address?: string;
  }) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Auth state, backed by a server session.
 *
 * The session used to be resolved in the root layout and handed down as
 * `initialAccount`, which gave a flicker-free first paint at the cost of making
 * every route in the app dynamic — see the long note in src/app/layout.tsx. It
 * is resolved here instead, from /api/auth/me on mount, so the pages that carry
 * no per-visitor data can be cached and served from the CDN.
 *
 * `isLoading` distinguishes "nobody is signed in" from "we don't know yet".
 * Nothing consumes it today — the navbar degrades to "Account" either way, and
 * /login should show its form immediately because most visitors there really
 * are logged out. It is here because any consumer that renders differently for
 * guests will otherwise flash the wrong state for one paint.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [account, setAccount] = useState<PublicAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = res.ok ? await res.json().catch(() => ({})) : {};
        if (!cancelled) setAccount(data.account ?? null);
      } catch {
        // Offline or the request was aborted. Staying logged-out is the safe
        // reading: every protected action is checked on the server anyway.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const post = useCallback(
    async (url: string, body: unknown): Promise<AuthResult> => {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          return { ok: false, error: data.error || "Something went wrong." };
        }

        setAccount(data.account ?? null);
        router.refresh();
        return { ok: true };
      } catch {
        return { ok: false, error: "Network problem. Please try again." };
      }
    },
    [router]
  );

  const signUp = useCallback<AuthContextValue["signUp"]>(
    (input) => post("/api/auth/signup", input),
    [post]
  );

  const logIn = useCallback<AuthContextValue["logIn"]>(
    (input) => post("/api/auth/login", input),
    [post]
  );

  const logOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setAccount(null);
    router.refresh();
  }, [router]);

  const updateProfile = useCallback<AuthContextValue["updateProfile"]>(
    async (patch) => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { ok: false, error: data.error || "Couldn't save that." };
        }
        setAccount(data.account ?? null);
        router.refresh();
        return { ok: true };
      } catch {
        return { ok: false, error: "Network problem. Please try again." };
      }
    },
    [router]
  );

  const value: AuthContextValue = {
    account,
    isSignedIn: account !== null,
    isStaff: account?.role === "STAFF" || account?.role === "ADMIN",
    isLoading,
    signUp,
    logIn,
    logOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
