"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { TEAMS } from "@/lib/boutique/taxonomy";
import type { TeamSlug } from "@/lib/boutique/types";
import { setMemberFlags, setTeamMembership } from "../../actions/admin";

interface Props {
  profile: { id: string; name: string; email: string; phone: string | null; role: "member" | "admin"; suspended: boolean; since: string };
  teams: TeamSlug[];
}

export default function MemberRow({ profile, teams }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<{ ok: boolean; message?: string }>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.message ?? "Action impossible.");
      router.refresh();
    });
  };

  return (
    <li className={`p-4 ${profile.suspended ? "bg-red-50/50" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {profile.name}
            {profile.role === "admin" ? <span className="ml-2 rounded-full bg-gray-900 px-2 py-0.5 text-[11px] font-semibold uppercase text-white">Admin</span> : null}
            {profile.suspended ? <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold uppercase text-red-800">Suspendu</span> : null}
          </p>
          <p className="truncate text-xs text-gray-500">{profile.email}{profile.phone ? ` · ${profile.phone}` : ""} · inscrit le {profile.since}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={pending} onClick={() => run(() => setMemberFlags(profile.id, { suspended: !profile.suspended }), profile.suspended ? undefined : "Suspendre ce compte ? Le membre ne pourra plus publier ni réserver.")} className="inline-flex h-8 items-center rounded-md border border-gray-300 px-2.5 text-xs font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50">
            {profile.suspended ? "Réactiver" : "Suspendre"}
          </button>
          <button type="button" disabled={pending} onClick={() => run(() => setMemberFlags(profile.id, { role: profile.role === "admin" ? "member" : "admin" }), profile.role === "admin" ? "Retirer les droits administrateur ?" : "Donner les droits administrateur à ce membre ?")} className="inline-flex h-8 items-center rounded-md border border-gray-300 px-2.5 text-xs font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50">
            {profile.role === "admin" ? "Retirer admin" : "Rendre admin"}
          </button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`Équipes de ${profile.name}`}>
        {TEAMS.map((t) => {
          const member = teams.includes(t.slug);
          return (
            <button
              key={t.slug}
              type="button"
              disabled={pending}
              aria-pressed={member}
              onClick={() => run(() => setTeamMembership(profile.id, t.slug, !member))}
              className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium disabled:opacity-50 ${
                member ? "border-bayard bg-bayard text-white" : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              {t.shortLabel}
            </button>
          );
        })}
      </div>
      {error ? <p className="mt-2 text-xs text-red-600" role="alert">{error}</p> : null}
    </li>
  );
}
