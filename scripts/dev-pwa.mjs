/*
 * Runs the dev server in a state where the PWA can actually be installed.
 *
 *   npm run dev:pwa
 *
 * Two things have to be true before Chrome offers "Install", and plain
 * `next dev` provides neither:
 *
 *   1. A registered service worker with a fetch handler. src/components/
 *      ServiceWorker.tsx skips registration in development, so this sets
 *      NEXT_PUBLIC_DEV_PWA=1 to switch it back on.
 *
 *   2. A secure origin. http://localhost counts as secure, so desktop Chrome
 *      works either way — but a phone reaching this machine over the LAN does
 *      not, and gets no install option. --experimental-https makes Next mint a
 *      local certificate so https://<your-lan-ip>:3000 is trusted too.
 *
 * A Node wrapper rather than `NEXT_PUBLIC_DEV_PWA=1 next dev` in package.json
 * because that syntax does not work in PowerShell, which is where this project
 * is developed.
 *
 * Caveat worth knowing: with the worker registered, static assets are cached,
 * so an edit may not show until you reload twice or unregister the worker in
 * DevTools > Application. Use plain `npm run dev` for normal work.
 */
import { spawn } from "node:child_process";

const args = ["next", "dev", "--experimental-https", ...process.argv.slice(2)];

console.log("Starting dev server with the service worker enabled.\n");
console.log("  Desktop:  open https://localhost:3000 and use the install icon");
console.log("            in Chrome's address bar.\n");
console.log("  Phone:    easiest is Chrome DevTools > three dots > More tools >");
console.log("            Remote devices > Port forwarding, mapping 3000 to");
console.log("            localhost:3000. The phone then treats it as localhost,");
console.log("            which is a secure origin, and the install prompt works");
console.log("            with no certificate warnings.\n");
console.log("            Over the LAN instead, open https://<this-machine-ip>:3000");
console.log("            and accept the self-signed certificate first.\n");

const child = spawn("npx", args, {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_PUBLIC_DEV_PWA: "1" },
});

child.on("exit", (code) => process.exit(code ?? 0));
