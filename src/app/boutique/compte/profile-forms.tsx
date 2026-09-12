"use client";

import { useActionState } from "react";
import { deleteAccount, updateProfile } from "../actions/auth";
import { idle } from "../actions/types";
import { Field, FormMessage, SubmitButton, inputClass } from "../components/form-ui";

export function ProfileForm({ profile }: { profile: { first_name: string; last_name: string; phone: string } }) {
  const [result, action] = useActionState(updateProfile, idle);
  const errors = result.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-4">
      <FormMessage result={result} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prénom" name="first_name" error={errors.first_name}>
          <input id="first_name" name="first_name" required defaultValue={profile.first_name} autoComplete="given-name" className={inputClass} />
        </Field>
        <Field label="Nom" name="last_name" hint="Seule l'initiale est affichée publiquement.">
          <input id="last_name" name="last_name" defaultValue={profile.last_name} autoComplete="family-name" className={inputClass} />
        </Field>
      </div>
      <Field label={<>Téléphone <span className="font-normal text-gray-500">(facultatif)</span></>} name="phone" error={errors.phone} hint="Jamais affiché. Utile au secrétariat pour les réservations.">
        <input id="phone" name="phone" type="tel" defaultValue={profile.phone} autoComplete="tel" className={inputClass} />
      </Field>
      <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
    </form>
  );
}

export function DeleteAccountForm() {
  const [result, action] = useActionState(deleteAccount, idle);
  return (
    <form action={action} className="space-y-3">
      <FormMessage result={result} />
      <Field label="Tapez SUPPRIMER pour confirmer" name="confirm" error={result.fieldErrors?.confirm}>
        <input id="confirm" name="confirm" required autoComplete="off" className={inputClass} />
      </Field>
      <SubmitButton variant="danger" pendingLabel="Suppression…">Supprimer définitivement mon compte</SubmitButton>
    </form>
  );
}
