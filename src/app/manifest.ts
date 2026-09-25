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
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      { name: "Menu", url: "/menu" },
      { name: "Book a Table", url: "/book-table" },
      { name: "My Orders", url: "/orders" },
    ],
  };
}
