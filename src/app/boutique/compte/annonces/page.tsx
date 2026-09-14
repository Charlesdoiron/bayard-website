import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { ListingRow } from "@/lib/supabase/database.types";
import { LISTING_STATUS_LABELS } from "@/lib/boutique/labels";
import { centsToEuros } from "@/lib/boutique/mappers";
import { formatDate, formatPrice } from "@/lib/boutique/format";
import StatusPill from "../../components/status-pill";
import ListingActions from "./listing-actions";

// Always rendered per request: depends on the session cookie.
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ envoyee?: string }>;
}

export default async function MesAnnoncesPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!supabase || !user) redirect("/boutique/connexion?next=/boutique/compte/annonces");
  const { envoyee } = await searchParams;

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("seller_id", user.id)
    .order("updated_at", { ascending: false });

  const rows = listings ?? [];
  const active = rows.filter((l) => ["en-attente", "publiee", "reservee", "brouillon", "refusee"].includes(l.status));
  const past = rows.filter((l) => !active.includes(l));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-gray-900">Mes annonces</h1>
        <Link href="/boutique/vendre" className="press inline-flex h-10 items-center gap-2 rounded-md bg-bayard px-4 text-sm font-semibold text-white hover:bg-bayard-dark">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouvelle annonce
        </Link>
      </div>

      {envoyee ? (
        <p className="mt-4 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
          Annonce envoyée ! Le club la vérifie avant publication, vous recevrez un email dès qu&apos;elle sera en ligne.
        </p>
      ) : null}

      {rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-lg font-semibold text-balance text-gray-900">Aucune annonce pour l&apos;instant</p>
          <p className="mt-2 text-sm text-pretty text-gray-600">Un casque devenu trop petit, une selle qui dort au placard ? Déposez votre première annonce.</p>
          <Link href="/boutique/vendre" className="press mt-6 inline-flex h-11 items-center rounded-md bg-bayard px-5 text-sm font-semibold text-white">
            Vends tes articles
          </Link>
        </div>
      ) : (
        <>
          <ListingTable title="En cours" rows={active} />
          {past.length ? <ListingTable title="Terminées" rows={past} /> : null}
        </>
      )}
    </div>
  );
}

function ListingTable({ title, rows }: { title: string; rows: ListingRow[] }) {
  if (!rows.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h2>
      <ul className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-200">
        {rows.map((l) => {
          const status = LISTING_STATUS_LABELS[l.status];
          return (
            <li key={l.id} className="flex gap-4 p-4">
              <div className="img-outline relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                {l.images[0] ? <Image src={l.images[0]} alt="" fill sizes="64px" className="object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill label={status.label} tone={status.tone} />
                  <span className="text-xs tabular-nums text-gray-500">
                    {l.status === "publiee" && l.expires_at ? `Expire le ${formatDate(l.expires_at)}` : `Modifiée le ${formatDate(l.updated_at)}`}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm font-medium text-gray-900">
                  {l.status === "publiee" || l.status === "reservee" || l.status === "vendue" ? (
                    <Link href={`/boutique/annonce/${l.slug}`} className="hover:underline">{l.title}</Link>
                  ) : (
                    l.title
                  )}
                </p>
                <p className="text-sm tabular-nums text-gray-600">{formatPrice(centsToEuros(l.price_cents))}</p>
                {l.status === "refusee" && l.rejection_reason ? (
                  <p className="mt-1 rounded-md bg-red-50 px-2 py-1 text-xs text-red-700">Motif du refus : {l.rejection_reason}</p>
                ) : null}
                <div className="mt-2">
                  <ListingActions id={l.id} status={l.status} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
