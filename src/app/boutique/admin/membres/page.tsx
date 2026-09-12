import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/boutique/format";
import MemberRow from "./member-row";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function MembresPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const supabase = await createClient();
  if (!supabase) return null; // demo mode: the admin layout already explains
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(300);
  if (q) {
    const term = q.replace(/[%,()]/g, " ").trim();
    query = query.or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%`);
  }
  const { data: profiles } = await query;
  const ids = (profiles ?? []).map((p) => p.id);
  const { data: memberships } = ids.length
    ? await supabase.from("team_members").select("profile_id, team").in("profile_id", ids)
    : { data: [] };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Membres &amp; équipes</h1>
      <p className="mt-1 text-sm text-gray-600">
        Rattachez les cavaliers à leurs équipes de compétition : ils accèdent alors aux tenues réservées à l&apos;équipe.
      </p>
      <form method="get" className="mt-4 flex gap-2">
        <input type="search" name="q" defaultValue={q} placeholder="Nom ou email" className="h-10 w-64 rounded-md border border-gray-300 px-3 text-sm" />
        <button type="submit" className="h-10 rounded-md bg-gray-900 px-4 text-sm font-semibold text-white">Rechercher</button>
      </form>

      <ul className="mt-6 divide-y divide-gray-100 rounded-xl border border-gray-200">
        {(profiles ?? []).map((p) => (
          <MemberRow
            key={p.id}
            profile={{
              id: p.id,
              name: `${p.first_name} ${p.last_name}`.trim() || "(sans nom)",
              email: p.email,
              phone: p.phone,
              role: p.role,
              suspended: p.suspended,
              since: formatDate(p.created_at),
            }}
            teams={(memberships ?? []).filter((m) => m.profile_id === p.id).map((m) => m.team)}
          />
        ))}
        {!profiles?.length ? <li className="p-8 text-center text-sm text-gray-500">Aucun membre.</li> : null}
      </ul>
    </div>
  );
}
