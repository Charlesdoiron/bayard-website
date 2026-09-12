"use server";

import { revalidatePath } from "next/cache";
import { createClient, getCurrentProfile } from "@/lib/supabase/server";
import { adminRecipients, sendEmail, templates, type ReservationLine } from "@/lib/boutique/email";
import { reservationLines } from "@/lib/boutique/reservations-server";
import { DEMO_MESSAGE, type ActionResult } from "./types";

export interface ReservationRequest {
  variantId: string;
  quantity: number;
}

const RPC_ERRORS: Record<string, string> = {
  OUT_OF_STOCK: "Cette taille n'est plus disponible.",
  TEAM_ONLY: "Cet article est réservé aux membres de l'équipe. Contactez le secrétariat pour être rattaché.",
  PRODUCT_UNAVAILABLE: "Cet article n'est plus disponible.",
  VARIANT_NOT_FOUND: "Cet article n'est plus disponible.",
  SUSPENDED: "Votre compte est suspendu. Contactez le club.",
  BAD_QUANTITY: "Quantité invalide.",
};

function rpcMessage(error: { message: string }): string {
  const key = Object.keys(RPC_ERRORS).find((k) => error.message.includes(k));
  return key ? RPC_ERRORS[key] : "Réservation impossible pour le moment. Réessayez.";
}

const total = (lines: ReservationLine[]) => lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);

export async function createReservation(items: ReservationRequest[], note?: string): Promise<ActionResult> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  if (!supabase || !profile) return { ok: false, message: DEMO_MESSAGE };
  const clean = items
    .filter((i) => typeof i.variantId === "string" && Number.isInteger(i.quantity) && i.quantity > 0)
    .map((i) => ({ variant_id: i.variantId, quantity: Math.min(i.quantity, 10) }));
  if (!clean.length) return { ok: false, message: "Choisissez au moins un article." };

  const { data: reservationId, error } = await supabase.rpc("create_reservation", {
    p_items: clean,
    p_note: note?.trim().slice(0, 500) || null,
  });
  if (error || !reservationId) return { ok: false, message: error ? rpcMessage(error) : "Réservation impossible." };

  const lines = await reservationLines(supabase, reservationId);
  const sum = total(lines);
  const memberName = `${profile.first_name} ${profile.last_name}`.trim();
  await Promise.all([
    sendEmail({ to: { email: profile.email, name: profile.first_name }, ...templates.reservationCreated(lines, sum) }),
    sendEmail({ to: adminRecipients(), ...templates.reservationToAdmins(memberName, lines, sum) }),
  ]);
  revalidatePath("/boutique/goodies");
  revalidatePath("/boutique/compte/reservations");
  return { ok: true, message: "Réservation enregistrée.", data: { id: reservationId } };
}

export async function cancelReservation(reservationId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  if (!supabase || !profile) return { ok: false, message: DEMO_MESSAGE };
  const lines = await reservationLines(supabase, reservationId);
  const { error } = await supabase.rpc("cancel_reservation", { p_reservation: reservationId });
  if (error) {
    return {
      ok: false,
      message: error.message.includes("NOT_CANCELLABLE")
        ? "Cette réservation est déjà prête : contactez le secrétariat pour l'annuler."
        : "Annulation impossible. Réessayez.",
    };
  }
  void sendEmail({ to: { email: profile.email, name: profile.first_name }, ...templates.reservationCancelled(lines, true) });
  revalidatePath("/boutique/goodies");
  revalidatePath("/boutique/compte/reservations");
  return { ok: true, message: "Réservation annulée." };
}
