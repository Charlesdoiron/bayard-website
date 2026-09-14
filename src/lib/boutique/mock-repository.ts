import { LISTINGS, PRODUCTS } from "./mock-data";
import {
  isListing,
  isProduct,
  isPubliclyVisible,
  matchesFilters,
  sortItems,
} from "./filters";
import type {
  CatalogueFilters,
  CatalogueItem,
  Listing,
  Product,
  TeamSlug,
} from "./types";

/**
 * In-memory implementation of the boutique repository (demo mode).
 *
 * Every function is async and returns plain objects so the implementation can
 * be swapped for Supabase queries without touching pages or components. Today
 * it reads the in-memory demo data.
 */

async function allVisibleItems(): Promise<CatalogueItem[]> {
  const listings = LISTINGS.filter((l) => isPubliclyVisible(l));
  const products = PRODUCTS.filter((p) => p.published);
  return [...listings, ...products];
}

export interface CatalogueResult {
  items: CatalogueItem[];
  total: number;
  /** Counts before the space filter, for the tab badges. */
  counts: { all: number; occasion: number; goodies: number };
}

export async function searchCatalogue(filters: CatalogueFilters): Promise<CatalogueResult> {
  const items = await allVisibleItems();
  const withoutSpace = items.filter((i) => matchesFilters(i, { ...filters, space: undefined }));
  const matched = filters.space
    ? withoutSpace.filter((i) => (filters.space === "occasion" ? isListing(i) : isProduct(i)))
    : withoutSpace;
  const sorted = sortItems(matched, filters.sort);
  return {
    items: sorted,
    total: sorted.length,
    counts: {
      all: withoutSpace.length,
      occasion: withoutSpace.filter(isListing).length,
      goodies: withoutSpace.filter(isProduct).length,
    },
  };
}

export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  return LISTINGS.find((l) => l.slug === slug && isPubliclyVisible(l));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return PRODUCTS.find((p) => p.slug === slug && p.published);
}

export async function getSimilarListings(listing: Listing, limit = 6): Promise<Listing[]> {
  const pool = LISTINGS.filter((l) => l.id !== listing.id && isPubliclyVisible(l));
  const score = (l: Listing) =>
    (l.subCategorySlug === listing.subCategorySlug ? 4 : 0) +
    (l.categorySlug === listing.categorySlug ? 2 : 0) +
    (l.audience === listing.audience ? 1 : 0) +
    (l.team && l.team === listing.team ? 2 : 0);
  return pool
    .map((l) => ({ l, s: score(l) }))
    .sort((a, b) => b.s - a.s || new Date(b.l.publishedAt).getTime() - new Date(a.l.publishedAt).getTime())
    .slice(0, limit)
    .map((x) => x.l);
}

export async function getTeamItems(team: TeamSlug): Promise<CatalogueItem[]> {
  const items = await allVisibleItems();
  return sortItems(items.filter((i) => i.team === team), "recent");
}

export async function getOtherProducts(product: Product, limit = 4): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.published && p.id !== product.id)
    .sort((a, b) => (a.category === product.category ? -1 : 0) - (b.category === product.category ? -1 : 0))
    .slice(0, limit);
}

export async function getFeatured(): Promise<{ listings: Listing[]; products: Product[] }> {
  const listings = sortItems(LISTINGS.filter((l) => l.status === "publiee"), "recent").slice(0, 8) as Listing[];
  const products = PRODUCTS.filter((p) => p.published).slice(0, 4);
  return { listings, products };
}

export async function getAllListingSlugs(): Promise<string[]> {
  return LISTINGS.filter((l) => isPubliclyVisible(l)).map((l) => l.slug);
}

export async function getAllProductSlugs(): Promise<string[]> {
  return PRODUCTS.filter((p) => p.published).map((p) => p.slug);
}

/** Distinct brands present in visible listings, for the brand filter. */
export async function getActiveBrands(): Promise<string[]> {
  const set = new Set<string>();
  for (const l of LISTINGS) if (isPubliclyVisible(l) && l.brand) set.add(l.brand);
  return [...set].sort((a, b) => a.localeCompare(b, "fr"));
}
