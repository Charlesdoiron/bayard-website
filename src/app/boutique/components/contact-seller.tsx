"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flag, MessageCircle } from "lucide-react";
import { useActionState, useState } from "react";
import { contactSeller, reportListing } from "../actions/listings";
import { idle } from "../actions/types";
import { FormMessage, SubmitButton, textareaClass } from "./form-ui";
import Modal from "./modal";
import { useSession } from "./use-session";

interface ContactSellerProps {
  listingId: string;
  listingTitle: string;
  sellerName: string;
  disabled?: boolean;
}

const REPORT_REASONS = [
  "Article interdit ou dangereux",
  "Annonce trompeuse ou prix anormal",
  "Contenu inapproprié",
  "Doublon ou article déjà vendu",
  "Autre",
];

/**
 * "Contacter le vendeur" + "Signaler". With Supabase configured the message
 * goes through the server action (email to the seller, reply-to the buyer);
 * anonymous visitors are sent to the login page. In demo mode the form only
 * shows a confirmation.
 */
export default function ContactSeller({ listingId, listingTitle, sellerName, disabled }: ContactSellerProps) {
  const pathname = usePathname();
  const session = useSession();
  const [open, setOpen] = useState<"contact" | "report" | null>(null);
  const [demoSent, setDemoSent] = useState(false);
  const [message, setMessage] = useState(
    `Bonjour ${sellerName}, votre annonce « ${listingTitle} » m'intéresse. Est-elle toujours disponible ?`,
  );
  const [contactResult, contactAction] = useActionState(contactSeller, idle);
  const [reportResult, reportAction] = useActionState(reportListing, idle);

  const needsLogin = session.configured && !session.loading && !session.user;
  const loginHref = `/boutique/connexion?next=${encodeURIComponent(pathname)}`;

  const close = () => {
    setOpen(null);
    setDemoSent(false);
  };

  const demoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSent(true);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {needsLogin && !disabled ? (
          <Link
            href={loginHref}
            className="press inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-bayard text-sm font-semibold text-white hover:bg-bayard-dark"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Se connecter pour contacter le vendeur
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setOpen("contact")}
            disabled={disabled}
            className="press inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-bayard text-sm font-semibold text-white hover:bg-bayard-dark disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Contacter le vendeur
          </button>
        )}
        <button
          type="button"
          onClick={() => (needsLogin ? window.location.assign(loginHref) : setOpen("report"))}
          className="inline-flex h-10 w-full items-center justify-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800"
        >
          <Flag className="h-3.5 w-3.5" aria-hidden="true" />
          Signaler cette annonce
        </button>
      </div>

      <Modal open={open === "contact"} onClose={close} title="Contacter le vendeur">
        {contactResult.ok || demoSent ? (
          <Confirmation
            title="Message envoyé"
            text={
              contactResult.message ??
              `${sellerName} recevra votre message par email et pourra vous répondre directement. Votre adresse n'est visible que du vendeur.`
            }
            onClose={close}
          />
        ) : (
          <form action={session.configured ? contactAction : undefined} onSubmit={session.configured ? undefined : demoSubmit} className="space-y-4">
            <input type="hidden" name="listing_id" value={listingId} />
            {!session.configured ? (
              <p className="rounded-md bg-bayard-light px-3 py-2 text-xs text-bayard">
                Version de démonstration : le message n&apos;est pas réellement envoyé.
              </p>
            ) : null}
            <FormMessage result={contactResult} />
            <label className="block text-sm font-medium text-gray-900">
              Votre message
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={2000}
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={textareaClass}
              />
              {contactResult.fieldErrors?.message ? (
                <span className="mt-1 block text-xs text-red-600">{contactResult.fieldErrors.message}</span>
              ) : null}
            </label>
            <p className="text-xs text-gray-500">
              Le vendeur reçoit votre message par email avec votre adresse en «&nbsp;répondre à&nbsp;». La remise se
              fait en main propre, de préférence au club. Le site ne gère aucun paiement.
            </p>
            <SubmitButton className="w-full" pendingLabel="Envoi…">Envoyer</SubmitButton>
          </form>
        )}
      </Modal>

      <Modal open={open === "report"} onClose={close} title="Signaler cette annonce">
        {reportResult.ok || demoSent ? (
          <Confirmation title="Merci pour votre signalement" text="L'équipe du club le traitera rapidement." onClose={close} />
        ) : (
          <form action={session.configured ? reportAction : undefined} onSubmit={session.configured ? undefined : demoSubmit} className="space-y-4">
            <input type="hidden" name="listing_id" value={listingId} />
            <FormMessage result={reportResult} />
            <fieldset>
              <legend className="text-sm font-medium text-gray-900">Motif</legend>
              <div className="mt-2 space-y-2">
                {REPORT_REASONS.map((r) => (
                  <label key={r} className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                    <input type="radio" name="reason" value={r} required className="h-4 w-4 accent-bayard" />
                    {r}
                  </label>
                ))}
              </div>
              {reportResult.fieldErrors?.reason ? <p className="mt-1 text-xs text-red-600">{reportResult.fieldErrors.reason}</p> : null}
            </fieldset>
            <label className="block text-sm font-medium text-gray-900">
              Précisions <span className="font-normal text-gray-500">(facultatif)</span>
              <textarea name="details" rows={3} maxLength={1000} className={textareaClass} />
            </label>
            <SubmitButton variant="danger" className="w-full" pendingLabel="Envoi…">Envoyer le signalement</SubmitButton>
          </form>
        )}
      </Modal>
    </>
  );
}

function Confirmation({ title, text, onClose }: { title: string; text: string; onClose: () => void }) {
  return (
    <div className="py-4 text-center">
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      <p className="mt-2 text-sm text-gray-600">{text}</p>
      <button type="button" onClick={onClose} className="press mt-6 h-11 rounded-md bg-bayard px-6 text-sm font-semibold text-white">
        Fermer
      </button>
    </div>
  );
}
