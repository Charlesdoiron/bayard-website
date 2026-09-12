"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ReservationStatus } from "@/lib/supabase/database.types";
import { cancelReservation } from "../../actions/reservations";

export default function ReservationActions({ id, status }: { id: string; status: ReservationStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (status !== "demandee" && status !== "confirmee") {
    return status === "prete" ? (
      <p className="text-xs text-gray-500">Pour annuler une réservation prête, contactez le secrétariat.</p>
    ) : null;
  }

  const cancel = () => {
    if (!window.confirm("Annuler cette réservation ? Les articles seront remis en vente.")) return;
    setError(null);
    startTransition(async () => {
      const res = await cancelReservation(id);
      if (!res.ok) setError(res.message ?? "Annulation impossible.");
      router.refresh();
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={cancel}
        disabled={pending}
        className="inline-flex h-9 items-center rounded-md border border-red-200 px-3 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        {pending ? "Annulation…" : "Annuler la réservation"}
      </button>
      {error ? <p className="mt-1 text-xs text-red-600" role="alert">{error}</p> : null}
    </div>
  );
}
