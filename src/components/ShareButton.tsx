"use client";

import { useState } from "react";
import { ShareIcon, CheckIcon } from "@/components/icons";

/**
 * Shares the current dish. Uses the native share sheet where the browser has
 * one (most phones), and otherwise copies the link to the clipboard — the two
 * cases get different labels so the button never promises the wrong thing.
 */
export default function ShareButton({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Dismissing the share sheet rejects; fall through to copying.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission).
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${title}`}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-ink transition hover:scale-110 hover:border-gold hover:text-gold active:scale-95"
      title={copied ? "Link copied" : `Share ${title}`}
    >
      {copied ? (
        <CheckIcon className="h-5 w-5 text-gold" />
      ) : (
        <ShareIcon className="h-5 w-5" />
      )}
    </button>
  );
}
