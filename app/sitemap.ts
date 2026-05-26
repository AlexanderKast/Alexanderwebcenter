import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { leadMagnets } from "@/content/lead-magnets";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = site.url.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/legal/privacidad`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/legal/terminos`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const leadMagnetRoutes: MetadataRoute.Sitemap = leadMagnets.map((lm) => ({
    url: `${base}/descargas/${lm.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...leadMagnetRoutes];
}
