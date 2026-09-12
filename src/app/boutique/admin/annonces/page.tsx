import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LISTING_STATUS_LABELS } from "@/lib/boutique/labels";
import { centsToEuros } from "@/lib/boutique/mappers";
import { formatDate, formatPrice } from "@/lib/boutique/format";
import type { ListingStatus } from "@/lib/boutique/types";
import StatusPill from "../../components/status-pill";
import AdminListingActions from "./admin-listing-actions";

const STATUSES = Object.keys(LISTING_STATUS_LABELS) as ListingStatus[];

interface PageProps {
  searchParams: Promise<{ statut?: string; q?: string }>;
}

export default async function AdminAnnoncesPage({ searchParams }: PageProps) {
  const { statut, q } = await searchParams;
  const status = STATUSES.includes(statut as ListingStatus) ? (statut as ListingStatus) : undefined;
  const supabase = await createClient();
  if (!supabase) return null; // demo mode: the admin layout already explains

  let query = supabase.from("listings").select("*").order("updated_at", { ascending: false }).limit(200);
  if (status) query = query.eq("status", status);
  if (q) query = query.or(`title.ilike.%${q.replace(/[%,()]/g, " ")}%,brand.ilike.%${q.replace(/[%,()]/g, " ")}%`);
  const { data: listings } = await query;
  const sellerIds = [...new Set((listings ?? []).map((l) => l.seller_id))];
  const { data: sellers } = sellerIds.length
    ? await supabase.from("profiles").select("id, first_name, last_name, email").in("id", sellerIds)
    : { data: [] };
  const sellerById = new Map((sellers ?? []).map((s) => [s.id, s]));

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Annonces</h1>
      <form className="mt-4 flex flex-wrap gap-2" method="get">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Titre ou marque"
          className="h-10 rounded-md border border-gray-300 px-3 text-sm"
        />
        <select name="statut" defaultValue={status ?? ""} className="h-10 rounded-md border border-gray-300 px-3 text-sm">
          <option value="">Tous les statuts</option>
          {STATUSES.map((s) => <option key={s} value={s}>{LISTING_STATUS_LABELS[s].label}</option>)}
        </select>
        <button type="submit" className="h-10 rounded-md bg-gray-900 px-4 text-sm font-semibold text-white">Filtrer</button>
      </form>

      <p className="mt-3 text-xs text-gray-500">{listings?.length ?? 0} annonce{(listings?.length ?? 0) > 1 ? "s" : ""}</p>
      <ul className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-200">
        {(listings ?? []).map((l) => {
          const s = LISTING_STATUS_LABELS[l.status];
          const seller = sellerById.get(l.seller_id);
          return (
            <li key={l.id} className="flex gap-4 p-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                {l.images[0] ? <Image src={l.images[0]} alt="" fill sizes="56px" className="object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill label={s.label} tone={s.tone} />
                  <span className="text-xs text-gray-500">{formatDate(l.updated_at)}</span>
                </div>
                <p className="mt-1 truncate text-sm font-medium text-gray-900">
                  <Link href={`/boutique/annonce/${l.slug}`} className="hover:underline">{l.title}</Link>
                  <span className="ml-2 font-normal text-gray-500">{formatPrice(centsToEuros(l.price_cents))}</span>
                </p>
                <p className="truncate text-xs text-gray-500">
                  {seller ? `${seller.first_name} ${seller.last_name} · ${seller.email}` : l.seller_id}
                </p>
                <div className="mt-2">
                  <AdminListingActions id={l.id} status={l.status} />
                </div>
              </div>
            </li>
          );
        })}
        {!listings?.length ? <li className="p-8 text-center text-sm text-gray-500">Aucune annonce.</li> : null}
      </ul>
    </div>
  );
}
