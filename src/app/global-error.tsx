"use client";

/**
 * Last-resort boundary: this replaces the root layout entirely, so it has to
 * render its own <html> and <body> and cannot rely on the app's providers.
 * Styles are inline rather than Tailwind classes, because whatever broke the
 * root layout may also have taken the stylesheet with it.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0908",
          color: "#f3ead9",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.875rem",
              fontWeight: 700,
              margin: 0,
            }}
          >
            The site hit a problem
          </h1>
          <p style={{ marginTop: "0.75rem", color: "rgba(243,234,217,0.64)" }}>
            Something failed before the page could load. Reloading usually
            fixes it.
          </p>

          {error.digest && (
            <p
              style={{
                marginTop: "1rem",
                fontFamily: "ui-monospace, Menlo, Consolas, monospace",
                fontSize: "0.75rem",
                color: "rgba(243,234,217,0.4)",
              }}
            >
              Reference: {error.digest}
            </p>
          )}

          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              cursor: "pointer",
              borderRadius: "0.5rem",
              border: "none",
              background: "#b3432b",
              color: "#f3ead9",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
