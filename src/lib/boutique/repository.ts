import { isSupabaseConfigured } from "@/lib/supabase/config";
import * as mock from "./mock-repository";
import * as supabase from "./supabase-repository";

/**
 * Data access for the boutique. Pages and components import from here only.
 * Supabase is used when configured; otherwise the in-memory demo data.
 */

export type { CatalogueResult } from "./mock-repository";

const impl = () => (isSupabaseConfigured() ? supabase : mock);

export const searchCatalogue: typeof mock.searchCatalogue = (filters) => impl().searchCatalogue(filters);
export const getListingBySlug: typeof mock.getListingBySlug = (slug) => impl().getListingBySlug(slug);
export const getProductBySlug: typeof mock.getProductBySlug = (slug) => impl().getProductBySlug(slug);
export const getSimilarListings: typeof mock.getSimilarListings = (listing, limit) =>
  impl().getSimilarListings(listing, limit);
export const getTeamItems: typeof mock.getTeamItems = (team) => impl().getTeamItems(team);
export const getOtherProducts: typeof mock.getOtherProducts = (product, limit) =>
  impl().getOtherProducts(product, limit);
export const getFeatured: typeof mock.getFeatured = () => impl().getFeatured();
export const getAllListingSlugs: typeof mock.getAllListingSlugs = () => impl().getAllListingSlugs();
export const getAllProductSlugs: typeof mock.getAllProductSlugs = () => impl().getAllProductSlugs();
export const getActiveBrands: typeof mock.getActiveBrands = () => impl().getActiveBrands();
