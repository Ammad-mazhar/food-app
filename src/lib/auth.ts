/**
 * Password hashing for the local demo accounts.
 *
 * ⚠️ This is NOT real authentication. Accounts live in localStorage on the
 * visitor's own device; there is no server, no session token, and no way to
 * stop someone editing their own storage. What this does buy us is that a
 * plaintext password is never written to disk — only a SHA-256 digest is.
 * Replace the whole thing with a real backend before handling live accounts.
 *
 * `crypto.subtle` requires a secure context, which covers https and localhost.
 */
export async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Minimum we enforce at signup, surfaced in the form's helper text. */
export const MIN_PASSWORD_LENGTH = 8;
