import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Centered card used by the sign-in / sign-up / password pages. */
export default function AuthCard({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md py-8 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
      {intro ? <p className="mt-2 text-sm text-gray-600">{intro}</p> : null}
      {!isSupabaseConfigured() ? (
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Version de démonstration : les comptes seront activés avec la mise en service de la base de données.
          Le formulaire est visible, mais aucune donnée n&apos;est enregistrée.
        </p>
      ) : null}
      <div className="mt-6 rounded-2xl border border-gray-200 p-5 sm:p-6">{children}</div>
    </div>
  );
}
