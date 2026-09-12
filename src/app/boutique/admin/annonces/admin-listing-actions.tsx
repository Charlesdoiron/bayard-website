"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ListingStatus } from "@/lib/boutique/types";
import { adminDeleteListing, adminSetListingStatus } from "../../actions/admin";

const btn = "inline-flex h-8 items-center rounded-md border px-2.5 text-xs font-medium disabled:opacity-50";

export default function AdminListingActions({ id, status }: { id: string; status: ListingStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<{ ok: boolean; message?: string }>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.message ?? "Action impossible.");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {status === "publiee" || status === "reservee" ? (
        <button type="button" disabled={pending} onClick={() => run(() => adminSetListingStatus(id, "retiree"), "Retirer cette annonce de la boutique ?")} className={`${btn} border-amber-300 text-amber-900 hover:bg-amber-50`}>
          Retirer
        </button>
      ) : null}
      {status === "retiree" || status === "expiree" || status === "refusee" ? (
        <button type="button" disabled={pending} onClick={() => run(() => adminSetListingStatus(id, "publiee"))} className={`${btn} border-emerald-300 text-emerald-800 hover:bg-emerald-50`}>
          Publier
        </button>
      ) : null}
      {status === "en-attente" ? (
        <a href="/boutique/admin/moderation" className={`${btn} border-gray-300 text-gray-800`}>Modérer</a>
      ) : null}
      <button type="button" disabled={pending} onClick={() => run(() => adminDeleteListing(id), "Supprimer définitivement cette annonce et ses photos ?")} className={`${btn} border-red-200 text-red-700 hover:bg-red-50`}>
        Supprimer
      </button>
      {error ? <p className="w-full text-xs text-red-600" role="alert">{error}</p> : null}
    </div>
  );
}
