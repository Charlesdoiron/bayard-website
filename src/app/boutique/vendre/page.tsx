import type { Metadata } from "next";
import Breadcrumbs from "@/app/components/breadcrumbs/breadcrumbs";
import { SITE_CONFIG } from "@/lib/constants";
import SellForm from "../components/sell-form";

export const metadata: Metadata = {
  title: "Vendre un article",
  description:
    "Déposez une annonce pour vendre votre équipement d'équitation d'occasion aux cavaliers du Club Bayard. Gratuit, sans commission, remise au club.",
  alternates: { canonical: "/boutique/vendre" },
  robots: { index: false },
};

export default function VendrePage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Boutique", url: `${SITE_CONFIG.url}/boutique` },
          { name: "Vendre", url: `${SITE_CONFIG.url}/boutique/vendre` },
        ]}
      />
      <div className="mx-auto max-w-2xl py-6 sm:py-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Vends tes articles</h1>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Gratuit et sans commission. Vous décrivez l&apos;article, les cavaliers du club vous contactent, vous
          vous retrouvez au centre pour la remise.
        </p>

        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["1", "Décrivez", "Photos, catégorie, taille, état et prix."],
            ["2", "Publiez", "L'annonce est vérifiée par le club, puis mise en ligne 60 jours."],
            ["3", "Remettez", "Vous répondez par email et fixez un rendez-vous au club."],
          ].map(([n, title, text]) => (
            <li key={n} className="rounded-xl bg-gray-50 p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bayard text-xs font-bold text-white">{n}</span>
              <p className="mt-2 text-sm font-semibold text-gray-900">{title}</p>
              <p className="mt-0.5 text-xs text-gray-600">{text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <SellForm />
        </div>
      </div>
    </>
  );
}
