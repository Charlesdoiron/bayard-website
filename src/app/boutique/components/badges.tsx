import { getTeam } from "@/lib/boutique/taxonomy";
import type { ListingStatus, TeamSlug } from "@/lib/boutique/types";

const base =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide leading-none";

export function TeamBadge({ team, className = "" }: { team: TeamSlug; className?: string }) {
  const t = getTeam(team);
  if (!t) return null;
  return (
    <span className={`${base} bg-bayard text-white ${className}`}>{t.label}</span>
  );
}

export function OfficialBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`${base} bg-gray-900 text-white ${className}`}>Boutique officielle</span>
  );
}

export function StatusBadge({ status, className = "" }: { status: ListingStatus; className?: string }) {
  if (status === "reservee") {
    return <span className={`${base} bg-amber-100 text-amber-900 ${className}`}>Réservé</span>;
  }
  if (status === "vendue") {
    return <span className={`${base} bg-gray-200 text-gray-700 ${className}`}>Vendu</span>;
  }
  return null;
}

export function DonBadge({ className = "" }: { className?: string }) {
  return <span className={`${base} bg-emerald-100 text-emerald-900 ${className}`}>Don</span>;
}

export function TeamOnlyBadge({ team, className = "" }: { team: TeamSlug; className?: string }) {
  const t = getTeam(team);
  if (!t) return null;
  return (
    <span className={`${base} bg-bayard-light text-bayard ${className}`}>
      Réservé à l&apos;{t.label.toLowerCase()}
    </span>
  );
}
