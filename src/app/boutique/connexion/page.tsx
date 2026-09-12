import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import AuthCard from "../components/auth-card";
import { SignInForm } from "../components/auth-forms";

// Always rendered per request: depends on the session cookie.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ next?: string; erreur?: string }>;
}

export default async function ConnexionPage({ searchParams }: PageProps) {
  const { next, erreur } = await searchParams;
  const target = next && next.startsWith("/") && !next.startsWith("//") ? next : "/boutique/compte";
  if (await getCurrentUser()) redirect(target);

  const initialMessage =
    erreur === "lien" ? "Ce lien n'est plus valide. Connectez-vous ou demandez un nouveau lien." : undefined;

  return (
    <AuthCard title="Se connecter" intro="Accédez à vos annonces et à vos réservations.">
      <SignInForm next={target} initialMessage={initialMessage} />
    </AuthCard>
  );
}
