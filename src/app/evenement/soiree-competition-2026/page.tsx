import type { Metadata } from "next";
import Script from "next/script";

// ID du formulaire Tally : la partie après tally.so/r/ dans le lien de partage
const TALLY_FORM_ID = "b5BvoL";

export const metadata: Metadata = {
  title: "Soirée compétition 2026",
  description: "Inscription à la soirée compétition 2026 du Club Bayard.",
  alternates: { canonical: "/evenement/soiree-competition-2026" },
  robots: { index: false, follow: false },
};

export default function Evenement() {
  return (
    <div className="font-sans">
      <section className="bg-black px-4 pt-40 pb-16 text-center sm:pt-48 sm:pb-24">
        <p className="text-sm font-medium uppercase tracking-widest text-white/60">
          Événement
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Soirée compétition 2026
        </h1>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <iframe
            src={`https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
            loading="lazy"
            width="100%"
            height={500}
            title="Inscription à la soirée compétition 2026"
            className="border-0"
          />
        </div>
      </section>

      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
