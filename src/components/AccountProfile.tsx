"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckIcon } from "@/components/icons";

/**
 * Profile view + edit, and the log-out button.
 *
 * Values come from the server render; saving goes through the API and then
 * refreshes the route, so what's on screen is always what's in the database
 * rather than an optimistic guess.
 */
export default function AccountProfile({
  name,
  email,
  phone,
  address,
}: {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
}) {
  const { logOut, updateProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftPhone, setDraftPhone] = useState(phone ?? "");
  const [draftAddress, setDraftAddress] = useState(address ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const inputClass =
    "w-full rounded-lg border border-border-strong bg-field px-4 py-2 text-sm text-ink placeholder:text-faint focus:border-gold focus:outline-none";

  function startEditing() {
    setDraftName(name);
    setDraftPhone(phone ?? "");
    setDraftAddress(address ?? "");
    setError("");
    setEditing(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const result = await updateProfile({
      name: draftName.trim() || name,
      phone: draftPhone.trim(),
      address: draftAddress.trim(),
    });

    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      {saved && (
        <p
          role="status"
          className="mt-6 flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm text-gold-soft"
        >
          <CheckIcon className="h-4 w-4" />
          Profile updated.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            Profile
          </h2>
          {!editing && (
            <button
              onClick={startEditing}
              className="text-sm font-semibold text-gold-soft hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="acct-name"
                className="mb-1 block text-sm font-medium text-ink"
              >
                Full name
              </label>
              <input
                id="acct-name"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="acct-phone"
                className="mb-1 block text-sm font-medium text-ink"
              >
                Phone number
              </label>
              <input
                id="acct-phone"
                type="tel"
                value={draftPhone}
                onChange={(e) => setDraftPhone(e.target.value)}
                className={inputClass}
                placeholder="03XX-XXXXXXX"
              />
            </div>
            <div>
              <label
                htmlFor="acct-address"
                className="mb-1 block text-sm font-medium text-ink"
              >
                Default delivery address
              </label>
              <textarea
                id="acct-address"
                rows={2}
                value={draftAddress}
                onChange={(e) => setDraftAddress(e.target.value)}
                className={inputClass}
                placeholder="House, street, area, city"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-ember">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-ember-soft disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={busy}
                className="rounded-lg border border-border-strong px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-hover"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Name</dt>
              <dd className="text-ink">{name}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="text-ink">{email}</dd>
            </div>
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="text-ink">
                {phone || <span className="text-faint">Not set</span>}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Default address</dt>
              <dd className="text-ink">
                {address || <span className="text-faint">Not set</span>}
              </dd>
            </div>
          </dl>
        )}

        <div className="mt-6 border-t border-border pt-4">
          <button
            onClick={() => logOut()}
            className="rounded-lg border border-border-strong px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-hover"
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
