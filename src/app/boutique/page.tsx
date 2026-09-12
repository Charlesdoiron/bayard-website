import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/app/components/breadcrumbs/breadcrumbs";
import { SITE_CONFIG } from "@/lib/constants";
import type { SearchParamsInput } from "@/lib/boutique/filters";
import Catalogue from "./components/catalogue";

export const metadata: Metadata = {
  title: "Boutique du Club Bayard : occasion entre cavaliers & goodies",
  description:
    "Achetez et vendez votre équipement d'équitation d'occasion entre cavaliers du Club Bayard, et réservez les goodies officiels du club. Paiement et remise au club.",
  alternates: { canonical: "/boutique" },
};

interface PageProps {
  searchParams: Promise<SearchParamsInput>;
}

export default async function BoutiquePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const hasQuery = Object.keys(params).length > 0;

  return (
    <>
      <Breadcrumbs items={[{ name: "Boutique", url: `${SITE_CONFIG.url}/boutique` }]} />
      <Catalogue
        searchParams={params}
        header={!hasQuery ? <Intro /> : <h1 className="sr-only">Boutique du Club Bayard</h1>}
      />
    </>
  );
}

function Intro() {
  return (
    <div className="py-6 sm:py-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Occasion entre cavaliers &amp; goodies du club
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
        Revendez votre matériel entre membres, retrouvez les tenues des équipes de compétition et
        réservez les articles officiels du Club Bayard. Aucun paiement en ligne : tout se règle au club,
        en main propre.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Tile
          href="/boutique/occasion"
          image="/offer_2.jpg"
          title="Occasion"
          subtitle="Le matériel des cavaliers du club, du casque à la selle"
        />
        <Tile
          href="/boutique/goodies"
          image="/team.jpg"
          title="Goodies du club"
          subtitle="Textile, accessoires et tenues d'équipe, à réserver puis retirer au club"
        />
      </div>
    </div>
  );
}

function Tile({ href, image, title, subtitle }: { href: string; image: string; title: string; subtitle: string }) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl bg-gray-900 text-white"
    >
      <div className="relative aspect-[16/7] w-full sm:aspect-[16/8]">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
        <div>
          <p className="text-xl font-bold sm:text-2xl">{title}</p>
          <p className="mt-1 text-xs text-white/85 sm:text-sm">{subtitle}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-900 transition-transform group-hover:translate-x-1">
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
