import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getGoodiesCategoryLabel, getTeam } from "@/lib/boutique/taxonomy";
import { centsToEuros } from "@/lib/boutique/mappers";
import { formatPrice } from "@/lib/boutique/format";
import StatusPill from "../../components/status-pill";
import ProductRowActions from "./product-row-actions";

export default async function AdminGoodiesPage() {
  const supabase = await createClient();
  if (!supabase) return null; // demo mode: the admin layout already explains
  const [{ data: products }, { data: variants }] = await Promise.all([
    supabase.from("products").select("*").order("sort_order").order("created_at", { ascending: false }),
    supabase.from("product_variants").select("product_id, label, stock, on_order"),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-gray-900">Goodies du club</h1>
        <Link href="/boutique/admin/goodies/nouveau" className="press inline-flex h-10 items-center gap-2 rounded-md bg-bayard px-4 text-sm font-semibold text-white hover:bg-bayard-dark">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouveau produit
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-gray-100 rounded-xl border border-gray-200">
        {(products ?? []).map((p) => {
          const vs = (variants ?? []).filter((v) => v.product_id === p.id);
          const stock = vs.reduce((s, v) => s + v.stock, 0);
          const onOrder = vs.some((v) => v.on_order);
          return (
            <li key={p.id} className="flex gap-4 p-4">
              <div className="img-outline relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                {p.images[0] ? <Image src={p.images[0]} alt="" fill sizes="56px" className="object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill label={p.published ? "Publié" : "Masqué"} tone={p.published ? "green" : "gray"} />
                  {p.team ? <StatusPill label={getTeam(p.team)?.label ?? p.team} tone="blue" /> : null}
                  {p.team_only ? <span className="text-xs text-gray-500">réservé à l&apos;équipe</span> : null}
                </div>
                <p className="mt-1 truncate text-sm font-medium text-gray-900">
                  <Link href={`/boutique/admin/goodies/${p.id}`} className="hover:underline">{p.name}</Link>
                  <span className="ms-2 font-normal tabular-nums text-gray-500">{formatPrice(centsToEuros(p.price_cents))}</span>
                </p>
                <p className="text-xs tabular-nums text-gray-500">
                  {getGoodiesCategoryLabel(p.category)} · {vs.length} déclinaison{vs.length > 1 ? "s" : ""} · stock total {stock}
                  {onOrder ? " · sur commande" : ""}
                </p>
                <p className="mt-1 flex flex-wrap gap-1 text-xs">
                  {vs.map((v) => (
                    <span key={v.label} className={`rounded px-1.5 py-0.5 ${v.stock > 0 || v.on_order ? "bg-gray-100 text-gray-700" : "bg-red-50 text-red-700"}`}>
                      {v.label} : {v.on_order ? "cmd" : v.stock}
                    </span>
                  ))}
                </p>
                <div className="mt-2">
                  <ProductRowActions id={p.id} published={p.published} slug={p.slug} />
                </div>
              </div>
            </li>
          );
        })}
        {!products?.length ? <li className="p-8 text-center text-sm text-gray-500">Aucun produit. Créez le premier !</li> : null}
      </ul>
    </div>
  );
}
