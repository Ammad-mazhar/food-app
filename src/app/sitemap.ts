import type { MetadataRoute } from "next";
import { menuItems } from "@/lib/data";
import { siteUrl } from "@/lib/restaurant";

/**
 * Only public, indexable pages belong here. Cart, checkout, account, login,
 * signup and the per-visitor order/reservation views are excluded — they hold
 * nothing a crawler can reach, and robots.ts disallows them too.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/menu`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/book-table`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const dishRoutes: MetadataRoute.Sitemap = menuItems.map((item) => ({
    url: `${siteUrl}/menu/${item.id}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...dishRoutes];
}
