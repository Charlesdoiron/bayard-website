import "server-only";
import * as brevo from "@getbrevo/brevo";
import { siteUrl } from "@/lib/supabase/config";
import { SITE_CONFIG } from "@/lib/constants";
import { formatPrice } from "./format";

/**
 * Transactional emails for the boutique, sent through Brevo (already used by
 * the newsletter). Every template returns { subject, html }; `sendEmail`
 * silently no-ops when BREVO_API_KEY is missing so local runs never fail.
 */

interface Recipient {
  email: string;
  name?: string;
}

interface Mail {
  to: Recipient | Recipient[];
  subject: string;
  html: string;
  replyTo?: Recipient;
}

const FROM = {
  email: process.env.BOUTIQUE_EMAIL_FROM ?? "boutique@clubbayard.com",
  name: process.env.BOUTIQUE_EMAIL_FROM_NAME ?? "Boutique Club Bayard",
};

export function adminRecipients(): Recipient[] {
  const raw = process.env.BOUTIQUE_ADMIN_EMAILS ?? SITE_CONFIG.business.email;
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)
    .map((email) => ({ email, name: "Club Bayard" }));
}

export async function sendEmail(mail: Mail): Promise<boolean> {
  const key = process.env.BREVO_API_KEY;
  const to = Array.isArray(mail.to) ? mail.to : [mail.to];
  if (!key) {
    console.warn("[boutique/email] BREVO_API_KEY absent, email non envoyé :", mail.subject, to.map((t) => t.email));
    return false;
  }
  try {
    const api = new brevo.TransactionalEmailsApi();
    api.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, key);
    const message = new brevo.SendSmtpEmail();
    message.sender = FROM;
    message.to = to;
    message.subject = mail.subject;
    message.htmlContent = mail.html;
    if (mail.replyTo) message.replyTo = mail.replyTo;
    await api.sendTransacEmail(message);
    return true;
  } catch (error) {
    console.error("[boutique/email] envoi impossible :", mail.subject, error);
    return false;
  }
}

// ---------------------------------------------------------------- layout

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const paragraphs = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 12px">${escape(p).replace(/\n/g, "<br>")}</p>`)
    .join("");

