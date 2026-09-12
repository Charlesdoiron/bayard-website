const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(price: number): string {
  if (price === 0) return "Don";
  return priceFormatter.format(price).replace(/ €/, " €");
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });
const monthFormatter = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatMonth(iso: string): string {
  return monthFormatter.format(new Date(iso));
}

/** "il y a 3 jours" style relative date. `now` is injectable for stable tests/SSR. */
export function formatRelative(iso: string, now = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 7) return days === 1 ? "hier" : `il y a ${days} jours`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `il y a ${weeks} sem.`;
  const months = Math.round(days / 30);
  return months <= 1 ? "il y a 1 mois" : `il y a ${months} mois`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Deterministic pastel background for an avatar, from a name. */
export function avatarColor(name: string): string {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return `hsl(${h} 45% 88%)`;
}

export function pluralize(n: number, singular: string, plural = `${singular}s`): string {
  return `${n} ${n > 1 ? plural : singular}`;
}
