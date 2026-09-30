import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy.
 *
 * WHAT THIS DOES AND DOES NOT BUY YOU — read before tightening it.
 *
 * `script-src` allows 'unsafe-inline', which is the one weak directive here.
 * It is not laziness: Next's App Router emits the RSC payload as inline
 * <script> tags on every page, and this app adds two of its own in <head> (the
 * theme and install-prompt bootstraps). Blocking inline script means issuing a
 * per-request nonce, and Next can only do that from middleware — which opts
 * EVERY page into dynamic rendering. That would undo the work that took the
 * homepage and menu from seconds to milliseconds, in exchange for a mitigation
 * that only matters once an XSS hole exists.
 *
 * So inline script is permitted, but loading script from anywhere other than
 * this origin is not. The rest of the policy is strict, and several of these
 * directives stop real attacks on their own:
 *
 *   object-src 'none'      no Flash/Java/plugin embeds
 *   base-uri 'self'        stops a injected <base> hijacking every relative URL
 *   form-action 'self'     stops an injected form posting your customers'
 *                          details to someone else's server
 *   frame-ancestors 'self' clickjacking, and stronger than X-Frame-Options
 *
 * If you later want the strict version, the trade is explicit: add middleware
 * that mints a nonce per request, swap 'unsafe-inline' for 'nonce-…', and
 * accept that /menu, /about and the dish pages stop being cached.
 *
 * Development needs more: Turbopack's hot reload uses eval and a websocket.
 * Those allowances exist only when NODE_ENV is development, so production is
 * never loosened by them.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Tailwind and Next both set inline styles; there is no nonce-free way round it.
  "style-src 'self' 'unsafe-inline'",
  // data: for the blur placeholders next/image generates.
  "img-src 'self' data: blob:",
  // next/font/google self-hosts Rokkitt at build time, so no external origin.
  "font-src 'self' data:",
  "media-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "manifest-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "frame-src 'none'",
  // Anything that slipped through as http:// gets fetched over https instead.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Content-Security-Policy", value: csp }],
      },
    ];
  },
};

export default nextConfig;
