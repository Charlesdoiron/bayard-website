import type { Metadata } from "next";
import AuthCard from "../components/auth-card";
import { ResetRequestForm } from "../components/auth-forms";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  robots: { index: false },
};

export default function MotDePasseOubliePage() {
  return (
    <AuthCard
      title="Mot de passe oublié"
      intro="Indiquez votre email : nous vous envoyons un lien pour choisir un nouveau mot de passe."
    >
      <ResetRequestForm />
    </AuthCard>
  );
}
