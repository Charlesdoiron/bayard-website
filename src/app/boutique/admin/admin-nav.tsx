"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardCheck, Flag, Package, Settings, ShoppingBag, Users } from "lucide-react";

const links = [
  { href: "/boutique/admin", label: "Tableau de bord", icon: BarChart3, exact: true },
  { href: "/boutique/admin/moderation", label: "Modération", icon: ClipboardCheck },
  { href: "/boutique/admin/annonces", label: "Annonces", icon: Package },
  { href: "/boutique/admin/signalements", label: "Signalements", icon: Flag },
  { href: "/boutique/admin/goodies", label: "Goodies", icon: ShoppingBag },
  { href: "/boutique/admin/reservations", label: "Réservations", icon: ClipboardCheck },
  { href: "/boutique/admin/membres", label: "Membres & équipes", icon: Users },
  { href: "/boutique/admin/parametres", label: "Paramètres", icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Administration" className="lg:sticky lg:top-24 lg:self-start">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Administration</p>
      <ul className="scrollbar-none flex gap-1 overflow-x-auto lg:flex-col">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium ${
                  active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
