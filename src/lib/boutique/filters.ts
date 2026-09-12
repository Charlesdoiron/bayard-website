import type {
  Audience,
  CatalogueFilters,
  CatalogueItem,
  Condition,
  Discipline,
  Listing,
  Product,
  SortKey,
  Space,
} from "./types";
import { AUDIENCES, CONDITIONS, DISCIPLINES, isTeamSlug } from "./taxonomy";

export type SearchParamsInput = Record<string, string | string[] | undefined>;

const SORT_KEYS: SortKey[] = ["recent", "prix-asc", "prix-desc"];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Plus récents" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
];

const first = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

const list = (v: string | string[] | undefined): string[] => {
  if (v === undefined) return [];
  const raw = Array.isArray(v) ? v : [v];
  return raw
    .flatMap((s) => s.split(","))
    .map((s) => s.trim())
    .filter(Boolean);
};

const num = (v: string | string[] | undefined): number | undefined => {
  const s = first(v);
  if (s === undefined || s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

const oneOf = <T extends string>(values: readonly T[], v: string | undefined): T | undefined =>
  v !== undefined && (values as readonly string[]).includes(v) ? (v as T) : undefined;

const manyOf = <T extends string>(values: readonly T[], vs: string[]): T[] =>
  vs.filter((v): v is T => (values as readonly string[]).includes(v));

const AUDIENCE_SLUGS = AUDIENCES.map((a) => a.slug);
const CONDITION_SLUGS = CONDITIONS.map((c) => c.slug);
const DISCIPLINE_SLUGS = DISCIPLINES.map((d) => d.slug);

/**
 * Parse URL search params into typed filters. Unknown values are dropped so
 * a hand-edited URL never breaks the page.
 */
export function parseFilters(
  params: SearchParamsInput,
  defaults: Partial<CatalogueFilters> = {},
): CatalogueFilters {
  const team = first(params.equipe);
  const filters: CatalogueFilters = {
    sort: oneOf(SORT_KEYS, first(params.tri)) ?? "recent",
    space: oneOf(["occasion", "goodies"] as const satisfies readonly Space[], first(params.espace)),
    q: first(params.q)?.trim() || undefined,
    category: first(params.categorie) || undefined,
    subCategory: first(params.sous_categorie) || undefined,
    team: team && isTeamSlug(team) ? team : undefined,
    audience: manyOf<Audience>(AUDIENCE_SLUGS, list(params.pour)),
    size: list(params.taille),
    color: list(params.couleur),
    brand: list(params.marque),
    condition: manyOf<Condition>(CONDITION_SLUGS, list(params.etat)),
    discipline: manyOf<Discipline>(DISCIPLINE_SLUGS, list(params.discipline)),
    priceMin: num(params.prix_min),
    priceMax: num(params.prix_max),
    available: first(params.disponibles) === "1",
    donsOnly: first(params.dons) === "1",
  };
  return { ...filters, ...defaults };
}

/** Serialize filters back to URL search params (only non-default values). */
export function serializeFilters(filters: Partial<CatalogueFilters>): URLSearchParams {
  const p = new URLSearchParams();
  const set = (key: string, value: string | undefined) => {
    if (value) p.set(key, value);
  };
  const setList = (key: string, values: string[] | undefined) => {
    if (values && values.length) p.set(key, values.join(","));
  };
  set("q", filters.q);
  set("espace", filters.space);
  set("categorie", filters.category);
  set("sous_categorie", filters.subCategory);
  set("equipe", filters.team);
  setList("pour", filters.audience);
  setList("taille", filters.size);
  setList("couleur", filters.color);
  setList("marque", filters.brand);
  setList("etat", filters.condition);
  setList("discipline", filters.discipline);
  if (filters.priceMin !== undefined) p.set("prix_min", String(filters.priceMin));
  if (filters.priceMax !== undefined) p.set("prix_max", String(filters.priceMax));
  if (filters.available) p.set("disponibles", "1");
  if (filters.donsOnly) p.set("dons", "1");
  if (filters.sort && filters.sort !== "recent") p.set("tri", filters.sort);
  return p;
}

/** Number of active filters, for the "Filtres (3)" badge. Sort and space are not counted. */
export function countActiveFilters(f: CatalogueFilters): number {
  let n = 0;
  if (f.category) n++;
  if (f.subCategory) n++;
  if (f.team) n++;
  n += f.audience?.length ?? 0;
  n += f.size?.length ?? 0;
  n += f.color?.length ?? 0;
  n += f.brand?.length ?? 0;
  n += f.condition?.length ?? 0;
  n += f.discipline?.length ?? 0;
  if (f.priceMin !== undefined || f.priceMax !== undefined) n++;
  if (f.available) n++;
  if (f.donsOnly) n++;
  return n;
}

// ---------------------------------------------------------------- matching

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export const isListing = (item: CatalogueItem): item is Listing => item.kind === "listing";
export const isProduct = (item: CatalogueItem): item is Product => item.kind === "product";

/** Listings visible in the public catalogue. "Vendue" stays visible 7 days with a badge. */
export function isPubliclyVisible(listing: Listing, now = new Date()): boolean {
  if (listing.status === "publiee" || listing.status === "reservee") return true;
  if (listing.status === "vendue") {
    const soldAgeDays = (now.getTime() - new Date(listing.publishedAt).getTime()) / 86_400_000;
    return soldAgeDays <= 60; // demo data: keep sold demo items around
  }
  return false;
}

export const productInStock = (p: Product) =>
  p.variants.some((v) => v.stock > 0 || v.onOrder);

export const itemPrice = (item: CatalogueItem) => item.price;

export const itemDate = (item: CatalogueItem) =>
  new Date(isListing(item) ? item.publishedAt : item.createdAt).getTime();

function matchesText(item: CatalogueItem, q: string): boolean {
  const needle = normalize(q);
  const hay = isListing(item)
    ? [item.title, item.description, item.brand ?? ""]
    : [item.name, item.description];
  return hay.some((h) => normalize(h).includes(needle));
}

export function matchesFilters(item: CatalogueItem, f: CatalogueFilters): boolean {
  if (f.space && item.kind !== (f.space === "occasion" ? "listing" : "product")) return false;
  if (f.q && !matchesText(item, f.q)) return false;
  if (f.team && item.team !== f.team) return false;
  if (f.priceMin !== undefined && item.price < f.priceMin) return false;
  if (f.priceMax !== undefined && item.price > f.priceMax) return false;

  if (isListing(item)) {
    if (f.category && item.categorySlug !== f.category) return false;
    if (f.subCategory && item.subCategorySlug !== f.subCategory) return false;
    if (f.audience?.length && !f.audience.includes(item.audience)) return false;
    if (f.size?.length && (!item.size || !f.size.includes(item.size))) return false;
    if (f.color?.length && (!item.color || !f.color.includes(item.color))) return false;
    if (f.brand?.length && (!item.brand || !f.brand.includes(item.brand))) return false;
    if (f.condition?.length && !f.condition.includes(item.condition)) return false;
    if (f.discipline?.length && (!item.discipline || !f.discipline.includes(item.discipline))) return false;
    if (f.available && item.status !== "publiee") return false;
    if (f.donsOnly && item.price !== 0) return false;
    return true;
  }

  // Products: the Kramer-style category tree is an "occasion" concept, so a
  // category filter only keeps goodies when the "Tout" view is not narrowed.
  if (f.category || f.subCategory) return false;
  if (f.condition?.length) return false;
  if (f.donsOnly) return false;
  if (f.audience?.length) return false;
  if (f.discipline?.length) return false;
  if (f.brand?.length) return false;
  if (f.color?.length) return false;
  if (f.size?.length && !item.variants.some((v) => f.size!.includes(v.label))) return false;
  if (f.available && !productInStock(item)) return false;
  return true;
}

export function sortItems(items: CatalogueItem[], sort: SortKey): CatalogueItem[] {
  const out = [...items];
  switch (sort) {
    case "prix-asc":
      out.sort((a, b) => itemPrice(a) - itemPrice(b) || itemDate(b) - itemDate(a));
      break;
    case "prix-desc":
      out.sort((a, b) => itemPrice(b) - itemPrice(a) || itemDate(b) - itemDate(a));
      break;
    default:
      out.sort((a, b) => itemDate(b) - itemDate(a));
  }
  return out;
}
