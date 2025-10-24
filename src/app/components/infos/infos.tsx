import Image from "next/image";

const infoCards = [
  {
    id: "horaires",
    image: "/info_1.jpg",
    title: "Horaires d'ouverture",
    content: ["Lundi au Vendredi : 9h - 22h", "Samedi et Dimanche : 9h - 19h"],
    alt: "Cavalière avec son cheval",
    href: "https://www.ucpa.com/centres-sportifs/bayard-vincennes/planning-tarifs",
  },
  {
    id: "tarifs",
    image: "/info_2.jpg",
    title: "Tarifs",
    content: ["Pour plus de détails, consultez notre", "site complet"],
    alt: "Détail du harnais d'un cheval",
    href: "https://www.ucpa.com/centres-sportifs/bayard-vincennes/planning-tarifs",
  },
  {
    id: "acces",
    image: "/info_3.jpg",
    title: "Accès",
    content: [
      "Avenue du Polygone 75012 PARIS",
      "BP 153 - 94305 Vincennes Cedex",
    ],
    alt: "Cavalier à cheval dans un champ au coucher du soleil",
    href: "https://www.ucpa.com/centres-sportifs/bayard-vincennes/acces-et-contacts",
  },
];

export default function Infos() {
  return (
    <section id="infos" className="py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-32">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[#005896] sm:text-4xl">
            Informations Pratiques
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {infoCards.map((card) => (
            <a
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              key={card.id}
              className="group cursor-pointer bg-white shadow-xs border border-gray-100 overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[4/3]  overflow-hidden group-hover:scale-105 transition-all duration-300">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className=" p-8 text-center">
                <h3 className="text-xl  font-medium text-gray-900">
                  {card.title}
                </h3>

                <div className="text-[#848484] leading-relaxed mt-8">
                  {card.content.map((line, index) => (
                    <p key={index} className="text-sm ">
                      {line}
                    </p>
                  ))}
                </div>

                {/* Arrow */}
                <div className="pt-4 ">
                  <div className="inline-flex items-center text-gray-900 border border-[#DBDFE2] rounded-full p-2 group-hover:border-[#848484] transition-all duration-300">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
