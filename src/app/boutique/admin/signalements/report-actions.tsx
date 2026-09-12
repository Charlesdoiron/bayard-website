"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleReport } from "../../actions/admin";

export default function ReportActions({ id, canWithdraw }: { id: string; canWithdraw: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (withdraw: boolean) => {
    if (withdraw && !window.confirm("Retirer l'annonce de la boutique et clore le signalement ?")) return;
    setError(null);
    startTransition(async () => {
      const res = await handleReport(id, withdraw);
      if (!res.ok) setError(res.message ?? "Action impossible.");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={pending} onClick={() => run(false)} className="inline-flex h-8 items-center rounded-md border border-gray-300 px-2.5 text-xs font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50">
        Classer sans suite
      </button>
      {canWithdraw ? (
        <button type="button" disabled={pending} onClick={() => run(true)} className="inline-flex h-8 items-center rounded-md border border-red-200 px-2.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50">
          Retirer l&apos;annonce
        </button>
      ) : null}
      {error ? <p className="w-full text-xs text-red-600" role="alert">{error}</p> : null}
    </div>
  );
}
