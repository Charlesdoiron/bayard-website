import Link from "next/link";
import { Suspense } from "react";
import { parseFilters, type SearchParamsInput } from "@/lib/boutique/filters";
import { getActiveBrands, searchCatalogue } from "@/lib/boutique/repository";
import type { Space } from "@/lib/boutique/types";
import FilterBar from "./filter-bar";
import { ItemGrid } from "./item-card";

interface CatalogueProps {
  searchParams: SearchParamsInput;
  /** Space fixed by the route. Undefined on the "Tout" view. */
  space?: Space;
  /** Rendered above the grid (heading, intro). */
  header?: React.ReactNode;
}

/**
 * Server component: parses the URL, queries the repository and renders the
 * filter bar plus the result grid. The route decides the space; everything
 * else lives in the query string so a search can be shared.
 */
export default async function Catalogue({ searchParams, space, header }: CatalogueProps) {
  const filters = parseFilters(searchParams, space ? { space } : {});
  const [result, brands] = await Promise.all([searchCatalogue(filters), getActiveBrands()]);

  return (
    <section aria-label="Catalogue">
      {header}
      {/* Mobile: the filter row sticks just under the fixed site header (92px). */}
      <div className="sticky top-[calc(92px+env(safe-area-inset-top))] z-30 -mx-4 bg-white/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:backdrop-blur-none">
        <Suspense fallback={<div className="h-9" />}>
          <FilterBar filters={filters} space={space} brands={brands} total={result.total} />
        </Suspense>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        {/* Kept in the DOM on every viewport so the count is announced on phones too. */}
        <p className="sr-only text-sm text-gray-600 md:not-sr-only md:block" aria-live="polite">
          {filters.q ? (
            <>
              <span className="font-semibold tabular-nums text-gray-900">{result.total}</span> résultat{result.total > 1 ? "s" : ""} pour «&nbsp;{filters.q}&nbsp;»
            </>
          ) : (
            <>
              <span className="font-semibold tabular-nums text-gray-900">{result.total}</span> article{result.total > 1 ? "s" : ""}
            </>
          )}
        </p>
      </div>

      {result.items.length > 0 ? (
        <div className="mt-4">
          <ItemGrid items={result.items} />
        </div>
      ) : (
        <EmptyState space={space} query={filters.q} />
      )}
    </section>
  );
}

function EmptyState({ space, query }: { space?: Space; query?: string }) {
  const base = space === "goodies" ? "/boutique/goodies" : space === "occasion" ? "/boutique/occasion" : "/boutique";
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
      <p className="text-lg font-semibold text-balance text-gray-900">
        {query ? `Aucun article pour « ${query} »` : "Aucun article ne correspond à ces filtres"}
      </p>
      <p className="mt-2 text-sm text-pretty text-gray-600">
        Essayez d&apos;élargir la recherche ou de retirer un filtre.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={base} className="press inline-flex h-11 items-center rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-800 hover:bg-gray-50">
          Réinitialiser les filtres
        </Link>
        {space !== "goodies" ? (
          <Link href="/boutique/vendre" className="press inline-flex h-11 items-center rounded-md bg-bayard px-4 text-sm font-semibold text-white hover:bg-bayard-dark">
            Vendre un article
          </Link>
        ) : null}
      </div>
    </div>
  );
}
