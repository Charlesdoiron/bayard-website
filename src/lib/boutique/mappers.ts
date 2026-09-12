import type { ListingRow, ProductRow, ProductVariantRow, PublicProfileRow } from "@/lib/supabase/database.types";
import type { Listing, Product, Seller } from "./types";

/** Converts database rows into the domain types used by pages and components. */

export const centsToEuros = (cents: number) => Math.round(cents) / 100;
export const eurosToCents = (euros: number) => Math.round(euros * 100);

export function sellerFromProfile(profile: PublicProfileRow | undefined, sellerId: string): Seller {
  return {
    id: sellerId,
    displayName: profile?.display_name || "Membre du club",
    memberSince: profile?.member_since ?? new Date(0).toISOString(),
    teams: profile?.teams ?? [],
  };
}

export function listingFromRow(row: ListingRow, profile?: PublicProfileRow): Listing {
  return {
    kind: "listing",
    id: row.id,
    slug: row.slug,
    title: row.title,
    categorySlug: row.category_slug,
    subCategorySlug: row.sub_category_slug,
    audience: row.audience,
    size: row.size ?? undefined,
    brand: row.brand ?? undefined,
    color: row.color ?? undefined,
    condition: row.condition,
    price: centsToEuros(row.price_cents),
    description: row.description,
    images: row.images.length ? row.images : ["/offer_2.jpg"],
    discipline: row.discipline ?? undefined,
    team: row.team ?? undefined,
    status: row.status,
    publishedAt: row.published_at ?? row.created_at,
    seller: sellerFromProfile(profile, row.seller_id),
  };
}

export function productFromRow(row: ProductRow, variants: ProductVariantRow[]): Product {
  return {
    kind: "product",
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    images: row.images.length ? row.images : ["/team.jpg"],
    price: centsToEuros(row.price_cents),
    variants: [...variants]
      .sort((a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label, "fr"))
      .map((v) => ({
        id: v.id,
        label: v.label,
        stock: v.stock,
        onOrder: v.on_order || undefined,
        leadTime: v.lead_time ?? undefined,
      })),
    team: row.team ?? undefined,
    teamOnly: row.team_only || undefined,
    published: row.published,
    createdAt: row.created_at,
    sizeNote: row.size_note ?? undefined,
  };
}

/** URL-safe slug from a title, suffixed with a short random id to stay unique. */
export function slugify(title: string, suffix?: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return suffix ? `${base}-${suffix}` : base;
}
