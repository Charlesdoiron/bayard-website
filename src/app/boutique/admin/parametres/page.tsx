import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./settings-form";

const DEFAULTS: Record<string, number> = {
  listing_lifetime_days: 60,
  reservation_lifetime_days: 14,
  max_listings_per_member: 20,
  contact_messages_per_hour: 10,
};

export default async function ParametresPage() {
  const supabase = await createClient();
  if (!supabase) return null; // demo mode: the admin layout already explains
  const { data } = await supabase.from("boutique_settings").select("key, value");
  const values = { ...DEFAULTS };
  for (const row of data ?? []) {
    const n = Number(row.value);
    if (row.key in values && Number.isFinite(n)) values[row.key] = n;
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight text-balance text-gray-900">Paramètres</h1>
      <p className="mt-1 text-sm text-gray-600">Réglages appliqués immédiatement, sans redéploiement.</p>
      <div className="mt-6">
        <SettingsForm values={values} />
      </div>
      <section className="mt-10 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
        <h2 className="font-semibold text-balance text-gray-900">Référentiels</h2>
        <p className="mt-1">
          Les catégories, tailles, marques et équipes sont définies dans le code (<code>src/lib/boutique/taxonomy.ts</code>)
          pour rester cohérentes avec les filtres. Demandez une modification à votre prestataire.
        </p>
      </section>
    </div>
  );
}
