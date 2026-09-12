import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin } from "lucide-react";
import Breadcrumbs from "@/app/components/breadcrumbs/breadcrumbs";
import { SITE_CONFIG } from "@/lib/constants";
import { getAllProductSlugs, getOtherProducts, getProductBySlug } from "@/lib/boutique/repository";
import { getGoodiesCategoryLabel, getTeam } from "@/lib/boutique/taxonomy";
import { formatPrice } from "@/lib/boutique/format";
import { productInStock } from "@/lib/boutique/filters";
import Gallery from "../../components/gallery";
import ReserveForm from "../../components/reserve-form";
import FavoriteButton from "../../components/favorite-button";
import { OfficialBadge, TeamBadge, TeamOnlyBadge } from "../../components/badges";
import { ProductCard } from "../../components/item-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Article introuvable" };
  return {
    title: `${product.name} · ${formatPrice(product.price)}`,
    description: `${product.description.slice(0, 150)} Réservation en ligne, paiement et retrait au Club Bayard.`,
    alternates: { canonical: `/boutique/goodies/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: product.images[0] }],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const team = product.team ? getTeam(product.team) : undefined;
  const others = await getOtherProducts(product);
  const inStock = productInStock(product);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => `${SITE_CONFIG.url}${i}`),
    brand: { "@type": "Brand", name: SITE_CONFIG.business.name },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_CONFIG.url}/boutique/goodies/${product.slug}`,
      seller: { "@id": `${SITE_CONFIG.url}/#organization` },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Breadcrumbs
        items={[
          { name: "Boutique", url: `${SITE_CONFIG.url}/boutique` },
          { name: "Goodies du club", url: `${SITE_CONFIG.url}/boutique/goodies` },
          { name: product.name, url: `${SITE_CONFIG.url}/boutique/goodies/${product.slug}` },
        ]}
      />

      <nav aria-label="Fil d'Ariane" className="py-4 text-xs text-gray-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/boutique/goodies" className="hover:text-gray-900">Goodies du club</Link></li>
          <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
          <li>{getGoodiesCategoryLabel(product.category)}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
        <div>
          <Gallery
            images={product.images}
            alt={product.name}
            overlay={
              <>
                <OfficialBadge />
                {team ? <TeamBadge team={team.slug} /> : null}
              </>
            }
          />
          <section className="mt-8 hidden lg:block">
            <h2 className="text-base font-semibold text-gray-900">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">{product.description}</p>
            {product.sizeNote ? <p className="mt-3 text-sm text-gray-500">{product.sizeNote}</p> : null}
          </section>
        </div>

        <div>
          <div className="lg:sticky lg:top-24">
            <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{formatPrice(product.price)}</p>
            <h1 className="mt-1 text-lg font-medium text-gray-900 sm:text-xl">{product.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{getGoodiesCategoryLabel(product.category)} · Club Bayard</p>
            {team && product.teamOnly ? <TeamOnlyBadge team={team.slug} className="mt-2" /> : null}

            <div className="mt-5">
              <ReserveForm product={product} />
            </div>
            <div className="mt-2">
              <FavoriteButton itemId={product.id} variant="inline" className="w-full" />
            </div>

            <section className="mt-6 lg:hidden">
              <h2 className="text-base font-semibold text-gray-900">Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">{product.description}</p>
              {product.sizeNote ? <p className="mt-3 text-sm text-gray-500">{product.sizeNote}</p> : null}
            </section>

            <div className="mt-6 flex gap-3 rounded-xl bg-gray-50 p-4 text-xs text-gray-600">
              <MapPin className="h-5 w-5 shrink-0 text-bayard" aria-hidden="true" />
              <div>
                <p className="font-semibold text-gray-900">Retrait au club, sans paiement en ligne</p>
                <p className="mt-1">
                  Réservez, puis payez et récupérez votre article au club house ou au secrétariat,
                  {" "}{SITE_CONFIG.business.address.street}, {SITE_CONFIG.business.address.city}. Vous recevez un
                  email dès qu&apos;il est prêt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {others.length ? (
        <section className="mt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Autres goodies du club</h2>
            <Link href="/boutique/goodies" className="text-sm font-medium text-bayard hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4">
            {others.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
