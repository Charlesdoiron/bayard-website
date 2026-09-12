"use client";

import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronLeft, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  AUDIENCES,
  CATEGORIES,
  COLORS,
  CONDITIONS,
  DISCIPLINES,
  TEAMS,
  UNIVERSES,
  getCategory,
  getColor,
  getCondition,
  getSubCategory,
  getTeam,
  sizeOptionsFor,
} from "@/lib/boutique/taxonomy";
import { SORT_OPTIONS, countActiveFilters, serializeFilters } from "@/lib/boutique/filters";
import type { CatalogueFilters, Space } from "@/lib/boutique/types";
import Modal from "./modal";

type FacetKey =
  | "categorie"
  | "taille"
  | "pour"
  | "equipe"
  | "etat"
  | "prix"
  | "marque"
  | "couleur"
  | "discipline";

interface FilterBarProps {
  filters: CatalogueFilters;
  /** Space fixed by the route (undefined on the "Tout" view). */
  space?: Space;
  brands: string[];
  total: number;
}

const facetLabels: Record<FacetKey, string> = {
  categorie: "Catégorie",
  taille: "Taille",
  pour: "Pour qui",
  equipe: "Équipe",
  etat: "État",
  prix: "Prix",
  marque: "Marque",
  couleur: "Couleur",
  discipline: "Discipline",
};

/** Facets shown per space. Goodies use their own sizes/stock, not the Kramer tree. */
function facetsFor(space?: Space): FacetKey[] {
  if (space === "goodies") return ["taille", "equipe", "prix"];
  return ["categorie", "taille", "pour", "equipe", "etat", "prix", "marque", "couleur", "discipline"];
}

const toggleIn = (list: string[] | undefined, value: string) => {
  const set = new Set(list ?? []);
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return [...set];
};

