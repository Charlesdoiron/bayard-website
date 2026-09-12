"use server";

import { revalidatePath } from "next/cache";
import { createClient, getCurrentProfile } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ListingInsert } from "@/lib/supabase/database.types";
import { AUDIENCES, CONDITIONS, DISCIPLINES, TEAMS, getSubCategory } from "@/lib/boutique/taxonomy";
import { eurosToCents, slugify } from "@/lib/boutique/mappers";
import { adminRecipients, sendEmail, templates } from "@/lib/boutique/email";
import type { Audience, Condition, Discipline, ListingStatus, TeamSlug } from "@/lib/boutique/types";
import { DEMO_MESSAGE, type ActionResult } from "./types";

const str = (fd: FormData, key: string) => (fd.get(key)?.toString() ?? "").trim();
const oneOf = <T extends string>(values: readonly T[], v: string): T | undefined =>
  (values as readonly string[]).includes(v) ? (v as T) : undefined;

const SAFETY = new Set(["casques", "gilets-protection", "protections-dorsales"]);
const IMAGE_URL_RE = /^https:\/\/[^\s]+\/storage\/v1\/object\/public\/listing-photos\/[^\s]+$/;

function revalidateListing(slug?: string) {
  revalidatePath("/boutique");
  revalidatePath("/boutique/occasion");
  revalidatePath("/boutique/compte/annonces");
  if (slug) revalidatePath(`/boutique/annonce/${slug}`);
}

