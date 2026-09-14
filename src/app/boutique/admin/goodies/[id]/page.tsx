import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { productFromRow } from "@/lib/boutique/mappers";
import ProductForm from "../product-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ModifierProduitPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) return null; // demo mode: the admin layout already explains
  const [{ data: product }, { data: variants }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("product_variants").select("*").eq("product_id", id),
  ]);
  if (!product) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-balance text-gray-900">Modifier « {product.name} »</h1>
      <div className="mt-6">
        <ProductForm product={productFromRow(product, variants ?? [])} />
      </div>
    </div>
  );
}
