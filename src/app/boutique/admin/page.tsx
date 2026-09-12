import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { BoutiqueStats } from "@/lib/supabase/database.types";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  if (!supabase) return null; // demo mode: the admin layout already explains
  const { data } = await supabase.rpc("boutique_stats");
  const stats = (data ?? null) as BoutiqueStats | null;

  const tiles = [
    { label: "Annonces à modérer", value: stats?.listings_pending ?? 0, href: "/boutique/admin/moderation", urgent: (stats?.listings_pending ?? 0) > 0 },
    { label: "Signalements ouverts", value: stats?.reports_open ?? 0, href: "/boutique/admin/signalements", urgent: (stats?.reports_open ?? 0) > 0 },
    { label: "Réservations en cours", value: stats?.reservations_open ?? 0, href: "/boutique/admin/reservations", urgent: false },
    { label: "Annonces actives", value: stats?.listings_active ?? 0, href: "/boutique/admin/annonces?statut=publiee", urgent: false },
    { label: "Ventes déclarées", value: stats?.listings_sold ?? 0, href: "/boutique/admin/annonces?statut=vendue", urgent: false },
    { label: "Réservations retirées", value: stats?.reservations_done ?? 0, href: "/boutique/admin/reservations?statut=retiree", urgent: false },
    { label: "Membres", value: stats?.members ?? 0, href: "/boutique/admin/membres", urgent: false },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tableau de bord</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className={`rounded-xl border p-4 hover:bg-gray-50 ${t.urgent ? "border-amber-300 bg-amber-50" : "border-gray-200"}`}
          >
            <p className="text-3xl font-bold text-gray-900">{t.value}</p>
            <p className="mt-1 text-sm text-gray-600">{t.label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">Goodies les plus demandés</h2>
        {stats?.top_products?.length ? (
          <ol className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-200">
            {stats.top_products.map((p, i) => (
              <li key={p.name} className="flex items-center justify-between px-4 py-3 text-sm">
                <span><span className="mr-2 text-gray-400">{i + 1}.</span>{p.name}</span>
                <span className="font-semibold text-gray-900">{p.quantity}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-gray-500">Aucune réservation pour l&apos;instant.</p>
        )}
      </section>
    </div>
  );
}