/** Parse and validate the listing form. Shared by create and update. */
function parseListingForm(formData: FormData, sellerId: string): { data?: Omit<ListingInsert, "slug" | "status">; fieldErrors?: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  const title = str(formData, "title");
  const description = str(formData, "description");
  const subCategorySlug = str(formData, "sub_category");
  const sub = getSubCategory(subCategorySlug);
  const audience = oneOf(AUDIENCES.map((a) => a.slug), str(formData, "audience"));
  const condition = oneOf(CONDITIONS.map((c) => c.slug), str(formData, "condition"));
  const discipline = oneOf(DISCIPLINES.map((d) => d.slug), str(formData, "discipline"));
  const team = oneOf(TEAMS.map((t) => t.slug), str(formData, "team"));
  const isDon = formData.get("don") === "on";
  const price = isDon ? 0 : Number(str(formData, "price").replace(",", "."));
  const images = formData
    .getAll("images")
    .map((v) => v.toString().trim())
    .filter(Boolean);

  if (title.length < 3 || title.length > 80) fieldErrors.title = "Entre 3 et 80 caractères.";
  if (description.length < 20) fieldErrors.description = "Décrivez l'article en 20 caractères minimum.";
  if (!sub) fieldErrors.sub_category = "Choisissez une catégorie.";
  if (!audience) fieldErrors.audience = "Indiquez pour qui est l'article.";
  if (!condition) fieldErrors.condition = "Indiquez l'état.";
  if (!isDon && (!Number.isFinite(price) || price < 1 || price > 20000)) fieldErrors.price = "Prix entre 1 et 20 000 €, ou cochez « Je le donne ».";
  if (images.length < 1 || images.length > 6) fieldErrors.images = "De 1 à 6 photos.";
  if (images.some((u) => !IMAGE_URL_RE.test(u) || !u.includes(`/listing-photos/${sellerId}/`))) fieldErrors.images = "Photo invalide.";
  if (sub && SAFETY.has(sub.sub.slug) && formData.get("safety") !== "on") {
    fieldErrors.safety = "Vous devez certifier l'absence de chute pour un équipement de sécurité.";
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  return {
    data: {
      seller_id: sellerId,
      title,
      category_slug: sub!.category.slug,
      sub_category_slug: sub!.sub.slug,
      audience: audience as Audience,
      size: str(formData, "size") || null,
      brand: str(formData, "brand") || null,
      color: str(formData, "color") || null,
      condition: condition as Condition,
      price_cents: eurosToCents(price),
      description,
      images,
      discipline: (discipline as Discipline | undefined) ?? null,
      team: (team as TeamSlug | undefined) ?? null,
    },
  };
}

export async function createListing(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  if (!supabase || !profile) return { ok: false, message: DEMO_MESSAGE };
  if (profile.suspended) return { ok: false, message: "Votre compte est suspendu. Contactez le club." };

  const parsed = parseListingForm(formData, profile.id);
  if (!parsed.data) return { ok: false, fieldErrors: parsed.fieldErrors };

  const id = str(formData, "id") || crypto.randomUUID();
  const asDraft = formData.get("intent") === "draft";
  const slug = slugify(parsed.data.title, id.slice(0, 6));
  const { error } = await supabase.from("listings").insert({
    ...parsed.data,
    id,
    slug,
    status: asDraft ? "brouillon" : "en-attente",
  });
  if (error) {
    console.error("[boutique] createListing", error);
    return {
      ok: false,
      message: error.code === "42501"
        ? "Vous avez atteint le nombre maximum d'annonces actives."
        : "Enregistrement impossible. Réessayez.",
    };
  }

  if (!asDraft) {
    const mail = templates.listingSubmitted({ slug, title: parsed.data.title }, `${profile.first_name} ${profile.last_name}`.trim());
    void sendEmail({ to: adminRecipients(), ...mail });
  }
  revalidateListing();
  return { ok: true, message: asDraft ? "Brouillon enregistré." : "Annonce envoyée pour validation.", data: { slug } };
}

export async function updateListing(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  if (!supabase || !profile) return { ok: false, message: DEMO_MESSAGE };
  const id = str(formData, "id");
  if (!id) return { ok: false, message: "Annonce introuvable." };

  const { data: existing } = await supabase.from("listings").select("id, seller_id, status, slug").eq("id", id).maybeSingle();
  if (!existing || existing.seller_id !== profile.id) return { ok: false, message: "Annonce introuvable." };

  const parsed = parseListingForm(formData, profile.id);
  if (!parsed.data) return { ok: false, fieldErrors: parsed.fieldErrors };

  // Editing a rejected/draft listing resubmits it; a live listing stays live.
  const nextStatus: ListingStatus =
    formData.get("intent") === "draft" ? "brouillon"
    : existing.status === "publiee" || existing.status === "reservee" ? existing.status
    : "en-attente";

  const { error } = await supabase.from("listings").update({ ...parsed.data, status: nextStatus }).eq("id", id);
  if (error) return { ok: false, message: "Enregistrement impossible. Réessayez." };
  if (nextStatus === "en-attente" && existing.status !== "en-attente") {
    const mail = templates.listingSubmitted({ slug: existing.slug, title: parsed.data.title }, `${profile.first_name} ${profile.last_name}`.trim());
    void sendEmail({ to: adminRecipients(), ...mail });
  }
  revalidateListing(existing.slug);
  return { ok: true, message: "Annonce mise à jour.", data: { slug: existing.slug } };
}

const SELLER_TRANSITIONS: Record<string, ListingStatus[]> = {
  publiee: ["reservee", "vendue", "retiree"],
  reservee: ["publiee", "vendue", "retiree"],
  expiree: ["publiee", "retiree"],
  refusee: ["en-attente", "retiree"],
  brouillon: ["en-attente", "retiree"],
  retiree: ["en-attente"],
  vendue: [],
  "en-attente": ["retiree"],
};

/** Seller-side status changes: réservée, vendue, retirée, remise en ligne, resoumission. */
export async function setListingStatus(listingId: string, status: ListingStatus): Promise<ActionResult> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  if (!supabase || !profile) return { ok: false, message: DEMO_MESSAGE };

  const { data: listing } = await supabase.from("listings").select("id, seller_id, status, slug").eq("id", listingId).maybeSingle();
  if (!listing || listing.seller_id !== profile.id) return { ok: false, message: "Annonce introuvable." };
  if (!SELLER_TRANSITIONS[listing.status]?.includes(status)) {
    return { ok: false, message: "Ce changement n'est pas possible pour cette annonce." };
  }
  const { error } = await supabase.from("listings").update({ status }).eq("id", listingId);
  if (error) return { ok: false, message: "Mise à jour impossible. Réessayez." };
  revalidateListing(listing.slug);
  return { ok: true };
}

