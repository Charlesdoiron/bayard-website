import type { Metadata } from "next";
import { Suspense } from "react";
import BoutiqueHeader from "./components/boutique-header";

export const metadata: Metadata = {
  title: {
    default: "Boutique",
    template: "%s | Boutique Club Bayard",
  },
  description:
    "La boutique du Club Bayard : équipement d'équitation d'occasion entre cavaliers et goodies officiels du club. Sans paiement en ligne, remise au club.",
  alternates: { canonical: "/boutique" },
};

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white pt-[92px] text-gray-900 md:pt-[108px]">
      <div className="bg-amber-50 text-amber-900">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs sm:px-6 lg:px-8">
          Version de démonstration : les articles sont fictifs. Comptes, dépôt d&apos;annonces et
          réservations seront activés avec la V1.
        </p>
      </div>
      <Suspense fallback={<div className="h-[104px] border-b border-gray-200" />}>
        <BoutiqueHeader />
      </Suspense>
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
