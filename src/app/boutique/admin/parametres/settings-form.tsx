"use client";

import { useActionState } from "react";
import { saveSettings } from "../../actions/admin";
import { idle } from "../../actions/types";
import { Field, FormMessage, SubmitButton, inputClass } from "../../components/form-ui";

const FIELDS = [
  { key: "listing_lifetime_days", label: "Durée de vie d'une annonce (jours)", hint: "Après ce délai sans mise à jour, l'annonce expire. Le vendeur peut la remettre en ligne en un clic." },
  { key: "reservation_lifetime_days", label: "Délai de retrait d'une réservation (jours)", hint: "Compté à partir de l'email « prête à retirer ». Passé ce délai, la réservation expire et le stock est remis en vente." },
  { key: "max_listings_per_member", label: "Nombre maximum d'annonces actives par membre" },
  { key: "contact_messages_per_hour", label: "Messages de contact par heure et par membre (anti-spam)" },
];

export default function SettingsForm({ values }: { values: Record<string, number> }) {
  const [result, action] = useActionState(saveSettings, idle);
  return (
    <form action={action} className="space-y-5">
      <FormMessage result={result} />
      {FIELDS.map((f) => (
        <Field key={f.key} label={f.label} name={f.key} hint={f.hint} error={result.fieldErrors?.[f.key]}>
          <input id={f.key} name={f.key} type="number" required defaultValue={values[f.key]} className={`${inputClass} max-w-[10rem]`} />
        </Field>
      ))}
      <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
    </form>
  );
}
