"use client";

import {
  createContext,
  useCallback,
  useContext,
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
 * The signed-in account is resolved on the server and passed in as
 * `initialAccount`, so there's no loading flicker and no fetch-on-mount. After
 * any change we call router.refresh(), which re-runs the server components and
 * feeds a fresh value back down — one source of truth rather than a client
 * cache that can drift from the cookie.
 */
export function AuthProvider({
  children,
  initialAccount,
}: {
  children: ReactNode;
  initialAccount: PublicAccount | null;
}) {
  const router = useRouter();
  const [account, setAccount] = useState<PublicAccount | null>(initialAccount);

  // Keep in step when the server sends a new value after a refresh.
  const [seeded, setSeeded] = useState(initialAccount);
  if (seeded !== initialAccount) {
    setSeeded(initialAccount);
    setAccount(initialAccount);
  }

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
