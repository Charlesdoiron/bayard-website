"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, ShoppingBag, UserRound } from "lucide-react";

const links = [
  { href: "/boutique/compte", label: "Mon profil", icon: UserRound, exact: true },
  { href: "/boutique/compte/annonces", label: "Mes annonces", icon: Package },
  { href: "/boutique/compte/reservations", label: "Mes réservations", icon: ShoppingBag },
];

export default function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Mon compte" className="lg:sticky lg:top-24 lg:self-start">
      <ul className="scrollbar-none scroll-fade flex gap-1 overflow-x-auto lg:mask-none lg:flex-col">
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
