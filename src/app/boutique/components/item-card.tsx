import Image from "next/image";
import Link from "next/link";
import type { CatalogueItem, Listing, Product } from "@/lib/boutique/types";
import { getCondition } from "@/lib/boutique/taxonomy";
import { formatPrice } from "@/lib/boutique/format";
import { productInStock } from "@/lib/boutique/filters";
import FavoriteButton from "./favorite-button";
import { DonBadge, OfficialBadge, StatusBadge, TeamBadge } from "./badges";

export const listingHref = (l: Listing) => `/boutique/annonce/${l.slug}`;
export const productHref = (p: Product) => `/boutique/goodies/${p.slug}`;
export const itemHref = (item: CatalogueItem) =>
  item.kind === "listing" ? listingHref(item) : productHref(item);

const IMAGE_SIZES = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw";

function CardShell({
  href,
  image,
  alt,
  itemId,
  overlayTopLeft,
  dimmed,
  children,
}: {
  href: string;
  image: string;
  alt: string;
  itemId: string;
  overlayTopLeft?: React.ReactNode;
  dimmed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <article className="group relative flex flex-col">
      <Link href={href} className="block min-h-0 min-w-0" prefetch={false}>
        <div className="img-outline relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={image}
            alt={alt}
            fill
            sizes={IMAGE_SIZES}
            className={`object-cover transition-transform duration-300 ease-[var(--ease-standard)] group-hover:scale-[1.03] ${dimmed ? "opacity-60" : ""}`}
          />
          {overlayTopLeft ? (
            <div className="absolute start-2 top-2 flex flex-col items-start gap-1">{overlayTopLeft}</div>
          ) : null}
        </div>
        <div className="pt-2">{children}</div>
      </Link>
      <div className="absolute end-2 top-2">
        <FavoriteButton itemId={itemId} />
      </div>
    </article>
  );
}

export function ListingCard({ listing }: { listing: Listing }) {
  const condition = getCondition(listing.condition).label;
  const meta = [listing.brand, listing.size, condition].filter(Boolean).join(" · ");
  const unavailable = listing.status !== "publiee";
  return (
    <CardShell
      href={listingHref(listing)}
      image={listing.images[0]}
      alt={listing.title}
      itemId={listing.id}
      dimmed={unavailable}
      overlayTopLeft={
        <>
          {listing.team ? <TeamBadge team={listing.team} /> : null}
          <StatusBadge status={listing.status} />
          {listing.price === 0 && !unavailable ? <DonBadge /> : null}
        </>
      }
    >
      <p className="truncate text-xs text-gray-500">{listing.seller.displayName}</p>
      <h3 className="mt-0.5 truncate text-sm font-medium text-gray-900">{listing.title}</h3>
      {meta ? <p className="truncate text-xs text-gray-500">{meta}</p> : null}
      <p className="mt-1 text-sm font-semibold tabular-nums text-gray-900">{formatPrice(listing.price)}</p>
    </CardShell>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const inStock = productInStock(product);
  const sizes = product.variants.filter((v) => v.stock > 0 || v.onOrder).map((v) => v.label);
  const sizeLabel =
    sizes.length === 0
      ? "Rupture de stock"
      : sizes.length === 1 && sizes[0] === "Taille unique"
        ? "Taille unique"
        : `Tailles ${sizes.slice(0, 4).join(", ")}${sizes.length > 4 ? "…" : ""}`;
  return (
    <CardShell
      href={productHref(product)}
      image={product.images[0]}
      alt={product.name}
      itemId={product.id}
      dimmed={!inStock}
      overlayTopLeft={
        <>
          <OfficialBadge />
          {product.team ? <TeamBadge team={product.team} /> : null}
        </>
      }
    >
      <p className="truncate text-xs text-gray-500">Club Bayard</p>
      <h3 className="mt-0.5 truncate text-sm font-medium text-gray-900">{product.name}</h3>
      <p className="truncate text-xs text-gray-500">{sizeLabel}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-gray-900">{formatPrice(product.price)}</p>
    </CardShell>
  );
}

export function ItemCard({ item }: { item: CatalogueItem }) {
  return item.kind === "listing" ? <ListingCard listing={item} /> : <ProductCard product={item} />;
}

export function ItemGrid({ items }: { items: CatalogueItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
