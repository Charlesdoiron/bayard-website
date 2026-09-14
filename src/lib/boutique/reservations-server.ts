import "server-only";
import type { ServerClient } from "@/lib/supabase/server";
import type { ReservationLine } from "./email";
import { centsToEuros } from "./mappers";

/** Lines of a reservation for emails and the account page. */
export async function reservationLines(supabase: ServerClient, reservationId: string): Promise<ReservationLine[]> {
  const { data: items } = await supabase
    .from("reservation_items")
    .select("quantity, unit_price_cents, product_id, variant_id")
    .eq("reservation_id", reservationId);
  if (!items?.length) return [];
  const [{ data: products }, { data: variants }] = await Promise.all([
    supabase.from("products").select("id, name").in("id", items.map((i) => i.product_id)),
    supabase.from("product_variants").select("id, label").in("id", items.map((i) => i.variant_id)),
  ]);
  const pName = new Map((products ?? []).map((p) => [p.id, p.name]));
  const vLabel = new Map((variants ?? []).map((v) => [v.id, v.label]));
  return items.map((i) => ({
    name: pName.get(i.product_id) ?? "Article",
    variant: vLabel.get(i.variant_id) ?? "",
    quantity: i.quantity,
    unitPrice: centsToEuros(i.unit_price_cents),
  }));
}

