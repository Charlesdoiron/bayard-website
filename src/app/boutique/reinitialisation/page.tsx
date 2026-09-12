import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AuthCard from "../components/auth-card";
import { UpdatePasswordForm } from "../components/auth-forms";

// Always rendered per request: depends on the session cookie.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  robots: { index: false },
};

export default async function ReinitialisationPage() {
  const user = await getCurrentUser();
  const configured = isSupabaseConfigured();
  return (
    <AuthCard title="Choisir un nouveau mot de passe">
      {configured && !user ? (
        <div className="space-y-3 text-sm text-gray-700">
          <p>Ce lien n&apos;est plus valide ou a déjà été utilisé.</p>
          <Link href="/boutique/mot-de-passe-oublie" className="font-medium text-bayard hover:underline">
            Demander un nouveau lien
          </Link>
        </div>
      ) : (
        <UpdatePasswordForm />
      )}
    </AuthCard>
  );
}
