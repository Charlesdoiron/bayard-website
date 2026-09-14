import { createPublicClient } from "@/lib/supabase/server";
import type { ListingRow, ProductRow, ProductVariantRow, PublicProfileRow } from "@/lib/supabase/database.types";
import { isListing, isProduct, matchesFilters, sortItems } from "./filters";
import { listingFromRow, productFromRow } from "./mappers";
import type { CatalogueResult } from "./mock-repository";
import type { CatalogueFilters, CatalogueItem, Listing, Product, TeamSlug } from "./types";

/**
 * Supabase implementation of the boutique repository. Same surface as the
 * mock one; listings are filtered in SQL, goodies (a small table) in memory
 * with the shared matcher so both spaces behave identically.
 */

const SOLD_VISIBLE_DAYS = 7;
const MAX_RESULTS = 200;

// Public catalogue reads only need the anonymous role (RLS exposes published
// rows), so no request cookies are involved and static rendering stays possible.
async function db() {
  const client = createPublicClient();
  if (!client) throw new Error("Supabase n'est pas configuré");
  return client;
}

const soldSince = () => new Date(Date.now() - SOLD_VISIBLE_DAYS * 86_400_000).toISOString();

/** Rows visible in the public catalogue: published, reserved, or sold within 7 days. */
function visibleListings<T extends { or: (f: string) => T }>(query: T): T {
  return query.or(`status.in.(publiee,reservee),and(status.eq.vendue,sold_at.gte.${soldSince()})`);
}

async function profilesFor(sellerIds: string[]): Promise<Map<string, PublicProfileRow>> {
  if (sellerIds.length === 0) return new Map();
  const supabase = await db();
  const { data } = await supabase
    .from("public_profiles")
    .select("*")
    .in("id", [...new Set(sellerIds)]);
  return new Map((data ?? []).map((p) => [p.id, p]));
}

async function hydrateListings(rows: ListingRow[]): Promise<Listing[]> {
  const profiles = await profilesFor(rows.map((r) => r.seller_id));
  return rows.map((r) => listingFromRow(r, profiles.get(r.seller_id)));
}

async function fetchProducts(onlyPublished = true): Promise<Product[]> {
  const supabase = await db();
  let query = supabase.from("products").select("*").order("sort_order").order("created_at", { ascending: false });
  if (onlyPublished) query = query.eq("published", true);
  const { data: products } = await query;
  if (!products?.length) return [];
  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .in("product_id", products.map((p) => p.id));
  const byProduct = new Map<string, ProductVariantRow[]>();
  for (const v of variants ?? []) {
    const list = byProduct.get(v.product_id) ?? [];
    list.push(v);
    byProduct.set(v.product_id, list);
  }
  return products.map((p: ProductRow) => productFromRow(p, byProduct.get(p.id) ?? []));
}

async function queryListings(f: CatalogueFilters): Promise<Listing[]> {
  const supabase = await db();
  let q = visibleListings(supabase.from("listings").select("*"));
  if (f.q) {
    const term = f.q.replace(/[%,()]/g, " ").trim();
    if (term) q = q.or(`title.ilike.%${term}%,brand.ilike.%${term}%,description.ilike.%${term}%`);
  }
  if (f.category) q = q.eq("category_slug", f.category);
  if (f.subCategory) q = q.eq("sub_category_slug", f.subCategory);
  if (f.team) q = q.eq("team", f.team);
  if (f.audience?.length) q = q.in("audience", f.audience);
  if (f.size?.length) q = q.in("size", f.size);
  if (f.color?.length) q = q.in("color", f.color);
  if (f.brand?.length) q = q.in("brand", f.brand);
  if (f.condition?.length) q = q.in("condition", f.condition);
  if (f.discipline?.length) q = q.in("discipline", f.discipline);
  if (f.priceMin !== undefined) q = q.gte("price_cents", Math.round(f.priceMin * 100));
  if (f.priceMax !== undefined) q = q.lte("price_cents", Math.round(f.priceMax * 100));
  if (f.available) q = q.eq("status", "publiee");
  if (f.donsOnly) q = q.eq("price_cents", 0);
  q = q.order("published_at", { ascending: false }).limit(MAX_RESULTS);
  const { data, error } = await q;
  if (error) throw error;
  return hydrateListings(data ?? []);
}

