/**
 * Domain types for the Club Bayard boutique.
 *
 * Two spaces share one catalogue:
 * - "occasion": second-hand items sold between members (Listing)
 * - "goodies": official club merchandise reserved online, paid at the club (Product)
 *
 * These types are backend-agnostic. The repository layer (repository.ts) is the
 * only place that knows where data comes from (mock data today, Supabase later).
 */

export type Space = "occasion" | "goodies";

export type Universe = "cavalier" | "cheval" | "ecurie";

export type TeamSlug = "dressage" | "hunter" | "cce" | "pony-games" | "equifun";

export type Audience =
  | "cavalier-adulte"
  | "cavalier-enfant"
  | "cheval"
  | "poney"
  | "shetland";

export type Discipline =
  | "cso"
  | "dressage"
  | "cce"
  | "hunter"
  | "pony-games"
  | "equifun"
  | "loisir";

export type Condition =
  | "neuf-etiquette"
  | "tres-bon-etat"
  | "bon-etat"
  | "satisfaisant";

export type ListingStatus =
  | "brouillon"
  | "en-attente"
  | "publiee"
  | "reservee"
  | "vendue"
  | "expiree"
  | "refusee"
  | "retiree";

export type SizeKind =
  | "tour-de-tete"
  | "vetement"
  | "pantalon"
  | "pointure"
  | "gant"
  | "selle"
  | "briderie"
  | "couverture"
  | "protection"
  | "sangle"
  | "mors"
  | "tapis"
  | "aucune";

export interface SubCategory {
  slug: string;
  label: string;
  sizeKind: SizeKind;
}

export interface Category {
  slug: string;
  label: string;
  universe: Universe;
  children: SubCategory[];
}

export interface Team {
  slug: TeamSlug;
  label: string;
  shortLabel: string;
  description: string;
  image: string;
}

export interface Seller {
  id: string;
  /** Public display name: first name + optional last-name initial. */
  displayName: string;
  memberSince: string; // ISO date
  teams: TeamSlug[];
}

export interface Listing {
  kind: "listing";
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  subCategorySlug: string;
  audience: Audience;
  size?: string;
  brand?: string;
  color?: string;
  condition: Condition;
  /** Price in euros. 0 means "don" (free). */
  price: number;
  description: string;
  images: string[];
  discipline?: Discipline;
  team?: TeamSlug;
  status: ListingStatus;
  publishedAt: string; // ISO date
  seller: Seller;
}

export type GoodiesCategory =
  | "textile"
  | "accessoires-cavalier"
  | "accessoires-cheval"
  | "tenue-equipe"
  | "divers";

export interface Variant {
  id: string;
  label: string; // "S", "M", "Full", "Bleu marine / M"…
  stock: number;
  /** Made to order: no stock, indicative lead time. */
  onOrder?: boolean;
  leadTime?: string;
}

export interface Product {
  kind: "product";
  id: string;
  slug: string;
  name: string;
  category: GoodiesCategory;
  description: string;
  images: string[];
  price: number;
  variants: Variant[];
  team?: TeamSlug;
  teamOnly?: boolean;
  published: boolean;
  createdAt: string; // ISO date
  /** Optional size chart / fit note shown on the product page. */
  sizeNote?: string;
}

export type CatalogueItem = Listing | Product;

export type SortKey = "recent" | "prix-asc" | "prix-desc";

export interface CatalogueFilters {
  space?: Space;
  q?: string;
  category?: string;
  subCategory?: string;
  team?: TeamSlug;
  audience?: Audience[];
  size?: string[];
  color?: string[];
  brand?: string[];
  condition?: Condition[];
  discipline?: Discipline[];
  priceMin?: number;
  priceMax?: number;
  available?: boolean;
  donsOnly?: boolean;
  sort: SortKey;
}
