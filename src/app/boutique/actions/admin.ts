"use server";

import { revalidatePath } from "next/cache";
import { createClient, getCurrentProfile, type ServerClient } from "@/lib/supabase/server";
import type { ReservationStatus, ProductInsert } from "@/lib/supabase/database.types";
import { GOODIES_CATEGORIES, TEAMS, isTeamSlug } from "@/lib/boutique/taxonomy";
import { eurosToCents, slugify } from "@/lib/boutique/mappers";
import { sendEmail, templates } from "@/lib/boutique/email";
import { reservationLines } from "@/lib/boutique/reservations-server";
import { formatDate } from "@/lib/boutique/format";
import type { GoodiesCategory, ListingStatus, TeamSlug } from "@/lib/boutique/types";
import { DEMO_MESSAGE, type ActionResult } from "./types";

const str = (fd: FormData, key: string) => (fd.get(key)?.toString() ?? "").trim();

/** Every admin action starts here: a configured client and an admin profile. */
async function requireAdmin(): Promise<{ supabase: ServerClient; adminId: string } | { error: ActionResult }> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  if (!supabase || !profile) return { error: { ok: false, message: DEMO_MESSAGE } };
  if (profile.role !== "admin" || profile.suspended) return { error: { ok: false, message: "Accès réservé aux administrateurs." } };
  return { supabase, adminId: profile.id };
}

function revalidateAdmin() {
  revalidatePath("/boutique");
  revalidatePath("/boutique/occasion");
  revalidatePath("/boutique/goodies");
  revalidatePath("/boutique/admin", "layout");
}

// ------------------------------------------------------------- listings

export async function moderateListing(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { supabase } = auth;
  const id = str(formData, "id");
  const decision = str(formData, "decision");
  const reason = str(formData, "reason").slice(0, 500);
  if (decision !== "publiee" && decision !== "refusee") return { ok: false, message: "Décision invalide." };
  if (decision === "refusee" && reason.length < 3) return { ok: false, fieldErrors: { reason: "Indiquez le motif envoyé au vendeur." } };

  const { data: listing } = await supabase.from("listings").select("id, slug, title, seller_id").eq("id", id).maybeSingle();
  if (!listing) return { ok: false, message: "Annonce introuvable." };
  const { error } = await supabase
    .from("listings")
    .update({ status: decision, rejection_reason: decision === "refusee" ? reason : null })
    .eq("id", id);
  if (error) return { ok: false, message: "Mise à jour impossible." };

  const { data: seller } = await supabase.from("profiles").select("email, first_name").eq("id", listing.seller_id).maybeSingle();
  if (seller) {
    const ref = { slug: listing.slug, title: listing.title };
    const mail = decision === "publiee" ? templates.listingPublished(ref) : templates.listingRejected(ref, reason);
    void sendEmail({ to: { email: seller.email, name: seller.first_name }, ...mail });
  }
  revalidateAdmin();
  revalidatePath(`/boutique/annonce/${listing.slug}`);
  return { ok: true, message: decision === "publiee" ? "Annonce publiée." : "Annonce refusée, le vendeur est prévenu." };
}

export async function adminSetListingStatus(id: string, status: ListingStatus): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const allowed: ListingStatus[] = ["publiee", "retiree", "en-attente"];
  if (!allowed.includes(status)) return { ok: false, message: "Statut invalide." };
  const { data: listing } = await auth.supabase.from("listings").select("slug").eq("id", id).maybeSingle();
  const { error } = await auth.supabase.from("listings").update({ status }).eq("id", id);
  if (error) return { ok: false, message: "Mise à jour impossible." };
  revalidateAdmin();
  if (listing) revalidatePath(`/boutique/annonce/${listing.slug}`);
  return { ok: true };
}

export async function adminDeleteListing(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { data: listing } = await auth.supabase.from("listings").select("slug, images").eq("id", id).maybeSingle();
  if (!listing) return { ok: false, message: "Annonce introuvable." };
  const paths = listing.images.map((u) => u.split("/listing-photos/")[1]).filter((p): p is string => !!p);
  if (paths.length) await auth.supabase.storage.from("listing-photos").remove(paths);
  const { error } = await auth.supabase.from("listings").delete().eq("id", id);
  if (error) return { ok: false, message: "Suppression impossible." };
  revalidateAdmin();
  revalidatePath(`/boutique/annonce/${listing.slug}`);
  return { ok: true };
}

export async function handleReport(reportId: string, alsoWithdraw: boolean): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { data: report } = await auth.supabase.from("listing_reports").select("listing_id").eq("id", reportId).maybeSingle();
  if (!report) return { ok: false, message: "Signalement introuvable." };
  if (alsoWithdraw) {
    await auth.supabase.from("listings").update({ status: "retiree" }).eq("id", report.listing_id);
  }
  const { error } = await auth.supabase
    .from("listing_reports")
    .update({ handled_at: new Date().toISOString(), handled_by: auth.adminId })
    .eq("id", reportId);
  if (error) return { ok: false, message: "Mise à jour impossible." };
  revalidateAdmin();
  return { ok: true };
}

