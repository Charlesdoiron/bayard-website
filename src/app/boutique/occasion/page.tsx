import type { Metadata } from "next";
import Breadcrumbs from "@/app/components/breadcrumbs/breadcrumbs";
import { SITE_CONFIG } from "@/lib/constants";
import type { SearchParamsInput } from "@/lib/boutique/filters";
import Catalogue from "../components/catalogue";

export const metadata: Metadata = {
  title: "Occasion entre cavaliers",
  description:
    "Équipement d'équitation d'occasion vendu entre cavaliers du Club Bayard : selles, casques, bottes, tapis, couvertures, tenues d'équipe. Mise en relation directe, remise au club.",
  alternates: { canonical: "/boutique/occasion" },
};

interface PageProps {
  searchParams: Promise<SearchParamsInput>;
}

export default async function OccasionPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Boutique", url: `${SITE_CONFIG.url}/boutique` },
          { name: "Occasion", url: `${SITE_CONFIG.url}/boutique/occasion` },
        ]}
      />
      <Catalogue
        searchParams={params}
        space="occasion"
        header={
          <div className="py-5 sm:py-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Occasion entre cavaliers</h1>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              Les membres vendent leur matériel entre eux. Vous contactez le vendeur, vous vous retrouvez au club.
            </p>
          </div>
        }
      />
    </>
  );
}
