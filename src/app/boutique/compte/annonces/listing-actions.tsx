"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ListingStatus } from "@/lib/boutique/types";
import { deleteListing, setListingStatus } from "../../actions/listings";

interface Props {
  id: string;
  status: ListingStatus;
}

const btn = "press inline-flex h-9 items-center rounded-md border px-3 text-xs font-medium disabled:opacity-50";
const neutral = `${btn} border-gray-300 text-gray-800 hover:bg-gray-50`;
const primary = `${btn} border-bayard bg-bayard text-white hover:bg-bayard-dark`;
const danger = `${btn} border-red-200 text-red-700 hover:bg-red-50`;

/** Seller-side actions on one listing (spec §5.2 lifecycle). */
export default function ListingActions({ id, status }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const change = (next: ListingStatus, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setError(null);
    startTransition(async () => {
      const res = await setListingStatus(id, next);
      if (!res.ok) setError(res.message ?? "Action impossible.");
      router.refresh();
    });
  };

  const remove = () => {
    if (!window.confirm("Supprimer définitivement cette annonce et ses photos ?")) return;
    startTransition(async () => {
      const res = await deleteListing(id);
      if (!res.ok) setError(res.message ?? "Suppression impossible.");
      router.refresh();
    });
  };

  const editLink = (
    <Link href={`/boutique/vendre?modifier=${id}`} className={neutral}>
      Modifier
    </Link>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {status === "publiee" ? (
        <>
          <button type="button" disabled={pending} onClick={() => change("reservee")} className={primary}>Marquer réservée</button>
          <button type="button" disabled={pending} onClick={() => change("vendue", "Marquer cette annonce comme vendue ? Elle restera visible 7 jours avec le badge « Vendu ».")} className={neutral}>Marquer vendue</button>
          {editLink}
          <button type="button" disabled={pending} onClick={() => change("retiree", "Retirer cette annonce de la boutique ?")} className={danger}>Retirer</button>
        </>
      ) : null}
      {status === "reservee" ? (
        <>
          <button type="button" disabled={pending} onClick={() => change("vendue")} className={primary}>Marquer vendue</button>
          <button type="button" disabled={pending} onClick={() => change("publiee")} className={neutral}>Remettre en vente</button>
          <button type="button" disabled={pending} onClick={() => change("retiree", "Retirer cette annonce de la boutique ?")} className={danger}>Retirer</button>
        </>
      ) : null}
      {status === "expiree" ? (
        <>
          <button type="button" disabled={pending} onClick={() => change("publiee")} className={primary}>Remettre en ligne</button>
          <button type="button" disabled={pending} onClick={remove} className={danger}>Supprimer</button>
        </>
      ) : null}
      {status === "brouillon" || status === "refusee" ? (
        <>
          {editLink}
          <button type="button" disabled={pending} onClick={() => change("en-attente")} className={primary}>Soumettre à validation</button>
          <button type="button" disabled={pending} onClick={remove} className={danger}>Supprimer</button>
        </>
      ) : null}
      {status === "en-attente" ? (
        <button type="button" disabled={pending} onClick={() => change("retiree", "Annuler la demande de publication ?")} className={neutral}>Annuler la demande</button>
      ) : null}
      {status === "retiree" ? (
        <>
          {editLink}
          <button type="button" disabled={pending} onClick={() => change("en-attente")} className={neutral}>Republier (validation)</button>
          <button type="button" disabled={pending} onClick={remove} className={danger}>Supprimer</button>
        </>
      ) : null}
      {status === "vendue" ? (
        <button type="button" disabled={pending} onClick={remove} className={neutral}>Supprimer</button>
      ) : null}
      {error ? <p className="w-full text-xs text-red-600" role="alert">{error}</p> : null}
    </div>
  );
}
