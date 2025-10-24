import { MetadataRoute } from "next";
import { SITE_CONFIG, PAGES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  return Object.values(PAGES).map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: page.priority,
  }));
}
