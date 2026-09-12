import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, templates } from "@/lib/boutique/email";
import { reservationLines } from "@/lib/boutique/reservations-server";

export const dynamic = "force-dynamic";

const EXPIRY_WARNING_DAYS = 5;

/**
 * Scheduled maintenance, to call once a day (see cron.json for Scalingo):
 *   curl -H "Authorization: Bearer $BOUTIQUE_CRON_SECRET" https://<site>/api/boutique/cron
 *
 * 1. Expires stale listings and reservations (stock is restocked in SQL).
 * 2. Emails members whose reservation expired.
 * 3. Warns sellers whose listing expires within EXPIRY_WARNING_DAYS.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.BOUTIQUE_CRON_SECRET;
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? request.nextUrl.searchParams.get("secret");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "supabase not configured" }, { status: 503 });

  const summary = { expiredListings: 0, expiredReservations: 0, warnedListings: 0, emailsFailed: 0 };

  // 1 + 2. Expirations
  const { data: expired, error } = await admin.rpc("expire_stale");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  for (const row of expired ?? []) {
    if (row.kind === "listing") {
      summary.expiredListings++;
      continue;
    }
    summary.expiredReservations++;
    const { data: reservation } = await admin.from("reservations").select("profile_id").eq("id", row.id).maybeSingle();
    if (!reservation) continue;
    const { data: member } = await admin.from("profiles").select("email, first_name").eq("id", reservation.profile_id).maybeSingle();
    if (!member) continue;
    const lines = await reservationLines(admin, row.id);
    const ok = await sendEmail({ to: { email: member.email, name: member.first_name }, ...templates.reservationExpired(lines) });
    if (!ok) summary.emailsFailed++;
  }

  // 3. Expiry warnings
  const limit = new Date(Date.now() + EXPIRY_WARNING_DAYS * 86_400_000).toISOString();
  const { data: expiring } = await admin
    .from("listings")
    .select("id, slug, title, seller_id, expires_at")
    .eq("status", "publiee")
    .is("expiry_notified_at", null)
    .lte("expires_at", limit)
    .limit(200);
  for (const l of expiring ?? []) {
    const { data: seller } = await admin.from("profiles").select("email, first_name").eq("id", l.seller_id).maybeSingle();
    const days = Math.max(1, Math.ceil((new Date(l.expires_at!).getTime() - Date.now()) / 86_400_000));
    const ok = seller
      ? await sendEmail({ to: { email: seller.email, name: seller.first_name }, ...templates.listingExpiringSoon({ slug: l.slug, title: l.title }, days) })
      : false;
    if (!ok) summary.emailsFailed++;
    await admin.from("listings").update({ expiry_notified_at: new Date().toISOString() }).eq("id", l.id);
    summary.warnedListings++;
  }

  if (summary.expiredListings || summary.expiredReservations) {
    revalidatePath("/boutique");
    revalidatePath("/boutique/occasion");
    revalidatePath("/boutique/goodies");
  }
  return NextResponse.json({ ok: true, ...summary });
}
