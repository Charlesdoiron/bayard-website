import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AdminNav from "./admin-nav";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

// Session-dependent, never cached.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <h1 className="text-2xl font-bold text-balance text-gray-900">Back-office</h1>
        <p className="mt-3 text-sm text-pretty text-gray-600">
          Le back-office (modération, goodies, réservations, équipes) sera activé avec la mise en service de la base de
          données.
        </p>
        <Link href="/boutique" className="press mt-6 inline-flex h-11 items-center rounded-md bg-bayard px-5 text-sm font-semibold text-white">
          Retour à la boutique
        </Link>
      </div>
    );
  }
  const profile = await getCurrentProfile();
  if (!profile) redirect("/boutique/connexion?next=/boutique/admin");
  if (profile.role !== "admin" || profile.suspended) notFound();

  return (
    <div className="py-6 sm:py-8">
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <AdminNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
