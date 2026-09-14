"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteUrl } from "@/lib/supabase/config";
import { DEMO_MESSAGE, type ActionResult } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (fd: FormData, key: string) => (fd.get(key)?.toString() ?? "").trim();

/** Only allow same-site relative redirects. */
function safeNext(value: string | undefined, fallback = "/boutique/compte"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

export async function signUp(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, message: DEMO_MESSAGE };

  // Honeypot: bots fill every field.
  if (str(formData, "website")) return { ok: true, message: "Vérifiez votre boîte mail pour confirmer votre adresse." };

  const email = str(formData, "email").toLowerCase();
  const password = formData.get("password")?.toString() ?? "";
  const firstName = str(formData, "first_name");
  const lastName = str(formData, "last_name");
  const fieldErrors: Record<string, string> = {};
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Adresse email invalide.";
  if (password.length < 8) fieldErrors.password = "8 caractères minimum.";
  if (!firstName) fieldErrors.first_name = "Votre prénom est requis.";
  if (!formData.get("terms")) fieldErrors.terms = "Merci d'accepter les conditions d'utilisation.";
  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
      emailRedirectTo: `${siteUrl()}/boutique/auth/callback?next=${encodeURIComponent("/boutique/compte?bienvenue=1")}`,
    },
  });
  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { ok: false, fieldErrors: { email: "Un compte existe déjà avec cette adresse." } };
    }
    return { ok: false, message: "Inscription impossible pour le moment. Réessayez dans quelques minutes." };
  }
  return {
    ok: true,
    message: "Compte créé ! Ouvrez l'email que nous venons de vous envoyer pour confirmer votre adresse.",
  };
}

export async function signIn(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, message: DEMO_MESSAGE };

  const email = str(formData, "email").toLowerCase();
  const password = formData.get("password")?.toString() ?? "";
  if (!EMAIL_RE.test(email) || !password) {
    return { ok: false, message: "Email ou mot de passe incorrect." };
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.toLowerCase().includes("not confirmed")) {
      return { ok: false, message: "Confirmez d'abord votre adresse email grâce au lien reçu à l'inscription." };
    }
    return { ok: false, message: "Email ou mot de passe incorrect." };
  }
  redirect(safeNext(str(formData, "next")));
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/boutique");
}

export async function requestPasswordReset(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, message: DEMO_MESSAGE };
  const email = str(formData, "email").toLowerCase();
  if (!EMAIL_RE.test(email)) return { ok: false, fieldErrors: { email: "Adresse email invalide." } };
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/boutique/auth/callback?next=${encodeURIComponent("/boutique/reinitialisation")}`,
  });
  // Same answer whether or not the address exists.
  return { ok: true, message: "Si un compte existe avec cette adresse, un email de réinitialisation vient d'être envoyé." };
}

export async function updatePassword(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, message: DEMO_MESSAGE };
  const password = formData.get("password")?.toString() ?? "";
  const confirm = formData.get("confirm")?.toString() ?? "";
  if (password.length < 8) return { ok: false, fieldErrors: { password: "8 caractères minimum." } };
  if (password !== confirm) return { ok: false, fieldErrors: { confirm: "Les deux mots de passe diffèrent." } };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, message: "Le lien a expiré. Demandez un nouvel email de réinitialisation." };
  return { ok: true, message: "Mot de passe mis à jour." };
}

export async function updateProfile(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!supabase || !user) return { ok: false, message: DEMO_MESSAGE };
  const firstName = str(formData, "first_name");
  const lastName = str(formData, "last_name");
  const phone = str(formData, "phone");
  if (!firstName) return { ok: false, fieldErrors: { first_name: "Votre prénom est requis." } };
  if (phone && !/^\+?[0-9 .-]{6,20}$/.test(phone)) return { ok: false, fieldErrors: { phone: "Numéro invalide." } };
  const { error } = await supabase
    .from("profiles")
    .update({ first_name: firstName, last_name: lastName, phone: phone || null })
    .eq("id", user.id);
  if (error) return { ok: false, message: "Enregistrement impossible. Réessayez." };
  revalidatePath("/boutique/compte");
  return { ok: true, message: "Profil enregistré." };
}

/**
 * RGPD: the member deletes their own account. Photos are removed from
 * storage, then the auth user is deleted (profile, listings, reservations
 * cascade).
 */
export async function deleteAccount(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!supabase || !user) return { ok: false, message: DEMO_MESSAGE };
  if (str(formData, "confirm") !== "SUPPRIMER") {
    return { ok: false, fieldErrors: { confirm: "Tapez SUPPRIMER pour confirmer." } };
  }
  const admin = createAdminClient();
  if (!admin) return { ok: false, message: "Suppression indisponible : contactez le club pour supprimer votre compte." };

  const { data: files } = await admin.storage.from("listing-photos").list(user.id, { limit: 1000 });
  if (files?.length) {
    // Photos are stored as <user>/<listing>/<n>.jpg: list each listing folder.
    const paths: string[] = [];
    for (const entry of files) {
      const { data: inner } = await admin.storage.from("listing-photos").list(`${user.id}/${entry.name}`, { limit: 100 });
      for (const f of inner ?? []) paths.push(`${user.id}/${entry.name}/${f.name}`);
    }
    if (paths.length) await admin.storage.from("listing-photos").remove(paths);
  }
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return { ok: false, message: "Suppression impossible pour le moment. Contactez le club." };
  await supabase.auth.signOut();
  redirect("/boutique?compte=supprime");
}
