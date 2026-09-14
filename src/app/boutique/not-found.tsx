import Link from "next/link";

export default function BoutiqueNotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-bayard">Erreur 404</p>
      <h1 className="mt-2 text-2xl font-bold text-balance text-gray-900 sm:text-3xl">Cet article n&apos;est plus disponible</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-pretty text-gray-600">
        L&apos;annonce a peut-être été vendue ou retirée, ou l&apos;adresse est erronée.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/boutique" className="press inline-flex h-11 items-center rounded-md bg-bayard px-5 text-sm font-semibold text-white hover:bg-bayard-dark">
          Retour à la boutique
        </Link>
        <Link href="/" className="press inline-flex h-11 items-center rounded-md border border-gray-300 px-5 text-sm font-medium text-gray-800 hover:bg-gray-50">
          Accueil du club
        </Link>
      </div>
    </div>
  );
}
