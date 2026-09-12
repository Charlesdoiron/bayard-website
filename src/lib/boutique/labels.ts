import type { ReservationStatus } from "@/lib/supabase/database.types";
import type { ListingStatus } from "./types";

export const LISTING_STATUS_LABELS: Record<ListingStatus, { label: string; tone: "gray" | "amber" | "green" | "blue" | "red" }> = {
  brouillon: { label: "Brouillon", tone: "gray" },
  "en-attente": { label: "En attente de validation", tone: "amber" },
  publiee: { label: "En ligne", tone: "green" },
  reservee: { label: "Réservée", tone: "blue" },
  vendue: { label: "Vendue", tone: "gray" },
  expiree: { label: "Expirée", tone: "gray" },
  refusee: { label: "Refusée", tone: "red" },
  retiree: { label: "Retirée", tone: "gray" },
};

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, { label: string; tone: "gray" | "amber" | "green" | "blue" | "red" }> = {
  demandee: { label: "Demandée", tone: "amber" },
  confirmee: { label: "Confirmée", tone: "blue" },
  prete: { label: "Prête à retirer", tone: "green" },
  retiree: { label: "Retirée et payée", tone: "gray" },
  annulee: { label: "Annulée", tone: "red" },
  expiree: { label: "Expirée", tone: "gray" },
};

export const TONE_CLASSES: Record<"gray" | "amber" | "green" | "blue" | "red", string> = {
  gray: "bg-gray-100 text-gray-700",
  amber: "bg-amber-100 text-amber-900",
  green: "bg-emerald-100 text-emerald-900",
  blue: "bg-bayard-light text-bayard",
  red: "bg-red-100 text-red-800",
};
