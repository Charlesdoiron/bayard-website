import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { getTeam } from "@/lib/boutique/taxonomy";
import { formatMonth } from "@/lib/boutique/format";
import { DeleteAccountForm, ProfileForm } from "./profile-forms";

// Always rendered per request: depends on the session cookie.
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ bienvenue?: string }>;
}

export default async function ComptePage({ searchParams }: PageProps) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/boutique/connexion?next=/boutique/compte");
  const { bienvenue } = await searchParams;
  const teams = profile.teams.map((t) => getTeam(t)?.label).filter(Boolean) as string[];

  return (
    <div className="space-y-10">
      {bienvenue ? (
        <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
          Bienvenue {profile.first_name} ! Votre adresse est confirmée. Vous pouvez déposer une annonce ou réserver
          un goodies.
        </p>
      ) : null}

      <section>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Mon profil</h1>
        <p className="mt-1 text-sm text-gray-500">
          Membre depuis {formatMonth(profile.created_at)} · {profile.email}
        </p>
        <div className="mt-6 max-w-lg">
          <ProfileForm profile={{ first_name: profile.first_name, last_name: profile.last_name, phone: profile.phone ?? "" }} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Équipes de compétition</h2>
        {teams.length ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {teams.map((t) => (
              <li key={t} className="rounded-full bg-bayard-light px-3 py-1 text-sm font-medium text-bayard">{t}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-600">Vous n&apos;êtes rattaché à aucune équipe.</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Le rattachement aux équipes est géré par le secrétariat : il donne accès aux tenues réservées à votre équipe.
        </p>
      </section>

      <section className="rounded-xl border border-red-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900">Supprimer mon compte</h2>
        <p className="mt-1 text-sm text-gray-600">
          Vos annonces, réservations, messages et photos seront définitivement supprimés. Cette action est
          irréversible.
        </p>
        <div className="mt-4 max-w-sm">
          <DeleteAccountForm />
        </div>
      </section>
    </div>
  );
}
