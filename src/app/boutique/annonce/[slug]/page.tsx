import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldAlert } from "lucide-react";
import Breadcrumbs from "@/app/components/breadcrumbs/breadcrumbs";
import { SITE_CONFIG } from "@/lib/constants";
import {
  getAllListingSlugs,
  getListingBySlug,
  getSimilarListings,
} from "@/lib/boutique/repository";
import {
  getAudienceLabel,
  getCategory,
  getColor,
  getCondition,
  getDisciplineLabel,
  getSubCategory,
  getTeam,
} from "@/lib/boutique/taxonomy";
import { formatDate, formatPrice, formatRelative } from "@/lib/boutique/format";
import Gallery from "../../components/gallery";
import ContactSeller from "../../components/contact-seller";
import FavoriteButton from "../../components/favorite-button";
import SellerCard from "../../components/seller-card";
import { DonBadge, StatusBadge, TeamBadge } from "../../components/badges";
import { ListingCard } from "../../components/item-card";

// Refresh statically generated pages regularly so status and stock changes show up.
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllListingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Annonce introuvable" };
  const condition = getCondition(listing.condition).label;
  return {
    title: `${listing.title} · ${formatPrice(listing.price)}`,
    description: `${listing.title}, ${condition}${listing.size ? `, taille ${listing.size}` : ""}. Vendu d'occasion par un cavalier du Club Bayard, remise au club.`,
    alternates: { canonical: `/boutique/annonce/${listing.slug}` },
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: [{ url: listing.images[0] }],
      type: "website",
    },
  };
}

const SAFETY_SUBCATEGORIES = new Set(["casques", "gilets-protection", "protections-dorsales"]);

export default async function ListingPage({ params }: PageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const category = getCategory(listing.categorySlug);
  const sub = getSubCategory(listing.subCategorySlug)?.sub;
  const condition = getCondition(listing.condition);
  const team = listing.team ? getTeam(listing.team) : undefined;
  const color = getColor(listing.color);
  const similar = await getSimilarListings(listing);
  const unavailable = listing.status !== "publiee";
  const isSafetyGear = SAFETY_SUBCATEGORIES.has(listing.subCategorySlug);

  type Detail = { label: string; value: string };
  const details: Detail[] = (
    [
      { label: "État", value: condition.label },
      listing.brand ? { label: "Marque", value: listing.brand } : null,
      listing.size ? { label: "Taille", value: listing.size } : null,
      color ? { label: "Couleur", value: color.label } : null,
      { label: "Pour", value: getAudienceLabel(listing.audience) },
      listing.discipline ? { label: "Discipline", value: getDisciplineLabel(listing.discipline) } : null,
      team ? { label: "Équipe", value: team.label } : null,
      { label: "Publiée le", value: formatDate(listing.publishedAt) },
    ] as (Detail | null)[]
  ).filter((d): d is Detail => d !== null);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: listing.images.map((i) => `${SITE_CONFIG.url}${i}`),
    brand: listing.brand ? { "@type": "Brand", name: listing.brand } : undefined,
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "EUR",
      itemCondition: listing.condition === "neuf-etiquette" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      availability: unavailable ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: `${SITE_CONFIG.url}/boutique/annonce/${listing.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Breadcrumbs
        items={[
          { name: "Boutique", url: `${SITE_CONFIG.url}/boutique` },
          { name: "Occasion", url: `${SITE_CONFIG.url}/boutique/occasion` },
          { name: listing.title, url: `${SITE_CONFIG.url}/boutique/annonce/${listing.slug}` },
        ]}
      />

      <nav aria-label="Fil d'Ariane" className="py-4 text-xs text-gray-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/boutique/occasion" className="hover:text-gray-900">Occasion</Link></li>
          {category ? (
            <>
              <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
              <li>
                <Link href={`/boutique/occasion?categorie=${category.slug}`} className="hover:text-gray-900">
                  {category.label}
                </Link>
              </li>
            </>
          ) : null}
          {sub ? (
            <>
              <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
              <li>
                <Link href={`/boutique/occasion?categorie=${listing.categorySlug}&sous_categorie=${sub.slug}`} className="hover:text-gray-900">
                  {sub.label}
                </Link>
              </li>
            </>
          ) : null}
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
        <div>
          <Gallery
            images={listing.images}
            alt={listing.title}
            overlay={
              <>
                {team ? <TeamBadge team={team.slug} /> : null}
                <StatusBadge status={listing.status} />
                {listing.price === 0 && !unavailable ? <DonBadge /> : null}
              </>
            }
          />

          <section className="mt-8 hidden lg:block">
            <h2 className="text-base font-semibold text-balance text-gray-900">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-pretty text-gray-700">{listing.description}</p>
          </section>
        </div>

        <div>
          <div className="lg:sticky lg:top-24">
            <p className="text-2xl font-bold tabular-nums text-gray-900 sm:text-3xl">{formatPrice(listing.price)}</p>
            <h1 className="mt-1 text-lg font-medium text-balance text-gray-900 sm:text-xl">{listing.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {[listing.size ? `Taille ${listing.size}` : null, condition.label, listing.brand].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-1 text-xs text-gray-400">Publiée {formatRelative(listing.publishedAt)}</p>

            {unavailable ? (
              <p className="mt-4 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700">
                {listing.status === "reservee"
                  ? "Cet article est réservé. Le vendeur peut le remettre en vente si la transaction n'aboutit pas."
                  : "Cet article a été vendu."}
              </p>
            ) : null}

            <div className="mt-5 space-y-2">
              <ContactSeller listingId={listing.id} listingTitle={listing.title} sellerName={listing.seller.displayName} disabled={unavailable} />
              <FavoriteButton itemId={listing.id} variant="inline" className="w-full" />
            </div>

            <div className="mt-6">
              <SellerCard seller={listing.seller} />
            </div>

            <dl className="mt-6 divide-y divide-gray-100 border-y border-gray-100 text-sm">
              {details.map((d) => (
                <div key={d.label} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-gray-500">{d.label}</dt>
                  <dd className="text-end font-medium tabular-nums text-gray-900">{d.value}</dd>
                </div>
              ))}
            </dl>

            {isSafetyGear ? (
              <div className="mt-4 flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <ShieldAlert className="h-5 w-5 shrink-0" aria-hidden="true" />
                <p>
                  Équipement de sécurité d&apos;occasion : un casque ou un gilet ayant subi un choc peut être
                  inefficace même sans dommage visible. Le vendeur déclare l&apos;absence de chute ; vérifiez
                  l&apos;article avant achat.
                </p>
              </div>
            ) : null}

            <section className="mt-6 lg:hidden">
              <h2 className="text-base font-semibold text-balance text-gray-900">Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-pretty text-gray-700">{listing.description}</p>
            </section>

            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-xs text-gray-600">
              <p className="font-semibold text-gray-900">Comment ça marche ?</p>
              <ol className="mt-2 list-decimal space-y-1 ps-4">
                <li>Vous contactez le vendeur, il vous répond par email.</li>
                <li>Vous convenez d&apos;un rendez-vous au club.</li>
                <li>Paiement et remise en main propre. Le site ne prend aucune commission.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {similar.length ? (
        <section className="mt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold text-balance text-gray-900">Articles similaires</h2>
            <Link href={`/boutique/occasion?categorie=${listing.categorySlug}`} className="text-sm font-medium text-bayard hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
            {similar.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
