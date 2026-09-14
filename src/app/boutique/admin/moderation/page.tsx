import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getAudienceLabel, getCondition, getSubCategory, getTeam } from "@/lib/boutique/taxonomy";
import { centsToEuros } from "@/lib/boutique/mappers";
import { formatDate, formatPrice } from "@/lib/boutique/format";
import ModerationForm from "./moderation-form";

export default async function ModerationPage() {
  const supabase = await createClient();
  if (!supabase) return null; // demo mode: the admin layout already explains
  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "en-attente")
    .order("created_at", { ascending: true });
  const sellerIds = [...new Set((listings ?? []).map((l) => l.seller_id))];
  const { data: sellers } = sellerIds.length
    ? await supabase.from("profiles").select("id, first_name, last_name, email").in("id", sellerIds)
    : { data: [] };
  const sellerById = new Map((sellers ?? []).map((s) => [s.id, s]));

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-balance text-gray-900">Modération</h1>
      <p className="mt-1 text-sm text-pretty text-gray-600">Les annonces soumises apparaissent ici avant publication. Le vendeur est prévenu par email de la décision.</p>

      {!listings?.length ? (
        <p className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600">Rien à modérer. Bravo !</p>
      ) : (
        <ul className="mt-6 space-y-6">
          {listings.map((l) => {
            const seller = sellerById.get(l.seller_id);
            const sub = getSubCategory(l.sub_category_slug);
            return (
              <li key={l.id} className="rounded-xl border border-gray-200 p-4 sm:p-5">
                <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                  <div>
                    <div className="flex gap-2 overflow-x-auto">
                      {l.images.map((src, i) => (
                        <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <Image src={src} alt={`Photo ${i + 1}`} fill sizes="96px" className="img-outline object-cover" />
                        </a>
                      ))}
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-balance text-gray-900">{l.title}</h2>
                    <p className="text-sm tabular-nums text-gray-600">
                      {formatPrice(centsToEuros(l.price_cents))} · {getCondition(l.condition).label}
                      {l.size ? ` · ${l.size}` : ""}{l.brand ? ` · ${l.brand}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {sub ? `${sub.category.label} › ${sub.sub.label}` : l.sub_category_slug} · {getAudienceLabel(l.audience)}
                      {l.team ? ` · ${getTeam(l.team)?.label}` : ""}
                    </p>
                    <p className="mt-3 whitespace-pre-line text-sm text-pretty text-gray-700">{l.description}</p>
                    <p className="mt-3 text-xs tabular-nums text-gray-500">
                      Soumise le {formatDate(l.created_at)} par {seller ? `${seller.first_name} ${seller.last_name} (${seller.email})` : "un membre"}
                    </p>
                  </div>
                  <ModerationForm id={l.id} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
