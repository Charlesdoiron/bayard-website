import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LISTING_STATUS_LABELS } from "@/lib/boutique/labels";
import { formatDate } from "@/lib/boutique/format";
import StatusPill from "../../components/status-pill";
import ReportActions from "./report-actions";

export default async function SignalementsPage() {
  const supabase = await createClient();
  if (!supabase) return null; // demo mode: the admin layout already explains
  const { data: reports } = await supabase
    .from("listing_reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const listingIds = [...new Set((reports ?? []).map((r) => r.listing_id))];
  const { data: listings } = listingIds.length
    ? await supabase.from("listings").select("id, slug, title, status").in("id", listingIds)
    : { data: [] };
  const listingById = new Map((listings ?? []).map((l) => [l.id, l]));
  const open = (reports ?? []).filter((r) => !r.handled_at);
  const handled = (reports ?? []).filter((r) => r.handled_at);

  const Row = ({ r }: { r: NonNullable<typeof reports>[number] }) => {
    const l = listingById.get(r.listing_id);
    const s = l ? LISTING_STATUS_LABELS[l.status] : null;
    return (
      <li className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {s ? <StatusPill label={s.label} tone={s.tone} /> : null}
          <span className="text-xs text-gray-500">{formatDate(r.created_at)}</span>
        </div>
        <p className="mt-1 text-sm font-medium text-gray-900">
          {l ? <Link href={`/boutique/annonce/${l.slug}`} className="hover:underline">{l.title}</Link> : "Annonce supprimée"}
        </p>
        <p className="text-sm text-gray-700">Motif : {r.reason}</p>
        {r.details ? <p className="mt-1 whitespace-pre-line text-sm text-gray-600">{r.details}</p> : null}
        {!r.handled_at ? (
          <div className="mt-2">
            <ReportActions id={r.id} canWithdraw={!!l && (l.status === "publiee" || l.status === "reservee")} />
          </div>
        ) : (
          <p className="mt-1 text-xs text-gray-500">Traité le {formatDate(r.handled_at)}</p>
        )}
      </li>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Signalements</h1>
      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">À traiter ({open.length})</h2>
        <ul className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-200">
          {open.map((r) => <Row key={r.id} r={r} />)}
          {!open.length ? <li className="p-8 text-center text-sm text-gray-500">Aucun signalement en attente.</li> : null}
        </ul>
      </section>
      {handled.length ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Traités</h2>
          <ul className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-200">
            {handled.slice(0, 30).map((r) => <Row key={r.id} r={r} />)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