// ------------------------------------------------------------- goodies

interface VariantInput {
  id?: string;
  label: string;
  stock: number;
  onOrder: boolean;
  leadTime?: string;
}

export async function saveProduct(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { supabase } = auth;

  const id = str(formData, "id") || undefined;
  const name = str(formData, "name");
  const category = str(formData, "category") as GoodiesCategory;
  const description = str(formData, "description");
  const price = Number(str(formData, "price").replace(",", "."));
  const team = str(formData, "team");
  const images = formData.getAll("images").map((v) => v.toString().trim()).filter(Boolean);
  let variants: VariantInput[] = [];
  try {
    variants = JSON.parse(str(formData, "variants") || "[]");
  } catch {
    return { ok: false, message: "Déclinaisons invalides." };
  }

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Nom requis.";
  if (!GOODIES_CATEGORIES.some((c) => c.slug === category)) fieldErrors.category = "Catégorie requise.";
  if (description.length < 10) fieldErrors.description = "Description requise (10 caractères minimum).";
  if (!Number.isFinite(price) || price < 0 || price > 20000) fieldErrors.price = "Prix invalide.";
  if (images.length < 1 || images.length > 6) fieldErrors.images = "De 1 à 6 photos.";
  if (team && !isTeamSlug(team)) fieldErrors.team = "Équipe invalide.";
  const cleanVariants = variants
    .map((v) => ({
      id: typeof v.id === "string" ? v.id : undefined,
      label: String(v.label ?? "").trim().slice(0, 40),
      stock: Math.max(0, Math.floor(Number(v.stock) || 0)),
      onOrder: !!v.onOrder,
      leadTime: v.leadTime ? String(v.leadTime).trim().slice(0, 60) : null,
    }))
    .filter((v) => v.label);
  if (cleanVariants.length === 0) fieldErrors.variants = "Ajoutez au moins une déclinaison (ou « Taille unique »).";
  if (new Set(cleanVariants.map((v) => v.label.toLowerCase())).size !== cleanVariants.length) fieldErrors.variants = "Deux déclinaisons portent le même nom.";
  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };

  const payload: Omit<ProductInsert, "slug"> = {
    name,
    category,
    description,
    images,
    price_cents: eurosToCents(price),
    team: (team as TeamSlug) || null,
    team_only: !!team && formData.get("team_only") === "on",
    published: formData.get("published") === "on",
    size_note: str(formData, "size_note") || null,
    sort_order: Math.floor(Number(str(formData, "sort_order")) || 0),
  };

  let productId = id;
  if (productId) {
    const { error } = await supabase.from("products").update(payload).eq("id", productId);
    if (error) return { ok: false, message: "Enregistrement impossible." };
  } else {
    const slug = slugify(name, crypto.randomUUID().slice(0, 4));
    const { data, error } = await supabase.from("products").insert({ ...payload, slug }).select("id").single();
    if (error || !data) return { ok: false, message: "Création impossible." };
    productId = data.id;
  }

  // Variants: upsert kept ones, delete removed ones (only if no reservation references them).
  const { data: existing } = await supabase.from("product_variants").select("id").eq("product_id", productId);
  const keptIds = new Set(cleanVariants.map((v) => v.id).filter((v): v is string => !!v));
  const toDelete = (existing ?? []).map((v) => v.id).filter((vid) => !keptIds.has(vid));
  if (toDelete.length) {
    const { error } = await supabase.from("product_variants").delete().in("id", toDelete);
    if (error) return { ok: false, message: "Une déclinaison supprimée est encore liée à des réservations : mettez son stock à 0 à la place." };
  }
  for (const [i, v] of cleanVariants.entries()) {
    const row = { product_id: productId, label: v.label, stock: v.stock, on_order: v.onOrder, lead_time: v.leadTime, sort_order: i };
    const { error } = v.id
      ? await supabase.from("product_variants").update(row).eq("id", v.id)
      : await supabase.from("product_variants").insert(row);
    if (error) return { ok: false, message: `Déclinaison « ${v.label} » : enregistrement impossible.` };
  }

  revalidateAdmin();
  revalidatePath("/boutique/goodies", "layout");
  return { ok: true, message: "Produit enregistré.", data: { id: productId } };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { data: product } = await auth.supabase.from("products").select("images").eq("id", id).maybeSingle();
  const { error } = await auth.supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, message: "Ce produit a des réservations : masquez-le plutôt que de le supprimer." };
  const paths = (product?.images ?? []).map((u) => u.split("/product-photos/")[1]).filter((p): p is string => !!p);
  if (paths.length) await auth.supabase.storage.from("product-photos").remove(paths);
  revalidateAdmin();
  revalidatePath("/boutique/goodies", "layout");
  return { ok: true };
}

