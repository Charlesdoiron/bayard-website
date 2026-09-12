"use client";

import { useActionState, useState } from "react";
import { moderateListing } from "../../actions/admin";
import { idle } from "../../actions/types";
import { FormMessage, SubmitButton, textareaClass } from "../../components/form-ui";

const REASONS = [
  "Photos insuffisantes ou ne montrant pas l'article réel",
  "Description incomplète (état, taille, défauts)",
  "Article non accepté sur la boutique",
  "Prix manifestement incohérent",
  "Doublon d'une annonce existante",
];

export default function ModerationForm({ id }: { id: string }) {
  const [result, action] = useActionState(moderateListing, idle);
  const [refusing, setRefusing] = useState(false);

  if (result.ok) {
    return <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{result.message}</p>;
  }

  return (
    <form action={action} className="space-y-3 rounded-lg bg-gray-50 p-4">
      <input type="hidden" name="id" value={id} />
      <FormMessage result={result} />
      {!refusing ? (
        <div className="flex flex-col gap-2">
          <button type="submit" name="decision" value="publiee" className="h-11 rounded-md bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">
            Publier
          </button>
          <button type="button" onClick={() => setRefusing(true)} className="h-11 rounded-md border border-red-200 text-sm font-medium text-red-700 hover:bg-red-50">
            Refuser…
          </button>
        </div>
      ) : (
        <>
          <label className="block text-sm font-medium text-gray-900">
            Motif envoyé au vendeur
            <input list={`reasons-${id}`} name="reason" required minLength={3} maxLength={500} className={`${textareaClass} h-11`} />
            <datalist id={`reasons-${id}`}>
              {REASONS.map((r) => <option key={r} value={r} />)}
            </datalist>
          </label>
          {result.fieldErrors?.reason ? <p className="text-xs text-red-600">{result.fieldErrors.reason}</p> : null}
          <div className="flex gap-2">
            <SubmitButton variant="danger" className="flex-1" pendingLabel="Envoi…">
              <input type="hidden" name="decision" value="refusee" />
              Confirmer le refus
            </SubmitButton>
            <button type="button" onClick={() => setRefusing(false)} className="h-11 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-800">
              Annuler
            </button>
          </div>
        </>
      )}
    </form>
  );
}
