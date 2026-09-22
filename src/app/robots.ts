import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/restaurant";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Per-visitor and transactional pages — nothing useful for a crawler,
      // and no reason to have them turn up in search results.
      disallow: [
        "/cart",
        "/checkout",
        "/account",
        "/login",
        "/signup",
        "/orders",
        "/reservations",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
