import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import AuthCard from "../components/auth-card";
import { SignUpForm } from "../components/auth-forms";

// Always rendered per request: depends on the session cookie.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Créer un compte",
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function InscriptionPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const target = next && next.startsWith("/") && !next.startsWith("//") ? next : "/boutique/compte";
  if (await getCurrentUser()) redirect(target);

  return (
    <AuthCard
      title="Créer un compte"
      intro="Gratuit, réservé à la communauté du club. Vous confirmerez votre adresse email en un clic."
    >
      <SignUpForm next={target} />
    </AuthCard>
  );
}
