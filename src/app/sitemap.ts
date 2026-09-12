import { MetadataRoute } from "next";
import { SITE_CONFIG, PAGES } from "@/lib/constants";
import { TEAMS } from "@/lib/boutique/taxonomy";
import {
  getAllListingSlugs,
  getAllProductSlugs,
} from "@/lib/boutique/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  // Only include actual pages (not anchor links)
  const actualPages = Object.values(PAGES).filter(
    (page) => !page.path.includes("#")
  );

  // Use build time as lastModified for static pages
  const buildDate = new Date();

  const staticEntries: MetadataRoute.Sitemap = actualPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: buildDate,
    changeFrequency: page.path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: page.priority,
  }));

  const teamEntries: MetadataRoute.Sitemap = TEAMS.map((team) => ({
    url: `${baseUrl}/boutique/equipe/${team.slug}`,
    lastModified: buildDate,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const [listingSlugs, productSlugs] = await Promise.all([
    getAllListingSlugs(),
    getAllProductSlugs(),
  ]);

  const listingEntries: MetadataRoute.Sitemap = listingSlugs.map((slug) => ({
    url: `${baseUrl}/boutique/annonce/${slug}`,
    lastModified: buildDate,
    changeFrequency: "daily" as const,
    priority: 0.5,
  }));

  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/boutique/goodies/${slug}`,
    lastModified: buildDate,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...teamEntries, ...productEntries, ...listingEntries];
}
