"use client";

import { Flag, MessageCircle } from "lucide-react";
import { useState } from "react";
import Modal from "./modal";

interface ContactSellerProps {
  listingTitle: string;
  sellerName: string;
  disabled?: boolean;
}

/**
 * "Contacter le vendeur" + "Signaler". Demo: the form validates locally and
 * shows a confirmation; sending by email arrives with member accounts.
 */
export default function ContactSeller({ listingTitle, sellerName, disabled }: ContactSellerProps) {
  const [open, setOpen] = useState<"contact" | "report" | null>(null);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState(
    `Bonjour ${sellerName}, votre annonce « ${listingTitle} » m'intéresse. Est-elle toujours disponible ?`,
  );
  const [reason, setReason] = useState("");

  const close = () => {
    setOpen(null);
    setSent(false);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setOpen("contact")}
          disabled={disabled}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-bayard text-sm font-semibold text-white hover:bg-bayard-dark disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Contacter le vendeur
        </button>
        <button
          type="button"
          onClick={() => setOpen("report")}
          className="inline-flex h-10 w-full items-center justify-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800"
        >
          <Flag className="h-3.5 w-3.5" aria-hidden="true" />
          Signaler cette annonce
        </button>
      </div>

      <Modal open={open === "contact"} onClose={close} title="Contacter le vendeur">
        {sent ? (
          <Confirmation
            title="Message envoyé"
            text={`${sellerName} recevra votre message par email et pourra vous répondre directement. Votre adresse n'est visible que du vendeur.`}
            onClose={close}
          />
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-4"
          >
            <p className="rounded-md bg-bayard-light px-3 py-2 text-xs text-bayard">
              Version de démonstration : le message n&apos;est pas réellement envoyé. Avec les comptes
              membres, il partira par email au vendeur avec votre adresse en «&nbsp;répondre à&nbsp;».
            </p>
            <label className="block text-sm font-medium text-gray-900">
              Votre message
              <textarea
                required
                minLength={10}
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-bayard focus:outline-none focus:ring-2 focus:ring-bayard/30"
              />
            </label>
            <p className="text-xs text-gray-500">
              La remise se fait en main propre, de préférence au club. Le site ne gère aucun paiement.
            </p>
            <button type="submit" className="h-11 w-full rounded-md bg-bayard text-sm font-semibold text-white hover:bg-bayard-dark">
              Envoyer
            </button>
          </form>
        )}
      </Modal>

      <Modal open={open === "report"} onClose={close} title="Signaler cette annonce">
        {sent ? (
          <Confirmation
            title="Merci pour votre signalement"
            text="L'équipe du club le traitera rapidement."
            onClose={close}
          />
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-4"
          >
            <fieldset>
              <legend className="text-sm font-medium text-gray-900">Motif</legend>
              <div className="mt-2 space-y-2">
                {[
                  "Article interdit ou dangereux",
                  "Annonce trompeuse ou prix anormal",
                  "Contenu inapproprié",
                  "Doublon ou article déjà vendu",
                  "Autre",
                ].map((r) => (
                  <label key={r} className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      required
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="h-4 w-4 accent-bayard"
                    />
                    {r}
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="submit" className="h-11 w-full rounded-md bg-gray-900 text-sm font-semibold text-white hover:bg-black">
              Envoyer le signalement
            </button>
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
      <button type="button" onClick={onClose} className="mt-6 h-11 rounded-md bg-bayard px-6 text-sm font-semibold text-white">
        Fermer
      </button>
    </div>
  );
}
