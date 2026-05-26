import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  const allowedBots = [
    "Googlebot",
    "Bingbot",
    "GPTBot",
    "ClaudeBot",
    "PerplexityBot",
    "Google-Extended",
    "CCBot",
    "Applebot-Extended",
  ];

  return {
    rules: [
      ...allowedBots.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/", "/admin/", "/gracias"],
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/gracias"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