export async function deleteListing(listingId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  if (!supabase || !profile) return { ok: false, message: DEMO_MESSAGE };
  const { data: listing } = await supabase.from("listings").select("id, seller_id, slug, images").eq("id", listingId).maybeSingle();
  if (!listing || listing.seller_id !== profile.id) return { ok: false, message: "Annonce introuvable." };
  const paths = listing.images
    .map((u) => u.split("/listing-photos/")[1])
    .filter((p): p is string => !!p);
  if (paths.length) await supabase.storage.from("listing-photos").remove(paths);
  const { error } = await supabase.from("listings").delete().eq("id", listingId);
  if (error) return { ok: false, message: "Suppression impossible." };
  revalidateListing(listing.slug);
  return { ok: true };
}

export async function contactSeller(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  if (!supabase || !profile) return { ok: false, message: DEMO_MESSAGE };
  const listingId = str(formData, "listing_id");
  const message = str(formData, "message");
  if (message.length < 10 || message.length > 2000) {
    return { ok: false, fieldErrors: { message: "Entre 10 et 2 000 caractères." } };
  }
  const { data: listing } = await supabase
    .from("listings")
    .select("id, slug, title, seller_id, status")
    .eq("id", listingId)
    .maybeSingle();
  if (!listing || listing.status !== "publiee") return { ok: false, message: "Cette annonce n'est plus disponible." };
  if (listing.seller_id === profile.id) return { ok: false, message: "C'est votre propre annonce." };

  const { error } = await supabase.from("contact_messages").insert({ listing_id: listing.id, sender_id: profile.id, message });
  if (error) {
    return {
      ok: false,
      message: error.code === "42501"
        ? "Vous avez envoyé beaucoup de messages récemment. Réessayez dans une heure."
        : "Envoi impossible. Réessayez.",
    };
  }

  const admin = createAdminClient();
  const { data: seller } = admin
    ? await admin.from("profiles").select("email, first_name, last_name").eq("id", listing.seller_id).maybeSingle()
    : { data: null };
  const senderName = `${profile.first_name} ${profile.last_name.slice(0, 1)}`.trim();
  const ref = { slug: listing.slug, title: listing.title };
  if (seller) {
    const mail = templates.contactToSeller(ref, senderName, message);
    await sendEmail({ to: { email: seller.email, name: seller.first_name }, replyTo: { email: profile.email, name: senderName }, ...mail });
    const copy = templates.contactCopyToSender(ref, `${seller.first_name} ${seller.last_name.slice(0, 1)}`.trim(), message);
    void sendEmail({ to: { email: profile.email, name: profile.first_name }, ...copy });
  } else {
    console.error("[boutique] contactSeller: SUPABASE_SERVICE_ROLE_KEY manquante, email vendeur non envoyé");
  }
  return { ok: true, message: "Message envoyé. Le vendeur vous répondra par email." };
}

export async function reportListing(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  if (!supabase || !profile) return { ok: false, message: DEMO_MESSAGE };
  const listingId = str(formData, "listing_id");
  const reason = str(formData, "reason");
  const details = str(formData, "details").slice(0, 1000);
  if (!reason) return { ok: false, fieldErrors: { reason: "Choisissez un motif." } };
  const { data: listing } = await supabase.from("listings").select("id, slug, title").eq("id", listingId).maybeSingle();
  if (!listing) return { ok: false, message: "Annonce introuvable." };
  const { error } = await supabase.from("listing_reports").insert({ listing_id: listing.id, reporter_id: profile.id, reason, details: details || null });
  if (error) return { ok: false, message: "Envoi impossible. Réessayez." };
  const mail = templates.reportToAdmins({ slug: listing.slug, title: listing.title }, reason, details || undefined);
  void sendEmail({ to: adminRecipients(), ...mail });
  return { ok: true, message: "Merci, le signalement a été transmis au club." };
}
