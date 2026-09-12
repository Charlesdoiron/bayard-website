"use client";

import { useActionState } from "react";
import type { ReservationStatus } from "@/lib/supabase/database.types";
import { adminSetReservationStatus } from "../../actions/admin";
import { idle } from "../../actions/types";
import { FormMessage } from "../../components/form-ui";

const NEXT: Record<ReservationStatus, { status: ReservationStatus; label: string; tone: string }[]> = {
  demandee: [
    { status: "confirmee", label: "Confirmer", tone: "border-bayard text-bayard hover:bg-bayard-light" },
    { status: "prete", label: "Prête à retirer", tone: "border-emerald-300 text-emerald-800 hover:bg-emerald-50" },
    { status: "annulee", label: "Annuler", tone: "border-red-200 text-red-700 hover:bg-red-50" },
  ],
  confirmee: [
    { status: "prete", label: "Prête à retirer", tone: "border-emerald-300 text-emerald-800 hover:bg-emerald-50" },
    { status: "annulee", label: "Annuler", tone: "border-red-200 text-red-700 hover:bg-red-50" },
  ],
  prete: [
    { status: "retiree", label: "Retirée et payée", tone: "border-gray-900 bg-gray-900 text-white hover:bg-black" },
    { status: "annulee", label: "Annuler", tone: "border-red-200 text-red-700 hover:bg-red-50" },
  ],
  retiree: [],
  annulee: [],
  expiree: [],
};

export default function ReservationStatusForm({ id, status, adminNote }: { id: string; status: ReservationStatus; adminNote: string }) {
  const [result, action] = useActionState(adminSetReservationStatus, idle);
  const options = NEXT[status];
  if (!options.length) return null;

  return (
    <form action={action} className="w-full space-y-2 sm:w-64">
      <input type="hidden" name="id" value={id} />
      <FormMessage result={result} />
      <input
        name="admin_note"
        defaultValue={adminNote}
        placeholder="Note pour le membre (facultatif)"
        maxLength={500}
        className="h-9 w-full rounded-md border border-gray-300 px-2 text-xs"
      />
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.status}
            type="submit"
            name="status"
            value={o.status}
            className={`inline-flex h-9 items-center rounded-md border px-3 text-xs font-medium ${o.tone}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </form>
  );
}