export default function FilterBar({ filters, space, brands, total }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [openFacet, setOpenFacet] = useState<FacetKey | "tri" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    (patch: Partial<CatalogueFilters>) => {
      const next: CatalogueFilters = { ...filters, ...patch };
      // The route already encodes the space; never duplicate it in the query.
      if (space) next.space = undefined;
      const qs = serializeFilters(next).toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [filters, pathname, router, space],
  );

  const clearAll = () => update({
    category: undefined, subCategory: undefined, team: undefined, audience: [], size: [],
    color: [], brand: [], condition: [], discipline: [], priceMin: undefined,
    priceMax: undefined, available: false, donsOnly: false,
  });

  // Close desktop popovers on outside click
  useEffect(() => {
    if (!openFacet) return;
    const onClick = (e: MouseEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpenFacet(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenFacet(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openFacet]);

  const facets = facetsFor(space);
  const activeCount = countActiveFilters(filters);
  const sortLabel = SORT_OPTIONS.find((s) => s.value === filters.sort)?.label ?? "Trier";

  const facetActive = (key: FacetKey): number => {
    switch (key) {
      case "categorie": return (filters.category ? 1 : 0) + (filters.subCategory ? 1 : 0);
      case "taille": return filters.size?.length ?? 0;
      case "pour": return filters.audience?.length ?? 0;
      case "equipe": return filters.team ? 1 : 0;
      case "etat": return filters.condition?.length ?? 0;
      case "prix": return filters.priceMin !== undefined || filters.priceMax !== undefined ? 1 : 0;
      case "marque": return filters.brand?.length ?? 0;
      case "couleur": return filters.color?.length ?? 0;
      case "discipline": return filters.discipline?.length ?? 0;
    }
  };

  const chipClass = (active: boolean) =>
    `inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-medium whitespace-nowrap ${
      active
        ? "border-bayard bg-bayard-light text-bayard"
        : "border-gray-300 bg-white text-gray-800 hover:border-gray-400"
    }`;

  const renderFacet = (key: FacetKey) => (
    <FacetContent key={key} facet={key} filters={filters} brands={brands} update={update} />
  );

  return (
    <div ref={barRef} className={`relative ${isPending ? "opacity-70" : ""}`}>
      {/* Desktop: chip row with popovers */}
      <div className="hidden items-center gap-2 md:flex md:flex-wrap">
        {facets.map((key) => {
          const n = facetActive(key);
          const open = openFacet === key;
          return (
            <div key={key} className="relative">
              <button
                type="button"
                onClick={() => setOpenFacet(open ? null : key)}
                aria-expanded={open}
                className={chipClass(n > 0 || open)}
              >
                {facetLabels[key]}
                {n > 0 ? <span className="rounded-full bg-bayard px-1.5 text-[11px] text-white">{n}</span> : null}
                <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {open ? (
                <div className="absolute left-0 top-11 z-40 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
                  {renderFacet(key)}
                </div>
              ) : null}
            </div>
          );
        })}

        {space !== "goodies" ? (
          <button
            type="button"
            onClick={() => update({ donsOnly: !filters.donsOnly })}
            aria-pressed={!!filters.donsOnly}
            className={chipClass(!!filters.donsOnly)}
          >
            Dons
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => update({ available: !filters.available })}
          aria-pressed={!!filters.available}
          className={chipClass(!!filters.available)}
        >
          Disponibles uniquement
        </button>

        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => setOpenFacet(openFacet === "tri" ? null : "tri")}
            aria-expanded={openFacet === "tri"}
            className={chipClass(filters.sort !== "recent")}
          >
            Trier : {sortLabel}
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          {openFacet === "tri" ? (
            <div className="absolute right-0 top-11 z-40 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
              <SortOptions filters={filters} update={(p) => { update(p); setOpenFacet(null); }} />
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile: filters + sort buttons */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={chipClass(activeCount > 0)}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filtres{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
        <label className="relative inline-flex h-9 items-center rounded-full border border-gray-300 bg-white pl-3 pr-8 text-sm font-medium text-gray-800">
          <span className="sr-only">Trier</span>
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as CatalogueFilters["sort"] })}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span aria-hidden="true">{sortLabel}</span>
          <ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4" aria-hidden="true" />
        </label>
        <span className="ml-auto text-sm text-gray-500">{total} article{total > 1 ? "s" : ""}</span>
      </div>

      <ActiveChips filters={filters} update={update} clearAll={clearAll} />

      <Modal open={mobileOpen} onClose={() => setMobileOpen(false)} title="Filtres" size="lg">
        <div className="divide-y divide-gray-200">
          {facets.map((key) => (
            <details key={key} className="group py-3" open={facetActive(key) > 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-gray-900">
                <span>
                  {facetLabels[key]}
                  {facetActive(key) > 0 ? (
                    <span className="ml-2 rounded-full bg-bayard px-1.5 py-0.5 text-[11px] text-white">{facetActive(key)}</span>
                  ) : null}
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="pt-3">{renderFacet(key)}</div>
            </details>
          ))}
          <div className="flex flex-col gap-3 py-3">
            {space !== "goodies" ? (
              <Toggle label="Dons uniquement" checked={!!filters.donsOnly} onChange={(v) => update({ donsOnly: v })} />
            ) : null}
            <Toggle label="Disponibles uniquement" checked={!!filters.available} onChange={(v) => update({ available: v })} />
          </div>
        </div>
        <div className="sticky bottom-0 -mx-5 flex gap-3 border-t border-gray-200 bg-white px-5 py-3">
          <button
            type="button"
            onClick={clearAll}
            className="h-11 flex-1 rounded-md border border-gray-300 text-sm font-medium text-gray-800"
          >
            Tout effacer
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="h-11 flex-1 rounded-md bg-bayard text-sm font-semibold text-white"
          >
            Voir {total} article{total > 1 ? "s" : ""}
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ------------------------------------------------------------------ pieces

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-sm text-gray-900">
      <span>{label}</span>
      <span className="relative inline-flex h-6 w-11 items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-bayard peer-focus-visible:ring-2 peer-focus-visible:ring-bayard/40" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

function CheckRow({
  label,
  help,
  checked,
  onChange,
}: {
  label: React.ReactNode;
  help?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 py-1.5 text-sm text-gray-900">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
          checked ? "border-bayard bg-bayard text-white" : "border-gray-400 bg-white"
        }`}
        aria-hidden="true"
      >
        {checked ? <Check className="h-3.5 w-3.5" /> : null}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span>
        <span>{label}</span>
        {help ? <span className="block text-xs text-gray-500">{help}</span> : null}
      </span>
    </label>
  );
}

function SortOptions({ filters, update }: { filters: CatalogueFilters; update: (p: Partial<CatalogueFilters>) => void }) {
  return (
    <ul>
      {SORT_OPTIONS.map((o) => (
        <li key={o.value}>
          <button
            type="button"
            onClick={() => update({ sort: o.value })}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 ${
              filters.sort === o.value ? "font-semibold text-bayard" : "text-gray-800"
            }`}
          >
            {o.label}
            {filters.sort === o.value ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
          </button>
        </li>
      ))}
    </ul>
  );
}

function CategoryFacet({ filters, update }: { filters: CatalogueFilters; update: (p: Partial<CatalogueFilters>) => void }) {
  const [browsing, setBrowsing] = useState<string | undefined>(filters.category);
  const category = getCategory(browsing);

  if (category) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setBrowsing(undefined)}
          className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {category.label}
        </button>
        <ul className="max-h-72 overflow-y-auto">
          <li>
            <button
              type="button"
              onClick={() => update({ category: category.slug, subCategory: undefined, size: [] })}
              className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-gray-100 ${
                filters.category === category.slug && !filters.subCategory ? "font-semibold text-bayard" : ""
              }`}
            >
              Tout {category.label.toLowerCase()}
              {filters.category === category.slug && !filters.subCategory ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
            </button>
          </li>
          {category.children.map((sub) => {
            const active = filters.subCategory === sub.slug;
            return (
              <li key={sub.slug}>
                <button
                  type="button"
                  onClick={() => update({ category: category.slug, subCategory: sub.slug, size: [] })}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-gray-100 ${active ? "font-semibold text-bayard" : ""}`}
                >
                  {sub.label}
                  {active ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      {UNIVERSES.map((u) => (
        <div key={u.slug} className="mb-2">
          <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{u.label}</p>
          <ul>
            {CATEGORIES.filter((c) => c.universe === u.slug).map((c) => {
              const active = filters.category === c.slug;
              return (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => setBrowsing(c.slug)}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-gray-100 ${active ? "font-semibold text-bayard" : "text-gray-900"}`}
                  >
                    {c.label}
                    <ChevronDown className="h-4 w-4 -rotate-90 text-gray-400" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function FacetContent({
  facet,
  filters,
  brands,
  update,
}: {
  facet: FacetKey;
  filters: CatalogueFilters;
  brands: string[];
  update: (p: Partial<CatalogueFilters>) => void;
}) {
  const [brandQuery, setBrandQuery] = useState("");
  const [priceMin, setPriceMin] = useState(filters.priceMin?.toString() ?? "");
  const [priceMax, setPriceMax] = useState(filters.priceMax?.toString() ?? "");
  const sizes = useMemo(() => sizeOptionsFor(filters.category, filters.subCategory), [filters.category, filters.subCategory]);

  switch (facet) {
    case "categorie":
      return <CategoryFacet filters={filters} update={update} />;

    case "taille":
      return (
        <div>
          {!filters.category ? (
            <p className="mb-2 text-xs text-gray-500">Choisissez une catégorie pour affiner les tailles.</p>
          ) : null}
          <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto">
            {sizes.map((s) => {
              const active = filters.size?.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => update({ size: toggleIn(filters.size, s) })}
                  aria-pressed={active}
                  className={`h-9 min-w-[3rem] rounded-md border px-2 text-sm ${
                    active ? "border-bayard bg-bayard text-white" : "border-gray-300 text-gray-800 hover:border-gray-400"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      );

    case "pour":
      return (
        <div>
          {AUDIENCES.map((a) => (
            <CheckRow
              key={a.slug}
              label={a.label}
              checked={!!filters.audience?.includes(a.slug)}
              onChange={() => update({ audience: toggleIn(filters.audience, a.slug) as CatalogueFilters["audience"] })}
            />
          ))}
        </div>
      );

    case "equipe":
      return (
        <ul>
          <li>
            <button
              type="button"
              onClick={() => update({ team: undefined })}
              className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-gray-100 ${!filters.team ? "font-semibold text-bayard" : ""}`}
            >
              Toutes les équipes
              {!filters.team ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
            </button>
          </li>
          {TEAMS.map((t) => {
            const active = filters.team === t.slug;
            return (
              <li key={t.slug}>
                <button
                  type="button"
                  onClick={() => update({ team: t.slug })}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-gray-100 ${active ? "font-semibold text-bayard" : ""}`}
                >
                  {t.label}
                  {active ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      );

    case "etat":
      return (
        <div>
          {CONDITIONS.map((c) => (
            <CheckRow
              key={c.slug}
              label={c.label}
              help={c.help}
              checked={!!filters.condition?.includes(c.slug)}
              onChange={() => update({ condition: toggleIn(filters.condition, c.slug) as CatalogueFilters["condition"] })}
            />
          ))}
        </div>
      );

    case "prix": {
      const apply = () => {
        const min = priceMin === "" ? undefined : Math.max(0, Number(priceMin));
        const max = priceMax === "" ? undefined : Math.max(0, Number(priceMax));
        update({
          priceMin: Number.isFinite(min) ? min : undefined,
          priceMax: Number.isFinite(max) ? max : undefined,
        });
      };
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply();
          }}
          className="flex items-end gap-2"
        >
          <label className="flex-1 text-xs text-gray-600">
            Min (€)
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-gray-300 px-2 text-sm text-gray-900 focus:border-bayard focus:outline-none"
            />
          </label>
          <label className="flex-1 text-xs text-gray-600">
            Max (€)
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-gray-300 px-2 text-sm text-gray-900 focus:border-bayard focus:outline-none"
            />
          </label>
          <button type="submit" className="h-10 rounded-md bg-bayard px-3 text-sm font-semibold text-white">
            OK
          </button>
        </form>
      );
    }

    case "marque": {
      const visible = brands.filter((b) => b.toLowerCase().includes(brandQuery.toLowerCase()));
      return (
        <div>
          <input
            type="search"
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            placeholder="Rechercher une marque"
            aria-label="Rechercher une marque"
            className="mb-2 h-10 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:border-bayard focus:outline-none"
          />
          <div className="max-h-56 overflow-y-auto">
            {visible.map((b) => (
              <CheckRow
                key={b}
                label={b}
                checked={!!filters.brand?.includes(b)}
                onChange={() => update({ brand: toggleIn(filters.brand, b) })}
              />
            ))}
            {visible.length === 0 ? <p className="py-2 text-sm text-gray-500">Aucune marque.</p> : null}
          </div>
        </div>
      );
    }

    case "couleur":
      return (
        <div className="grid grid-cols-2 gap-1">
          {COLORS.map((c) => {
            const active = filters.color?.includes(c.slug);
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => update({ color: toggleIn(filters.color, c.slug) })}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-gray-100 ${active ? "font-semibold text-bayard" : "text-gray-900"}`}
              >
                <span
                  className="h-5 w-5 shrink-0 rounded-full ring-1 ring-black/10"
                  style={
                    c.hex === "linear"
                      ? { background: "conic-gradient(#e8a5c0, #e8c547, #2f6b3a, #005896, #e8a5c0)" }
                      : { backgroundColor: c.hex }
                  }
                  aria-hidden="true"
                />
                {c.label}
                {active ? <Check className="ml-auto h-4 w-4" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      );

    case "discipline":
      return (
        <div>
          {DISCIPLINES.map((d) => (
            <CheckRow
              key={d.slug}
              label={d.label}
              checked={!!filters.discipline?.includes(d.slug)}
              onChange={() => update({ discipline: toggleIn(filters.discipline, d.slug) as CatalogueFilters["discipline"] })}
            />
          ))}
        </div>
      );
  }
}

function ActiveChips({
  filters,
  update,
  clearAll,
}: {
  filters: CatalogueFilters;
  update: (p: Partial<CatalogueFilters>) => void;
  clearAll: () => void;
}) {
  const chips: { key: string; label: string; remove: () => void }[] = [];

  const category = getCategory(filters.category);
  const sub = getSubCategory(filters.subCategory);
  if (sub) chips.push({ key: "sub", label: sub.sub.label, remove: () => update({ subCategory: undefined, size: [] }) });
  else if (category) chips.push({ key: "cat", label: category.label, remove: () => update({ category: undefined, size: [] }) });
  const team = getTeam(filters.team);
  if (team) chips.push({ key: "team", label: team.label, remove: () => update({ team: undefined }) });
  filters.audience?.forEach((a) =>
    chips.push({ key: `a-${a}`, label: AUDIENCES.find((x) => x.slug === a)?.label ?? a, remove: () => update({ audience: toggleIn(filters.audience, a) as CatalogueFilters["audience"] }) }),
  );
  filters.size?.forEach((s) => chips.push({ key: `s-${s}`, label: `Taille ${s}`, remove: () => update({ size: toggleIn(filters.size, s) }) }));
  filters.color?.forEach((c) => chips.push({ key: `c-${c}`, label: getColor(c)?.label ?? c, remove: () => update({ color: toggleIn(filters.color, c) }) }));
  filters.brand?.forEach((b) => chips.push({ key: `b-${b}`, label: b, remove: () => update({ brand: toggleIn(filters.brand, b) }) }));
  filters.condition?.forEach((c) => chips.push({ key: `e-${c}`, label: getCondition(c).label, remove: () => update({ condition: toggleIn(filters.condition, c) as CatalogueFilters["condition"] }) }));
  filters.discipline?.forEach((d) =>
    chips.push({ key: `d-${d}`, label: DISCIPLINES.find((x) => x.slug === d)?.label ?? d, remove: () => update({ discipline: toggleIn(filters.discipline, d) as CatalogueFilters["discipline"] }) }),
  );
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    const label =
      filters.priceMin !== undefined && filters.priceMax !== undefined
        ? `${filters.priceMin} – ${filters.priceMax} €`
        : filters.priceMin !== undefined
          ? `À partir de ${filters.priceMin} €`
          : `Jusqu'à ${filters.priceMax} €`;
    chips.push({ key: "price", label, remove: () => update({ priceMin: undefined, priceMax: undefined }) });
  }
  if (filters.available) chips.push({ key: "avail", label: "Disponibles", remove: () => update({ available: false }) });
  if (filters.donsOnly) chips.push({ key: "dons", label: "Dons", remove: () => update({ donsOnly: false }) });

  if (chips.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          className="inline-flex h-8 items-center gap-1 rounded-full bg-gray-100 pl-3 pr-2 text-xs font-medium text-gray-800 hover:bg-gray-200"
        >
          {chip.label}
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">Retirer ce filtre</span>
        </button>
      ))}
      <button type="button" onClick={clearAll} className="h-8 px-2 text-xs font-medium text-bayard underline-offset-2 hover:underline">
        Tout effacer
      </button>
    </div>
  );
}
