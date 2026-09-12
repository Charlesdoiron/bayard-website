/**
 * Hand-written types for the boutique schema (supabase/migrations/0001_boutique.sql).
 * Regenerate with `supabase gen types typescript --local > src/lib/supabase/database.types.ts`
 * once the project exists; keep the shape in sync with the migration.
 */

import type {
  Audience,
  Condition,
  Discipline,
  GoodiesCategory,
  ListingStatus,
  TeamSlug,
} from "@/lib/boutique/types";

export type BoutiqueRole = "member" | "admin";
export type ReservationStatus =
  | "demandee"
  | "confirmee"
  | "prete"
  | "retiree"
  | "annulee"
  | "expiree";

export type ProfileRow = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: BoutiqueRole;
  suspended: boolean;
  created_at: string;
  updated_at: string;
}

export type TeamMemberRow = {
  profile_id: string;
  team: TeamSlug;
  added_by: string | null;
  created_at: string;
}

export type PublicProfileRow = {
  id: string;
  display_name: string;
  member_since: string;
  teams: TeamSlug[];
}

export type ListingRow = {
  id: string;
  seller_id: string;
  slug: string;
  title: string;
  category_slug: string;
  sub_category_slug: string;
  audience: Audience;
  size: string | null;
  brand: string | null;
  color: string | null;
  condition: Condition;
  price_cents: number;
  description: string;
  images: string[];
  discipline: Discipline | null;
  team: TeamSlug | null;
  status: ListingStatus;
  rejection_reason: string | null;
  published_at: string | null;
  expires_at: string | null;
  sold_at: string | null;
  expiry_notified_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ListingInsert = Omit<
  ListingRow,
  | "id" | "rejection_reason" | "published_at" | "expires_at" | "sold_at"
  | "expiry_notified_at" | "created_at" | "updated_at"
> & { id?: string };

export type ListingReportRow = {
  id: string;
  listing_id: string;
  reporter_id: string | null;
  reason: string;
  details: string | null;
  handled_at: string | null;
  handled_by: string | null;
  created_at: string;
}

export type ContactMessageRow = {
  id: string;
  listing_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: GoodiesCategory;
  description: string;
  images: string[];
  price_cents: number;
  team: TeamSlug | null;
  team_only: boolean;
  published: boolean;
  size_note: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = Omit<ProductRow, "id" | "created_at" | "updated_at"> & { id?: string };

export type ProductVariantRow = {
  id: string;
  product_id: string;
  label: string;
  stock: number;
  on_order: boolean;
  lead_time: string | null;
  sort_order: number;
}

export type ProductVariantInsert = Omit<ProductVariantRow, "id"> & { id?: string };

export type ReservationRow = {
  id: string;
  profile_id: string;
  status: ReservationStatus;
  note: string | null;
  admin_note: string | null;
  expires_at: string | null;
  ready_at: string | null;
  picked_up_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ReservationItemRow = {
  id: string;
  reservation_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price_cents: number;
  stocked: boolean;
}

export type SettingRow = {
  key: string;
  value: unknown;
  updated_at: string;
}

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      boutique_settings: Table<SettingRow>;
      profiles: Table<ProfileRow>;
      team_members: Table<TeamMemberRow>;
      listings: Table<ListingRow, ListingInsert>;
      listing_reports: Table<ListingReportRow>;
      contact_messages: Table<ContactMessageRow>;
      products: Table<ProductRow, ProductInsert>;
      product_variants: Table<ProductVariantRow, ProductVariantInsert>;
      reservations: Table<ReservationRow>;
      reservation_items: Table<ReservationItemRow>;
    };
    Views: {
      public_profiles: { Row: PublicProfileRow; Relationships: [] };
    };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      create_reservation: {
        Args: { p_items: { variant_id: string; quantity: number }[]; p_note?: string | null };
        Returns: string;
      };
      cancel_reservation: { Args: { p_reservation: string }; Returns: undefined };
      set_reservation_status: {
        Args: { p_reservation: string; p_status: ReservationStatus; p_admin_note?: string | null };
        Returns: undefined;
      };
      expire_stale: {
        Args: Record<string, never>;
        Returns: { kind: "listing" | "reservation"; id: string }[];
      };
      contact_quota_exceeded: { Args: Record<string, never>; Returns: boolean };
      boutique_stats: { Args: Record<string, never>; Returns: BoutiqueStats | null };
    };
    Enums: {
      boutique_role: BoutiqueRole;
      listing_status: ListingStatus;
      listing_condition: Condition;
      audience: Audience;
      discipline: Discipline;
      team_slug: TeamSlug;
      goodies_category: GoodiesCategory;
      reservation_status: ReservationStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type BoutiqueStats = {
  listings_active: number;
  listings_pending: number;
  listings_sold: number;
  reports_open: number;
  reservations_open: number;
  reservations_done: number;
  members: number;
  top_products: { name: string; quantity: number }[];
}
