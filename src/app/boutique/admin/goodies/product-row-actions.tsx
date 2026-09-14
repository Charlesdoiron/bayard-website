"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProduct, setProductPublished } from "../../actions/admin";

const btn = "press inline-flex h-8 items-center rounded-md border px-2.5 text-xs font-medium disabled:opacity-50";

export default function ProductRowActions({ id, published, slug }: { id: string; published: boolean; slug: string }) {
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
      <Link href={`/boutique/admin/goodies/${id}`} className={`${btn} border-gray-300 text-gray-800 hover:bg-gray-50`}>Modifier</Link>
      {published ? (
        <Link href={`/boutique/goodies/${slug}`} className={`${btn} border-gray-300 text-gray-800 hover:bg-gray-50`}>Voir</Link>
      ) : null}
      <button type="button" disabled={pending} onClick={() => run(() => setProductPublished(id, !published))} className={`${btn} border-gray-300 text-gray-800 hover:bg-gray-50`}>
        {published ? "Masquer" : "Publier"}
      </button>
      <button type="button" disabled={pending} onClick={() => run(() => deleteProduct(id), "Supprimer ce produit ? Impossible s'il a des réservations.")} className={`${btn} border-red-200 text-red-700 hover:bg-red-50`}>
        Supprimer
      </button>
      {error ? <p className="w-full text-xs text-red-600" role="alert">{error}</p> : null}
    </div>
  );
}