export async function searchCatalogue(filters: CatalogueFilters): Promise<CatalogueResult> {
  const unscoped = { ...filters, space: undefined };
  const [listings, products] = await Promise.all([
    filters.space === "goodies" ? Promise.resolve([] as Listing[]) : queryListings(unscoped),
    filters.space === "occasion" ? Promise.resolve([] as Product[]) : fetchProducts(),
  ]);
  const matchedProducts = products.filter((p) => matchesFilters(p, unscoped));
  const all: CatalogueItem[] = [...listings, ...matchedProducts];
  const scoped = filters.space
    ? all.filter((i) => (filters.space === "occasion" ? isListing(i) : isProduct(i)))
    : all;
  const sorted = sortItems(scoped, filters.sort);
  return {
    items: sorted,
    total: sorted.length,
    counts: {
      all: all.length,
      occasion: listings.length,
      goodies: matchedProducts.length,
    },
  };
}

export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  const supabase = await db();
  const { data } = await visibleListings(supabase.from("listings").select("*")).eq("slug", slug).maybeSingle();
  if (!data) return undefined;
  const [listing] = await hydrateListings([data]);
  return listing;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await fetchProducts();
  return products.find((p) => p.slug === slug);
}

export async function getSimilarListings(listing: Listing, limit = 6): Promise<Listing[]> {
  const supabase = await db();
  const { data } = await visibleListings(supabase.from("listings").select("*"))
    .neq("id", listing.id)
    .or(`sub_category_slug.eq.${listing.subCategorySlug},category_slug.eq.${listing.categorySlug}${listing.team ? `,team.eq.${listing.team}` : ""}`)
    .order("published_at", { ascending: false })
    .limit(limit * 3);
  const rows = data ?? [];
  const score = (l: ListingRow) =>
    (l.sub_category_slug === listing.subCategorySlug ? 4 : 0) +
    (l.category_slug === listing.categorySlug ? 2 : 0) +
    (l.audience === listing.audience ? 1 : 0) +
    (l.team && l.team === listing.team ? 2 : 0);
  rows.sort((a, b) => score(b) - score(a));
  return hydrateListings(rows.slice(0, limit));
}

export async function getTeamItems(team: TeamSlug): Promise<CatalogueItem[]> {
  const [listings, products] = await Promise.all([
    queryListings({ sort: "recent", team }),
    fetchProducts(),
  ]);
  return sortItems([...listings, ...products.filter((p) => p.team === team)], "recent");
}

export async function getOtherProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await fetchProducts();
  return products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => (a.category === product.category ? -1 : 0) - (b.category === product.category ? -1 : 0))
    .slice(0, limit);
}

export async function getFeatured(): Promise<{ listings: Listing[]; products: Product[] }> {
  const supabase = await db();
  const [{ data }, products] = await Promise.all([
    supabase.from("listings").select("*").eq("status", "publiee").order("published_at", { ascending: false }).limit(8),
    fetchProducts(),
  ]);
  return { listings: await hydrateListings(data ?? []), products: products.slice(0, 4) };
}

export async function getAllListingSlugs(): Promise<string[]> {
  const supabase = await db();
  const { data } = await visibleListings(supabase.from("listings").select("slug")).limit(1000);
  return (data ?? []).map((r) => r.slug);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await fetchProducts();
  return products.map((p) => p.slug);
}

export async function getActiveBrands(): Promise<string[]> {
  const supabase = await db();
  const { data } = await visibleListings(supabase.from("listings").select("brand")).not("brand", "is", null).limit(1000);
  const set = new Set<string>();
  for (const r of data ?? []) if (r.brand) set.add(r.brand);
  return [...set].sort((a, b) => a.localeCompare(b, "fr"));
}
