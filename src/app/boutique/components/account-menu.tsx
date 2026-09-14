"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Package, ShoppingBag, UserRound, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { avatarColor, initials } from "@/lib/boutique/format";
import { signOut } from "../actions/auth";

interface SessionInfo {
  name: string;
  isAdmin: boolean;
}

/**
 * Header account menu. Reads the session in the browser so the catalogue
 * pages can stay statically cached; the middleware and server actions do the
 * real authorization.
 */
export default function AccountMenu() {
  const pathname = usePathname();
  const [session, setSession] = useState<SessionInfo | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = getBrowserClient();
    if (!supabase) {
      setSession(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        if (!cancelled) setSession(null);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, role")
        .eq("id", user.id)
        .maybeSingle();
      if (!cancelled) {
        setSession({
          name: profile?.first_name || (user.user_metadata?.first_name as string) || "Mon compte",
          isAdmin: profile?.role === "admin",
        });
      }
    };
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  if (session === undefined) {
    return <span className="hidden h-11 w-11 rounded-full bg-gray-100 sm:block" aria-hidden="true" />;
  }

  if (!session) {
    const next = pathname.startsWith("/boutique") ? pathname : "/boutique/compte";
    return (
      <Link
        href={`/boutique/connexion?next=${encodeURIComponent(next)}`}
        className="press inline-flex h-11 shrink-0 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-medium text-gray-800 hover:bg-gray-50"
      >
        <UserRound className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{isSupabaseConfigured() ? "Se connecter" : "Compte"}</span>
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="press inline-flex h-11 items-center gap-2 rounded-full border border-gray-300 pe-2 ps-1 text-sm font-medium text-gray-800 hover:bg-gray-50"
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-gray-800"
          style={{ backgroundColor: avatarColor(session.name) }}
          aria-hidden="true"
        >
          {initials(session.name)}
        </span>
        <span className="hidden max-w-[8rem] truncate sm:inline">{session.name}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
      </button>
      {open ? (
        <div
          role="menu"
          style={{ "--origin": "top right" } as React.CSSProperties}
          className="enter-pop absolute end-0 top-12 z-40 w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl"
        >
          <MenuLink href="/boutique/compte" icon={<UserRound className="h-4 w-4" strokeWidth={1.5} />}>Mon profil</MenuLink>
          <MenuLink href="/boutique/compte/annonces" icon={<Package className="h-4 w-4" strokeWidth={1.5} />}>Mes annonces</MenuLink>
          <MenuLink href="/boutique/compte/reservations" icon={<ShoppingBag className="h-4 w-4" strokeWidth={1.5} />}>Mes réservations</MenuLink>
          {session.isAdmin ? (
            <MenuLink href="/boutique/admin" icon={<Shield className="h-4 w-4" strokeWidth={1.5} />}>Administration</MenuLink>
          ) : null}
          <form action={signOut} className="mt-1 border-t border-gray-100 pt-1">
            <button
              type="submit"
              role="menuitem"
              className="press flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Se déconnecter
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
    >
      <span className="text-gray-500" aria-hidden="true">{icon}</span>
      {children}
    </Link>
  );
}
