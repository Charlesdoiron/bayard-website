import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/app/components/breadcrumbs/breadcrumbs";
import { SITE_CONFIG } from "@/lib/constants";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { listingFromRow } from "@/lib/boutique/mappers";
import type { Listing } from "@/lib/boutique/types";
import SellForm from "../components/sell-form";

export const metadata: Metadata = {
  title: "Vendre un article",
  description:
    "Déposez une annonce pour vendre votre équipement d'équitation d'occasion aux cavaliers du Club Bayard. Gratuit, sans commission, remise au club.",
  alternates: { canonical: "/boutique/vendre" },
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ modifier?: string }>;
}

export default async function VendrePage({ searchParams }: PageProps) {
  const { modifier } = await searchParams;

  let listing: Listing | undefined;
  if (modifier) {
    const supabase = await createClient();
    const user = await getCurrentUser();
    if (!supabase || !user) notFound();
    const { data } = await supabase.from("listings").select("*").eq("id", modifier).eq("seller_id", user.id).maybeSingle();
    if (!data) notFound();
    listing = listingFromRow(data);
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Boutique", url: `${SITE_CONFIG.url}/boutique` },
          { name: "Vendre", url: `${SITE_CONFIG.url}/boutique/vendre` },
        ]}
      />
      <div className="mx-auto max-w-2xl py-6 sm:py-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-gray-900 sm:text-3xl">
          {listing ? "Modifier l'annonce" : "Vends tes articles"}
        </h1>
        <p className="mt-2 text-sm text-pretty text-gray-600 sm:text-base">
          {listing
            ? "Une annonce déjà en ligne reste en ligne après modification. Une annonce refusée ou en brouillon repasse en validation."
            : "Gratuit et sans commission. Vous décrivez l'article, les cavaliers du club vous contactent, vous vous retrouvez au centre pour la remise."}
        </p>

        {!listing ? (
          <ol className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["1", "Décrivez", "Photos, catégorie, taille, état et prix."],
              ["2", "Publiez", "L'annonce est vérifiée par le club, puis mise en ligne 60 jours."],
              ["3", "Remettez", "Vous répondez par email et fixez un rendez-vous au club."],
            ].map(([n, title, text]) => (
              <li key={n} className="rounded-xl bg-gray-50 p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bayard text-xs font-bold text-white">{n}</span>
                <p className="mt-2 text-sm font-semibold text-balance text-gray-900">{title}</p>
                <p className="mt-0.5 text-xs text-pretty text-gray-600">{text}</p>
              </li>
            ))}
          </ol>
        ) : null}

        <div className="mt-8">
          <SellForm listing={listing} />
        </div>
      </div>
    </>
  );
}