function layout(title: string, body: string, cta?: { label: string; href: string }): string {
  const button = cta
    ? `<p style="margin:24px 0"><a href="${cta.href}" style="display:inline-block;background:#005896;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:6px">${escape(cta.label)}</a></p>`
    : "";
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f5f5f5;font-family:Helvetica,Arial,sans-serif;color:#171717">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f5;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden">
        <tr><td style="background:#000;padding:20px 24px;color:#fff;font-size:14px;letter-spacing:.08em;text-transform:uppercase">Club Bayard · Boutique</td></tr>
        <tr><td style="padding:28px 24px;font-size:15px;line-height:1.55">
          <h1 style="margin:0 0 16px;font-size:20px;color:#005896">${escape(title)}</h1>
          ${body}
          ${button}
        </td></tr>
        <tr><td style="padding:16px 24px;background:#fafafa;color:#777;font-size:12px;line-height:1.5">
          ${escape(SITE_CONFIG.business.name)} · ${escape(SITE_CONFIG.business.address.street)}, ${escape(SITE_CONFIG.business.address.postalCode)} ${escape(SITE_CONFIG.business.address.city)}<br>
          Le site ne gère aucun paiement : les transactions se font au club, en main propre.
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

const url = (path: string) => `${siteUrl()}${path}`;

// -------------------------------------------------------------- templates

export interface ListingRef {
  slug: string;
  title: string;
}

export interface ReservationLine {
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
}

export const templates = {
  listingSubmitted: (listing: ListingRef, sellerName: string) => ({
    subject: `Nouvelle annonce à modérer : ${listing.title}`,
    html: layout(
      "Nouvelle annonce à modérer",
      paragraphs(`${sellerName} vient de soumettre l'annonce « ${listing.title} ». Elle attend votre validation.`),
      { label: "Ouvrir la modération", href: url("/boutique/admin/moderation") },
    ),
  }),

  listingPublished: (listing: ListingRef) => ({
    subject: `Votre annonce est en ligne : ${listing.title}`,
    html: layout(
      "Votre annonce est en ligne",
      paragraphs(
        `Bonne nouvelle : « ${listing.title} » est publiée sur la boutique du club.\n\nLes cavaliers intéressés vous écriront par email. Pensez à marquer l'annonce « réservée » puis « vendue » depuis votre espace.`,
      ),
      { label: "Voir l'annonce", href: url(`/boutique/annonce/${listing.slug}`) },
    ),
  }),

  listingRejected: (listing: ListingRef, reason: string) => ({
    subject: `Votre annonce n'a pas été publiée : ${listing.title}`,
    html: layout(
      "Annonce refusée",
      paragraphs(
        `L'annonce « ${listing.title} » n'a pas été validée par l'équipe du club.\n\nMotif : ${reason}\n\nVous pouvez la modifier et la soumettre à nouveau depuis votre espace.`,
      ),
      { label: "Mes annonces", href: url("/boutique/compte/annonces") },
    ),
  }),

  listingExpiringSoon: (listing: ListingRef, days: number) => ({
    subject: `Votre annonce expire dans ${days} jours : ${listing.title}`,
    html: layout(
      "Votre annonce expire bientôt",
      paragraphs(
        `« ${listing.title} » sera retirée automatiquement dans ${days} jours. Si l'article est toujours à vendre, vous pourrez la remettre en ligne en un clic après son expiration, ou dès maintenant depuis votre espace.`,
      ),
      { label: "Mes annonces", href: url("/boutique/compte/annonces") },
    ),
  }),

  contactToSeller: (listing: ListingRef, senderName: string, message: string) => ({
    subject: `Demande pour votre annonce : ${listing.title}`,
    html: layout(
      "Quelqu'un est intéressé par votre annonce",
      `${paragraphs(`${senderName} vous écrit à propos de « ${listing.title} » :`)}
       <blockquote style="margin:0 0 16px;padding:12px 16px;background:#e6f0f7;border-left:4px solid #005896;border-radius:4px">${paragraphs(message)}</blockquote>
       ${paragraphs("Répondez directement à cet email : votre réponse arrivera à l'acheteur. Convenez d'un rendez-vous au club pour la remise en main propre.")}`,
      { label: "Voir l'annonce", href: url(`/boutique/annonce/${listing.slug}`) },
    ),
  }),

  contactCopyToSender: (listing: ListingRef, sellerName: string, message: string) => ({
    subject: `Votre message à ${sellerName} : ${listing.title}`,
    html: layout(
      "Votre message a été transmis",
      `${paragraphs(`Vous avez écrit à ${sellerName} à propos de « ${listing.title} » :`)}
       <blockquote style="margin:0 0 16px;padding:12px 16px;background:#f5f5f5;border-left:4px solid #ccc;border-radius:4px">${paragraphs(message)}</blockquote>
       ${paragraphs("Le vendeur vous répondra par email. Le club ne gère aucun paiement : la remise se fait en main propre, de préférence au centre.")}`,
    ),
  }),

  reportToAdmins: (listing: ListingRef, reason: string, details?: string) => ({
    subject: `Signalement : ${listing.title}`,
    html: layout(
      "Une annonce a été signalée",
      paragraphs(`Annonce : « ${listing.title} »\nMotif : ${reason}${details ? `\n\n${details}` : ""}`),
      { label: "Traiter le signalement", href: url("/boutique/admin/signalements") },
    ),
  }),

  reservationCreated: (lines: ReservationLine[], total: number) => ({
    subject: "Votre réservation est enregistrée",
    html: layout(
      "Réservation enregistrée",
      `${paragraphs("Merci ! Voici le récapitulatif de votre réservation :")}${linesTable(lines, total)}${paragraphs(
        "Vous recevrez un email dès que vos articles seront prêts. Paiement et retrait au club house ou au secrétariat. Une réservation non retirée dans le délai indiqué est annulée et les articles remis en vente.",
      )}`,
      { label: "Mes réservations", href: url("/boutique/compte/reservations") },
    ),
  }),

  reservationToAdmins: (memberName: string, lines: ReservationLine[], total: number) => ({
    subject: `Nouvelle réservation de ${memberName}`,
    html: layout(
      "Nouvelle réservation goodies",
      `${paragraphs(`${memberName} a réservé :`)}${linesTable(lines, total)}`,
      { label: "Gérer les réservations", href: url("/boutique/admin/reservations") },
    ),
  }),

  reservationConfirmed: (lines: ReservationLine[], total: number) => ({
    subject: "Votre réservation est confirmée",
    html: layout(
      "Réservation confirmée",
      `${paragraphs("Le club a confirmé votre réservation. Nous vous préviendrons dès que les articles seront prêts à être retirés.")}${linesTable(lines, total)}`,
      { label: "Mes réservations", href: url("/boutique/compte/reservations") },
    ),
  }),

  reservationReady: (lines: ReservationLine[], total: number, expiresAt?: string) => ({
    subject: "Votre réservation est prête à retirer",
    html: layout(
      "C'est prêt !",
      `${paragraphs(
        `Vos articles vous attendent au club house ou au secrétariat.${expiresAt ? ` Merci de venir les retirer avant le ${expiresAt}.` : ""} Le règlement se fait sur place.`,
      )}${linesTable(lines, total)}`,
      { label: "Mes réservations", href: url("/boutique/compte/reservations") },
    ),
  }),

  reservationCancelled: (lines: ReservationLine[], byMember: boolean) => ({
    subject: "Votre réservation a été annulée",
    html: layout(
      "Réservation annulée",
      `${paragraphs(
        byMember
          ? "Vous avez annulé votre réservation. Les articles sont remis en vente."
          : "Le club a annulé votre réservation. Les articles sont remis en vente. N'hésitez pas à contacter le secrétariat pour en savoir plus.",
      )}${linesTable(lines)}`,
    ),
  }),

  reservationExpired: (lines: ReservationLine[]) => ({
    subject: "Votre réservation a expiré",
    html: layout(
      "Réservation expirée",
      `${paragraphs("Votre réservation n'a pas été retirée dans le délai prévu : elle est annulée et les articles remis en vente. Vous pouvez réserver à nouveau depuis la boutique.")}${linesTable(lines)}`,
      { label: "Goodies du club", href: url("/boutique/goodies") },
    ),
  }),
};

function linesTable(lines: ReservationLine[], total?: number): string {
  const rows = lines
    .map(
      (l) =>
        `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">${escape(l.name)}<br><span style="color:#777;font-size:13px">${escape(l.variant)} × ${l.quantity}</span></td><td align="right" style="padding:6px 0;border-bottom:1px solid #eee;white-space:nowrap">${escape(formatPrice(l.unitPrice * l.quantity))}</td></tr>`,
    )
    .join("");
  const totalRow =
    total !== undefined
      ? `<tr><td style="padding:10px 0;font-weight:600">À régler au club</td><td align="right" style="padding:10px 0;font-weight:600">${escape(formatPrice(total))}</td></tr>`
      : "";
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:8px 0 16px;font-size:15px">${rows}${totalRow}</table>`;
}
