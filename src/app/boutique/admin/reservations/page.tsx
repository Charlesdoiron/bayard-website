import Link from "next/link";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { ReservationStatus } from "@/lib/supabase/database.types";
import { RESERVATION_STATUS_LABELS } from "@/lib/boutique/labels";
import { centsToEuros } from "@/lib/boutique/mappers";
import { formatDate, formatPrice } from "@/lib/boutique/format";
import StatusPill from "../../components/status-pill";
import ReservationStatusForm from "./reservation-status-form";

const STATUSES = Object.keys(RESERVATION_STATUS_LABELS) as ReservationStatus[];

interface PageProps {
  searchParams: Promise<{ statut?: string }>;
}

export default async function AdminReservationsPage({ searchParams }: PageProps) {
  const { statut } = await searchParams;
  const status = STATUSES.includes(statut as ReservationStatus) ? (statut as ReservationStatus) : undefined;
  const supabase = await createClient();
  if (!supabase) return null; // demo mode: the admin layout already explains

  let query = supabase.from("reservations").select("*").order("created_at", { ascending: false }).limit(300);
  if (status) query = query.eq("status", status);
  else query = query.in("status", ["demandee", "confirmee", "prete"]);
  const { data: reservations } = await query;
  const ids = (reservations ?? []).map((r) => r.id);
  const memberIds = [...new Set((reservations ?? []).map((r) => r.profile_id))];
  const [{ data: items }, { data: members }] = await Promise.all([
    ids.length ? supabase.from("reservation_items").select("*").in("reservation_id", ids) : Promise.resolve({ data: [] }),
    memberIds.length ? supabase.from("profiles").select("id, first_name, last_name, email, phone").in("id", memberIds) : Promise.resolve({ data: [] }),
  ]);
  const productIds = [...new Set((items ?? []).map((i) => i.product_id))];
  const variantIds = [...new Set((items ?? []).map((i) => i.variant_id))];
  const [{ data: products }, { data: variants }] = await Promise.all([
    productIds.length ? supabase.from("products").select("id, name").in("id", productIds) : Promise.resolve({ data: [] }),
    variantIds.length ? supabase.from("product_variants").select("id, label").in("id", variantIds) : Promise.resolve({ data: [] }),
  ]);
  const memberById = new Map((members ?? []).map((m) => [m.id, m]));
  const productById = new Map((products ?? []).map((p) => [p.id, p.name]));
  const variantById = new Map((variants ?? []).map((v) => [v.id, v.label]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-gray-900">Réservations</h1>
        <a href={`/boutique/admin/reservations/export${status ? `?statut=${status}` : ""}`} className="press inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-800 hover:bg-gray-50">
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </a>
      </div>

      <nav className="mt-4 flex flex-wrap gap-2 text-sm" aria-label="Filtrer par statut">
        <Link href="/boutique/admin/reservations" className={`rounded-full px-3 py-1 ${!status ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}>En cours</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/boutique/admin/reservations?statut=${s}`} className={`rounded-full px-3 py-1 ${status === s ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}>
            {RESERVATION_STATUS_LABELS[s].label}
          </Link>
        ))}
      </nav>

      <ul className="mt-6 space-y-4">
        {(reservations ?? []).map((r) => {
          const s = RESERVATION_STATUS_LABELS[r.status];
          const m = memberById.get(r.profile_id);
          const lines = (items ?? []).filter((i) => i.reservation_id === r.id);
          const total = lines.reduce((sum, i) => sum + i.unit_price_cents * i.quantity, 0);
          return (
            <li key={r.id} className="rounded-xl border border-gray-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill label={s.label} tone={s.tone} />
                    <span className="text-xs tabular-nums text-gray-500">{formatDate(r.created_at)}</span>
                    {r.status === "prete" && r.expires_at ? <span className="text-xs tabular-nums text-amber-700">à retirer avant le {formatDate(r.expires_at)}</span> : null}
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {m ? `${m.first_name} ${m.last_name}` : "Membre"}
                    {m ? <span className="ms-2 font-normal text-gray-500">{m.email}{m.phone ? ` · ${m.phone}` : ""}</span> : null}
                  </p>
                  <ul className="mt-2 text-sm text-gray-700">
                    {lines.map((i) => (
                      <li key={i.id}>
                        {productById.get(i.product_id) ?? "Article"} · {variantById.get(i.variant_id)} × {i.quantity}
                        {!i.stocked ? <span className="ms-1 text-xs text-bayard">(sur commande)</span> : null}
                      </li>
                    ))}
                  </ul>
                  {r.note ? <p className="mt-2 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-700">Message du membre : {r.note}</p> : null}
                  <p className="mt-2 text-sm font-semibold tabular-nums text-gray-900">{formatPrice(centsToEuros(total))} à encaisser</p>
                </div>
                <ReservationStatusForm id={r.id} status={r.status} adminNote={r.admin_note ?? ""} />
              </div>
            </li>
          );
        })}
        {!reservations?.length ? <li className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">Aucune réservation.</li> : null}
      </ul>
    </div>
  );
}
