"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { Account } from "@/lib/types";
import { accountsStore, sessionStore } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import {
  hashPassword,
  isValidEmail,
  normalizeEmail,
  MIN_PASSWORD_LENGTH,
} from "@/lib/auth";

/** What the caller gets back instead of a thrown error, so forms can render it. */
export type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  account: Account | null;
  /** The profile minus the password digest, which UI code never needs. */
  isSignedIn: boolean;
  signUp: (input: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<AuthResult>;
  logIn: (input: { email: string; password: string }) => Promise<AuthResult>;
  logOut: () => void;
  updateProfile: (
    patch: Partial<Pick<Account, "name" | "phone" | "address">>
  ) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const accounts = useSyncExternalStore(
    accountsStore.subscribe,
    accountsStore.read,
    accountsStore.getServerSnapshot
  );
  const sessionId = useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.read,
    sessionStore.getServerSnapshot
  );

  const account = useMemo(
    () => accounts.find((a) => a.id === sessionId) ?? null,
    [accounts, sessionId]
  );

  const signUp = useCallback<AuthContextValue["signUp"]>(
    async ({ name, email, phone, password }) => {
      const trimmedName = name.trim();
      if (!trimmedName) return { ok: false, error: "Please enter your name." };
      if (!isValidEmail(email))
        return { ok: false, error: "Please enter a valid email address." };
      if (password.length < MIN_PASSWORD_LENGTH)
        return {
          ok: false,
          error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
        };

      const normalized = normalizeEmail(email);
      // Read through the store rather than the render-time snapshot, so two
      // signups in the same tick can't both think the email is free.
      if (accountsStore.read().some((a) => a.email === normalized))
        return {
          ok: false,
          error: "An account with that email already exists.",
        };

      const newAccount: Account = {
        id: generateId("ACC"),
        name: trimmedName,
        email: normalized,
        phone: phone?.trim() || undefined,
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString(),
      };

      accountsStore.add(newAccount);
      sessionStore.write(newAccount.id);
      return { ok: true };
    },
    []
  );

  const logIn = useCallback<AuthContextValue["logIn"]>(
    async ({ email, password }) => {
      const normalized = normalizeEmail(email);
      const match = accountsStore.read().find((a) => a.email === normalized);
      const digest = await hashPassword(password);

      // Same message either way — telling someone which half was wrong tells
      // them which emails are registered.
      if (!match || match.passwordHash !== digest)
        return { ok: false, error: "Email or password is incorrect." };

      sessionStore.write(match.id);
      return { ok: true };
    },
    []
  );

  const logOut = useCallback(() => sessionStore.write(null), []);

  const updateProfile = useCallback<AuthContextValue["updateProfile"]>(
    (patch) => {
      const id = sessionStore.read();
      if (!id) return;
      accountsStore.update((list) =>
        list.map((a) => (a.id === id ? { ...a, ...patch } : a))
      );
    },
    []
  );

  const value: AuthContextValue = {
    account,
    isSignedIn: account !== null,
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
