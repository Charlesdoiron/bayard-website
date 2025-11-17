import { MetadataRoute } from "next";
import { SITE_CONFIG, PAGES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  
  // Only include actual pages (not anchor links)
  const actualPages = Object.values(PAGES).filter(
    (page) => !page.path.includes("#")
  );

  // Use build time as lastModified for static pages
  const buildDate = new Date();

  return actualPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: buildDate,
    changeFrequency: page.path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: page.priority,
  }));
}
