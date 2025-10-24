import Image from "next/image";

export default function Example() {
  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0 dark:bg-gray-900">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-200 dark:stroke-gray-800"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg
            x="50%"
            y={-1}
            className="overflow-visible fill-gray-50 dark:fill-gray-800/50"
          >
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
            width="100%"
            height="100%"
            strokeWidth={0}
          />
        </svg>
      </div>
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold tracking-tight text-[#005896] sm:text-4xl">
              Le club house
            </h2>

            <p className="mt-6 text-xl/8 text-gray-700 dark:text-gray-300">
              Découvrez notre club house au cœur du centre équestre, proposant
              une cuisine variée, des boissons rafraîchissantes et une grande
              terrasse pour profiter pleinement de votre visite.
            </p>
            <p className="mt-6 text-base/7 text-gray-600 dark:text-gray-400">
              Notre club house vous accueille dans une ambiance chaleureuse et
              conviviale. Nous proposons une carte variée, préparés avec des
              ingrédients frais et de qualité.
            </p>

            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Grande terrasse ensoleillée
            </h2>
            <p className="mt-4 text-base/7 text-gray-600 dark:text-gray-400">
              Profitez de notre grande terrasse pour déguster vos repas en plein
              air, avec une vue imprenable sur les installations équestres.
              L&apos;endroit idéal pour se détendre et partager un moment
              convivial dans un cadre exceptionnel.
            </p>
            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Horaires d&apos;ouverture
            </h2>
            <div className="mt-4 space-y-2 text-base/7 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Lundi</span>
                <span className="font-medium">Fermé</span>
              </div>
              <div className="flex justify-between">
                <span>Mardi</span>
                <span className="font-medium">Fermé</span>
              </div>
              <div className="flex justify-between">
                <span>Mercredi</span>
                <span className="font-medium">9h00 à 21h30</span>
              </div>
              <div className="flex justify-between">
                <span>Jeudi</span>
                <span className="font-medium">9h00 à 21h30</span>
              </div>
              <div className="flex justify-between">
                <span>Vendredi</span>
                <span className="font-medium">9h00 à 21h30</span>
              </div>
              <div className="flex justify-between">
                <span>Samedi</span>
                <span className="font-medium">8h00 à 19h00</span>
              </div>
              <div className="flex justify-between">
                <span>Dimanche</span>
                <span className="font-medium">8h00 à 19h00</span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Image
              width={1000}
              height={1000}
              alt=""
              src="/restaurant.jpg"
              className="w-full rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 dark:bg-gray-800 dark:ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
