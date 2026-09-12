"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Tag } from "lucide-react";
import { useState } from "react";
import { TEAMS } from "@/lib/boutique/taxonomy";
import AccountMenu from "./account-menu";

const tabs = [
  { href: "/boutique", label: "Tout", match: (p: string) => p === "/boutique" || p.startsWith("/boutique/annonce") },
  { href: "/boutique/occasion", label: "Occasion", match: (p: string) => p.startsWith("/boutique/occasion") },
  { href: "/boutique/goodies", label: "Goodies du club", match: (p: string) => p.startsWith("/boutique/goodies") },
];

/**
 * Vinted-style boutique header: search bar + "Vends tes articles" call to
 * action, then a category row (spaces + competition teams).
 */
export default function BoutiqueHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const searchBase = pathname.startsWith("/boutique/goodies") && !/\/goodies\/.+/.test(pathname)
    ? "/boutique/goodies"
    : pathname.startsWith("/boutique/occasion")
      ? "/boutique/occasion"
      : "/boutique";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchBase === pathname ? searchParams.toString() : "");
    const q = query.trim();
    if (q) params.set("q", q);
    else params.delete("q");
    const qs = params.toString();
    router.push(qs ? `${searchBase}?${qs}` : searchBase);
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3">
          <Link href="/boutique" className="hidden shrink-0 items-center gap-2 pr-2 sm:flex">
            <span className="text-lg font-bold tracking-tight text-gray-900">Boutique</span>
          </Link>

          <form onSubmit={submit} role="search" className="flex min-w-0 flex-1 items-center">
            <label htmlFor="boutique-search" className="sr-only">
              Rechercher un article
            </label>
            <div className="relative w-full">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                id="boutique-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une selle, un casque, une marque…"
                className="h-11 w-full rounded-md border border-gray-300 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-bayard focus:bg-white focus:outline-none focus:ring-2 focus:ring-bayard/30"
              />
            </div>
          </form>

          <Link
            href="/boutique/vendre"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-bayard px-4 text-sm font-semibold text-white hover:bg-bayard-dark"
          >
            <Tag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Vends tes articles</span>
            <span className="sm:hidden">Vendre</span>
          </Link>
          <AccountMenu />
        </div>

        <nav aria-label="Rubriques de la boutique" className="-mx-4 px-4 sm:mx-0 sm:px-0">
          <ul className="scrollbar-none flex items-center gap-1 overflow-x-auto pb-2 text-sm">
            {tabs.map((tab) => {
              const active = tab.match(pathname);
              return (
                <li key={tab.href} className="shrink-0">
                  <Link
                    href={tab.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex h-9 items-center rounded-full px-3 font-medium ${
                      active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
            <li className="mx-1 h-5 w-px shrink-0 bg-gray-200" aria-hidden="true" />
            {TEAMS.map((team) => {
              const href = `/boutique/equipe/${team.slug}`;
              const active = pathname === href;
              return (
                <li key={team.slug} className="shrink-0">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex h-9 items-center rounded-full px-3 font-medium ${
                      active ? "bg-bayard text-white" : "text-bayard hover:bg-bayard-light"
                    }`}
                  >
                    {team.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
