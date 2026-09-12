import { NextResponse, type NextRequest } from "next/server";
import { createClient, getCurrentProfile } from "@/lib/supabase/server";
import type { ReservationStatus } from "@/lib/supabase/database.types";
import { RESERVATION_STATUS_LABELS } from "@/lib/boutique/labels";
import { centsToEuros } from "@/lib/boutique/mappers";

const csvCell = (v: string | number | null | undefined) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** CSV export of reservations (one line per reserved item), for the secretariat. */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  if (!supabase || !profile || profile.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const statut = request.nextUrl.searchParams.get("statut") as ReservationStatus | null;

  let query = supabase.from("reservations").select("*").order("created_at", { ascending: false }).limit(2000);
  if (statut && statut in RESERVATION_STATUS_LABELS) query = query.eq("status", statut);
  const { data: reservations } = await query;
  const ids = (reservations ?? []).map((r) => r.id);
  const memberIds = [...new Set((reservations ?? []).map((r) => r.profile_id))];
  const [{ data: items }, { data: members }] = await Promise.all([
    ids.length ? supabase.from("reservation_items").select("*").in("reservation_id", ids) : Promise.resolve({ data: [] }),
    memberIds.length ? supabase.from("profiles").select("id, first_name, last_name, email, phone").in("id", memberIds) : Promise.resolve({ data: [] }),
  ]);
  const productIds = [...new Set((items ?? []).map((i) => i.product_id))];
  const variantIds = [...new Set((items ?? []).map((i) => i.variant_id))];
  const [{ data: products }, { data: variants }] = await Promise.all([
    productIds.length ? supabase.from("products").select("id, name").in("id", productIds) : Promise.resolve({ data: [] }),
    variantIds.length ? supabase.from("product_variants").select("id, label").in("id", variantIds) : Promise.resolve({ data: [] }),
  ]);
  const memberById = new Map((members ?? []).map((m) => [m.id, m]));
  const productById = new Map((products ?? []).map((p) => [p.id, p.name]));
  const variantById = new Map((variants ?? []).map((v) => [v.id, v.label]));

  const header = ["Réservation", "Date", "Statut", "Membre", "Email", "Téléphone", "Article", "Déclinaison", "Quantité", "Prix unitaire", "Total ligne", "Sur commande", "Note membre", "Note club"];
  const rows: string[] = [header.join(";")];
  for (const r of reservations ?? []) {
    const m = memberById.get(r.profile_id);
    for (const i of (items ?? []).filter((x) => x.reservation_id === r.id)) {
      rows.push(
        [
          r.id.slice(0, 8),
          new Date(r.created_at).toLocaleDateString("fr-FR"),
          RESERVATION_STATUS_LABELS[r.status].label,
          m ? `${m.first_name} ${m.last_name}`.trim() : "",
          m?.email,
          m?.phone,
          productById.get(i.product_id),
          variantById.get(i.variant_id),
          i.quantity,
          centsToEuros(i.unit_price_cents).toFixed(2).replace(".", ","),
          centsToEuros(i.unit_price_cents * i.quantity).toFixed(2).replace(".", ","),
          i.stocked ? "non" : "oui",
          r.note,
          r.admin_note,
        ]
          .map(csvCell)
          .join(";"),
      );
    }
  }

  const body = "﻿" + rows.join("\r\n");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="reservations-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
