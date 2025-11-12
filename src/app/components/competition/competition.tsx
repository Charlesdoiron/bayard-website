import Image from "next/image";
import { ImageCarousel } from "../carousel/image-carousel";

interface CompetitionItem {
  title: string;
  description: string;
  images: string[];
}

const competitionItems: CompetitionItem[] = [
  {
    title: "CCE",
    description:
      "Le Concours Complet d'Equitation consiste à enchaîner 3 tests : le dressage, le saut d'obstacles et le cross. Le dressage consiste à faire évoluer les chevaux afin de montrer l'élégance de leurs mouvements et leur facilité d'emploi. Le saut d'obstacles consiste à enchaîner un parcours d'obstacles mobiles sans faute. Le cross consiste à galoper en terrain varié, prairie, sous-bois, chemins, montées, descentes et franchir des obstacles dont la construction évoque des situations naturelles : tronc d'arbres, barrières, contre haut, contre bas, passage de route ou gué.",
    images: ["/cce_cheval.jpg", "/cce_poney.jpg", "/cce_shet.jpg"],
  },
  {
    title: "DRESSAGE",
    description:
      "Le dressage consiste à faire évoluer les chevaux afin de montrer l'élégance de leurs mouvements et leur facilité d'emploi. Les reprises sont composées de mouvements classiques et de figures imposées ou libres, le cheval évoluant dans les différentes allures.",
    images: ["/compet_2.jpg", "/dressage_shet.jpg"],
  },
  {
    title: "HUNTER",
    description:
      "Le hunter consiste à enchaîner un parcours d'obstacles avec la plus grande harmonie possible. C'est une discipline idéale pour former les cavaliers, mais aussi les poneys et chevaux, de manière ludique et pédagogique.",
    images: ["/hunter.jpg", "/hunter_cheval.jpg"],
  },

  {
    title: "Pony-Games",
    description:
      "Sport d'équipe où chacun évolue individuellement, le but est de réaliser un parcours ludique sans erreur le plus rapidement possible : vitesse, habileté motrice et aisance à cheval sont les principales qualités attendues.",
    images: ["/compet_7.jpg"],
  },
  {
    title: "Equifun",
    description:
      "L'objectif est de réaliser un parcours composé d'une succession de dispositifs à effectuer au chronomètre : parcours, obstacles, slaloms pour lesquels il faut allier maniabilité, saut, adresse…",
    images: ["/compet_8.jpg"],
  },
];

export default function Competition() {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
        <section aria-labelledby="details-heading">
          <div className="flex flex-col items-center text-center">
            <h2
              id="details-heading"
              className="text-3xl font-bold tracking-tight text-[#005896] sm:text-4xl"
            >
              La compétition
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-gray-600">
              Le CBE dispose à cheval comme à poney de plusieurs équipes
              compétition : DRESSAGE, HUNTER, CCE, PONY-GAMES, EQUIFUN.
            </p>
          </div>
          <div className="relative w-full mt-8 md:mt-12 aspect-video overflow-hidden mx-auto">
            <Image src="/team.jpg" alt="Team" fill className="object-cover" />
          </div>
          <div className="mt-16 grid grid-cols-1 gap-16 lg:gap-24">
            {competitionItems.map((item) => (
              <div
                key={item.title}
                className="flex flex-col lg:flex-row gap-8 items-center"
              >
                <div className="w-full lg:w-1/2">
                  <ImageCarousel
                    images={item.images}
                    alt={item.title}
                    className="aspect-3/2 w-full"
                  />
                </div>
                <div className="w-full lg:w-1/2 space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
