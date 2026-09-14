import type { Metadata } from "next";
import Breadcrumbs from "@/app/components/breadcrumbs/breadcrumbs";
import { SITE_CONFIG } from "@/lib/constants";
import type { SearchParamsInput } from "@/lib/boutique/filters";
import Catalogue from "../components/catalogue";

export const metadata: Metadata = {
  title: "Goodies du club",
  description:
    "Les articles officiels du Club Bayard : polos, sweats, casquettes, tapis de selle et tenues d'équipe. Réservez en ligne, payez et retirez au club house.",
  alternates: { canonical: "/boutique/goodies" },
};

interface PageProps {
  searchParams: Promise<SearchParamsInput>;
}

export default async function GoodiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Boutique", url: `${SITE_CONFIG.url}/boutique` },
          { name: "Goodies du club", url: `${SITE_CONFIG.url}/boutique/goodies` },
        ]}
      />
      <Catalogue
        searchParams={params}
        space="goodies"
        header={
          <div className="py-5 sm:py-6">
            <h1 className="text-2xl font-bold tracking-tight text-balance text-gray-900 sm:text-3xl">Goodies du club</h1>
            <p className="mt-1 text-sm text-pretty text-gray-600 sm:text-base">
              Les articles officiels du Club Bayard. Réservez en ligne, puis payez et retirez au club house ou au
              secrétariat.
            </p>
          </div>
        }
      />
    </>
  );
}
