import type { Metadata } from "next";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AccountNav from "./account-nav";

export const metadata: Metadata = {
  title: "Mon compte",
  robots: { index: false },
};

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <h1 className="text-2xl font-bold text-balance text-gray-900">Espace membre</h1>
        <p className="mt-3 text-sm text-pretty text-gray-600">
          L&apos;espace membre (profil, mes annonces, mes réservations) sera activé avec la mise en service de la base
          de données. En attendant, parcourez la boutique en mode démonstration.
        </p>
        <Link href="/boutique" className="press mt-6 inline-flex h-11 items-center rounded-md bg-bayard px-5 text-sm font-semibold text-white">
          Retour à la boutique
        </Link>
      </div>
    );
  }
  return (
    <div className="py-6 sm:py-8">
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <AccountNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