export async function setProductPublished(id: string, published: boolean): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { error } = await auth.supabase.from("products").update({ published }).eq("id", id);
  if (error) return { ok: false, message: "Mise à jour impossible." };
  revalidateAdmin();
  revalidatePath("/boutique/goodies", "layout");
  return { ok: true };
}

// --------------------------------------------------------- reservations

export async function adminSetReservationStatus(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { supabase } = auth;
  const id = str(formData, "id");
  const status = str(formData, "status") as ReservationStatus;
  const note = str(formData, "admin_note").slice(0, 500);
  const allowed: ReservationStatus[] = ["confirmee", "prete", "retiree", "annulee"];
  if (!allowed.includes(status)) return { ok: false, message: "Statut invalide." };

  const { data: reservation } = await supabase.from("reservations").select("id, profile_id, expires_at").eq("id", id).maybeSingle();
  if (!reservation) return { ok: false, message: "Réservation introuvable." };
  const lines = await reservationLines(supabase, id);
  const total = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);

  const { error } = await supabase.rpc("set_reservation_status", { p_reservation: id, p_status: status, p_admin_note: note || null });
  if (error) return { ok: false, message: "Mise à jour impossible." };

  // "Prête" restarts the pick-up countdown.
  let expiresAt = reservation.expires_at;
  if (status === "prete") {
    const { data: setting } = await supabase.from("boutique_settings").select("value").eq("key", "reservation_lifetime_days").maybeSingle();
    const days = Number(setting?.value ?? 14) || 14;
    expiresAt = new Date(Date.now() + days * 86_400_000).toISOString();
    await supabase.from("reservations").update({ expires_at: expiresAt }).eq("id", id);
  }

  const { data: member } = await supabase.from("profiles").select("email, first_name").eq("id", reservation.profile_id).maybeSingle();
  if (member) {
    const to = { email: member.email, name: member.first_name };
    if (status === "confirmee") void sendEmail({ to, ...templates.reservationConfirmed(lines, total) });
    if (status === "prete") void sendEmail({ to, ...templates.reservationReady(lines, total, expiresAt ? formatDate(expiresAt) : undefined) });
    if (status === "annulee") void sendEmail({ to, ...templates.reservationCancelled(lines, false) });
  }
  revalidateAdmin();
  revalidatePath("/boutique/compte/reservations");
  return { ok: true, message: "Réservation mise à jour." };
}

// -------------------------------------------------------------- members

export async function setTeamMembership(profileId: string, team: TeamSlug, member: boolean): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  if (!TEAMS.some((t) => t.slug === team)) return { ok: false, message: "Équipe inconnue." };
  const { error } = member
    ? await auth.supabase.from("team_members").upsert({ profile_id: profileId, team, added_by: auth.adminId })
    : await auth.supabase.from("team_members").delete().eq("profile_id", profileId).eq("team", team);
  if (error) return { ok: false, message: "Mise à jour impossible." };
  revalidatePath("/boutique/admin/membres");
  return { ok: true };
}

export async function setMemberFlags(profileId: string, patch: { suspended?: boolean; role?: "member" | "admin" }): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  if (profileId === auth.adminId && (patch.suspended || patch.role === "member")) {
    return { ok: false, message: "Vous ne pouvez pas vous retirer vos propres droits." };
  }
  const { error } = await auth.supabase.from("profiles").update(patch).eq("id", profileId);
  if (error) return { ok: false, message: "Mise à jour impossible." };
  revalidatePath("/boutique/admin/membres");
  return { ok: true };
}

// ------------------------------------------------------------- settings

const SETTINGS: Record<string, { min: number; max: number }> = {
  listing_lifetime_days: { min: 7, max: 365 },
  reservation_lifetime_days: { min: 1, max: 90 },
  max_listings_per_member: { min: 1, max: 200 },
  contact_messages_per_hour: { min: 1, max: 100 },
};

export async function saveSettings(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const fieldErrors: Record<string, string> = {};
  const updates: { key: string; value: number }[] = [];
  for (const [key, range] of Object.entries(SETTINGS)) {
    const n = Number(str(formData, key));
    if (!Number.isInteger(n) || n < range.min || n > range.max) fieldErrors[key] = `Entre ${range.min} et ${range.max}.`;
    else updates.push({ key, value: n });
  }
  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };
  for (const u of updates) {
    const { error } = await auth.supabase.from("boutique_settings").upsert({ key: u.key, value: u.value });
    if (error) return { ok: false, message: "Enregistrement impossible." };
  }
  revalidatePath("/boutique/admin/parametres");
  return { ok: true, message: "Paramètres enregistrés." };
}
