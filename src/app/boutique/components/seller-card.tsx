import type { Seller } from "@/lib/boutique/types";
import { avatarColor, formatMonth, initials } from "@/lib/boutique/format";
import { getTeam } from "@/lib/boutique/taxonomy";

export default function SellerCard({ seller }: { seller: Seller }) {
  const teams = seller.teams.map((t) => getTeam(t)?.shortLabel).filter(Boolean);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-gray-800"
        style={{ backgroundColor: avatarColor(seller.displayName) }}
        aria-hidden="true"
      >
        {initials(seller.displayName)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">{seller.displayName}</p>
        <p className="text-xs text-gray-500">Membre depuis {formatMonth(seller.memberSince)}</p>
        {teams.length ? (
          <p className="mt-0.5 truncate text-xs text-bayard">
            {teams.length > 1 ? "Équipes" : "Équipe"} {teams.join(", ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
