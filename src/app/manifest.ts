import type { MetadataRoute } from "next";
import { restaurantInfo } from "@/lib/restaurant";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${restaurantInfo.name} — ${restaurantInfo.tagline}`,
    short_name: "Texas Steak House",
    description:
      "Order fire-grilled steaks for delivery or pickup, or book a table in Saddar, Rawalpindi.",
    start_url: "/",
    display: "standalone",
    // Matches the light theme's paper, so the splash screen doesn't flash a
    // colour the app never uses.
    background_color: "#efe6d4",
    theme_color: "#8c2f28",
    orientation: "portrait",
    categories: ["food", "shopping"],
    /*
     * The PNGs are not optional. Chrome on Android will not offer "Add to Home
     * Screen" unless the manifest lists a raster icon of at least 192px and one
     * of 512px; a manifest carrying only SVG is silently un-installable, which
     * is what this app shipped with. The SVG stays first because browsers that
     * can use it get the sharper artwork at every size.
     *
     * The maskable entry is a separate file, not the same image relabelled:
     * Android crops up to ~20% off each edge to fit its mask, and the crest
     * fills its whole canvas. Regenerate all of them with `npm run
     * icons:generate` after changing public/icon.svg.
     */
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Menu", url: "/menu" },
      { name: "Book a Table", url: "/book-table" },
      { name: "My Orders", url: "/orders" },
    ],
  };
}
