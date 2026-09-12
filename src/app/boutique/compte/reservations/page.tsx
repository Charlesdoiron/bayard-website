import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { RESERVATION_STATUS_LABELS } from "@/lib/boutique/labels";
import { centsToEuros } from "@/lib/boutique/mappers";
import { formatDate, formatPrice } from "@/lib/boutique/format";
import { SITE_CONFIG } from "@/lib/constants";
import StatusPill from "../../components/status-pill";
import ReservationActions from "./reservation-actions";

// Always rendered per request: depends on the session cookie.
export const dynamic = "force-dynamic";

export default async function MesReservationsPage() {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!supabase || !user) redirect("/boutique/connexion?next=/boutique/compte/reservations");

  const { data: reservations } = await supabase
    .from("reservations")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });
  const ids = (reservations ?? []).map((r) => r.id);
  const { data: items } = ids.length
    ? await supabase.from("reservation_items").select("*").in("reservation_id", ids)
    : { data: [] };
  const productIds = [...new Set((items ?? []).map((i) => i.product_id))];
  const variantIds = [...new Set((items ?? []).map((i) => i.variant_id))];
  const [{ data: products }, { data: variants }] = await Promise.all([
    productIds.length ? supabase.from("products").select("id, name, slug").in("id", productIds) : Promise.resolve({ data: [] }),
    variantIds.length ? supabase.from("product_variants").select("id, label").in("id", variantIds) : Promise.resolve({ data: [] }),
  ]);
  const productById = new Map((products ?? []).map((p) => [p.id, p]));
  const variantById = new Map((variants ?? []).map((v) => [v.id, v]));

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Mes réservations</h1>
      <p className="mt-1 text-sm text-gray-600">
        Paiement et retrait au club house ou au secrétariat, {SITE_CONFIG.business.address.street}, {SITE_CONFIG.business.address.city}.
      </p>

      {!reservations?.length ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-lg font-semibold text-gray-900">Aucune réservation</p>
          <Link href="/boutique/goodies" className="mt-6 inline-flex h-11 items-center rounded-md bg-bayard px-5 text-sm font-semibold text-white">
            Voir les goodies du club
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {reservations.map((r) => {
            const status = RESERVATION_STATUS_LABELS[r.status];
            const lines = (items ?? []).filter((i) => i.reservation_id === r.id);
            const total = lines.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0);
            return (
              <li key={r.id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill label={status.label} tone={status.tone} />
                    <span className="text-xs text-gray-500">Réservée le {formatDate(r.created_at)}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatPrice(centsToEuros(total))}</span>
                </div>
                <ul className="mt-3 divide-y divide-gray-100 text-sm">
                  {lines.map((i) => {
                    const p = productById.get(i.product_id);
                    return (
                      <li key={i.id} className="flex items-center justify-between py-2">
                        <span>
                          {p ? <Link href={`/boutique/goodies/${p.slug}`} className="font-medium text-gray-900 hover:underline">{p.name}</Link> : "Article"}
                          <span className="text-gray-500"> · {variantById.get(i.variant_id)?.label} × {i.quantity}</span>
                          {!i.stocked ? <span className="ml-2 text-xs text-bayard">sur commande</span> : null}
                        </span>
                        <span className="text-gray-700">{formatPrice(centsToEuros(i.unit_price_cents * i.quantity))}</span>
                      </li>
                    );
                  })}
                </ul>
                {r.status === "prete" && r.expires_at ? (
                  <p className="mt-2 text-xs text-emerald-800">À retirer avant le {formatDate(r.expires_at)}.</p>
                ) : null}
                {r.admin_note ? <p className="mt-2 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-700">Message du club : {r.admin_note}</p> : null}
                <div className="mt-3">
                  <ReservationActions id={r.id} status={r.status} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
