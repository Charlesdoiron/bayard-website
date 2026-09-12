import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/app/components/breadcrumbs/breadcrumbs";
import { SITE_CONFIG } from "@/lib/constants";
import { TEAMS, getTeam } from "@/lib/boutique/taxonomy";
import { getTeamItems } from "@/lib/boutique/repository";
import { isListing, isProduct } from "@/lib/boutique/filters";
import { ItemGrid } from "../../components/item-card";

interface PageProps {
  params: Promise<{ team: string }>;
}

export function generateStaticParams() {
  return TEAMS.map((t) => ({ team: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { team: slug } = await params;
  const team = getTeam(slug);
  if (!team) return { title: "Équipe introuvable" };
  return {
    title: team.label,
    description: `Tenues et équipement de l'${team.label.toLowerCase()} du Club Bayard : goodies officiels et articles d'occasion revendus entre cavaliers.`,
    alternates: { canonical: `/boutique/equipe/${team.slug}` },
  };
}

export default async function TeamPage({ params }: PageProps) {
  const { team: slug } = await params;
  const team = getTeam(slug);
  if (!team) notFound();

  const items = await getTeamItems(team.slug);
  const products = items.filter(isProduct);
  const listings = items.filter(isListing);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Boutique", url: `${SITE_CONFIG.url}/boutique` },
          { name: team.label, url: `${SITE_CONFIG.url}/boutique/equipe/${team.slug}` },
        ]}
      />

      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gray-900 text-white">
        <div className="relative aspect-[16/6] w-full sm:aspect-[16/5]">
          <Image src={team.image} alt="" fill priority sizes="100vw" className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Équipe de compétition</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{team.label}</h1>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">{team.description}</p>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-600">
        Tout ce qui concerne l&apos;{team.label.toLowerCase()} au même endroit : les tenues officielles à
        réserver, et le matériel que les cavaliers de l&apos;équipe revendent. Partagez cette page aux nouveaux
        arrivants.
      </p>

      <nav aria-label="Autres équipes" className="mt-4 flex flex-wrap gap-2">
        {TEAMS.filter((t) => t.slug !== team.slug).map((t) => (
          <Link
            key={t.slug}
            href={`/boutique/equipe/${t.slug}`}
            className="inline-flex h-9 items-center rounded-full border border-gray-300 px-3 text-sm font-medium text-gray-800 hover:border-gray-400"
          >
            {t.shortLabel}
          </Link>
        ))}
      </nav>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Tenues officielles</h2>
          <Link href={`/boutique/goodies?equipe=${team.slug}`} className="text-sm font-medium text-bayard hover:underline">
            Voir dans les goodies
          </Link>
        </div>
        {products.length ? (
          <div className="mt-4">
            <ItemGrid items={products} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">Aucune tenue officielle pour cette équipe pour le moment.</p>
        )}
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Revendu par les cavaliers</h2>
          <Link href={`/boutique/occasion?equipe=${team.slug}`} className="text-sm font-medium text-bayard hover:underline">
            Voir dans l&apos;occasion
          </Link>
        </div>
        {listings.length ? (
          <div className="mt-4">
            <ItemGrid items={listings} />
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
            Aucune annonce pour l&apos;instant. Vous quittez l&apos;équipe ?{" "}
            <Link href="/boutique/vendre" className="font-medium text-bayard hover:underline">
              Revendez votre tenue
            </Link>
            .
          </div>
        )}
      </section>
    </>
  );
}
