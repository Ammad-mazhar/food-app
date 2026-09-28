"use client";

import { useState } from "react";
import { useInstall } from "@/context/InstallContext";

/**
 * A permanent "Get the app" control, as opposed to the bar that appears by
 * itself and can be dismissed forever.
 *
 * The honest part of this component is the fallback. Chrome only hands over an
 * install prompt when it feels like it — the site must qualify, and on a first
 * visit it often has not decided yet. iOS never offers one at all. A button
 * that silently does nothing in those cases is worse than no button, so when
 * there is no prompt to replay it explains how to install by hand instead.
 */
export default function InstallAppButton({
  className = "",
}: {
  className?: string;
}) {
  const { canPrompt, isInstalled, platform, isSecure, promptInstall } =
    useInstall();
  const [showHelp, setShowHelp] = useState(false);
  const [declined, setDeclined] = useState(false);

  // Nothing to offer someone who is already running the installed app.
  if (isInstalled) return null;

  async function handleClick() {
    if (!canPrompt) {
      setShowHelp((open) => !open);
      return;
    }
    const outcome = await promptInstall();
    if (outcome === "dismissed") setDeclined(true);
    if (outcome === "unavailable") setShowHelp(true);
  }

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        aria-expanded={!canPrompt ? showHelp : undefined}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-strong px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-ember hover:text-ember active:scale-95 sm:w-auto"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M12 3v12m0 0 4-4m-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
        </svg>
        Get the app
      </button>

      {declined && (
        <p className="mt-2 text-xs text-muted">
          No problem — the button stays here whenever you change your mind.
        </p>
      )}

      {showHelp && !canPrompt && (
        <div className="mt-3 rounded-lg border border-border bg-surface p-3 text-xs leading-relaxed text-muted">
          {!isSecure ? (
            /*
             * Checked before anything else, because it overrides every other
             * explanation: no browser installs a web app from an insecure
             * origin, so telling an Android user to "look for the install icon"
             * here would send them hunting for something that cannot appear.
             */
            <>
              <p className="mb-1 font-semibold text-ink">
                This address can&apos;t be installed
              </p>
              <p>
                The page is being served over plain HTTP, and browsers only
                install apps from a secure address — HTTPS, or{" "}
                <strong>localhost</strong> on the same machine. That is why it
                worked on the laptop and not here.
              </p>
              <p className="mt-2">
                Open the published HTTPS site on this phone, or forward the port
                from a computer so the phone sees it as localhost.
              </p>
            </>
          ) : platform === "ios" ? (
            <>
              <p className="mb-1 font-semibold text-ink">On iPhone or iPad</p>
              <p>
                Open this page in <strong>Safari</strong>, tap the Share button,
                then choose <strong>Add to Home Screen</strong>. Chrome on iOS
                cannot install apps — that is an Apple restriction, not a bug
                here.
              </p>
            </>
          ) : platform === "chromium" ? (
            <>
              <p className="mb-1 font-semibold text-ink">Installing</p>
              <p>
                Look for the install icon in the address bar, or open the browser
                menu and choose <strong>Install</strong> or{" "}
                <strong>Add to Home screen</strong>. If neither appears yet, your
                browser is still deciding — visit once more and it should show
                up.
              </p>
            </>
          ) : (
            <>
              <p className="mb-1 font-semibold text-ink">Not supported here</p>
              <p>
                This browser cannot install web apps. Open the site in Chrome or
                Edge on Android or desktop, or in Safari on iPhone, and the
                option will appear.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
