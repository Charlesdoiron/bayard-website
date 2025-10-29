"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Competition() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const competitionImages = [
    "/compet_1.jpg",
    "/compet_5.jpg",
    "/compet_6.jpg",
    "/compet_7.jpg",
    "/compet_8.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % competitionImages.length
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [competitionImages.length]);
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
        {/* Details section */}
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
              compétition : DRESSAGE, HUNTER, CCE, EQUIFUN, PONY-GAMES, EQUIFUN.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-y-16 ">
            <div>
              <div className="relative">
                <Image
                  width={500}
                  height={500}
                  alt="Compétition équestre"
                  src={competitionImages[currentImageIndex]}
                  className="aspect-3/2 w-full rounded-lg object-cover transition-opacity duration-500"
                />
                <div className="hidden md:flex absolute bottom-4 left-1/2 transform -translate-x-1/2 space-x-1.5 sm:space-x-2">
                  {competitionImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full transition-colors duration-200 ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-8 space-y-6 text-base text-gray-500 ">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">DRESSAGE</h3>
                  <p>
                    Le dressage consiste à faire évoluer les chevaux afin de
                    montrer l&apos;élégance de leurs mouvements et leur facilité
                    d&apos;emploi. Les reprises sont composées de mouvements
                    classiques et de figures imposées ou libres, le cheval
                    évoluant dans les différentes allures.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">HUNTER</h3>
                  <p>
                    Le hunter consiste à enchaîner un parcours d&apos;obstacles
                    avec la plus grande harmonie possible. C&apos;est une
                    discipline idéale pour former les cavaliers, mais aussi les
                    poneys et chevaux, de manière ludique et pédagogique.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">CCE</h3>
                  <p>
                    Le Concours Complet d&apos;Equitation consiste à enchaîner 3
                    tests : le dressage, le saut d&apos;obstacles et le cross.
                    Le dressage consiste à faire évoluer les chevaux afin de
                    montrer l&apos;élégance de leurs mouvements et leur facilité
                    d&apos;emploi. Le saut d&apos;obstacles consiste à enchaîner
                    un parcours d&apos;obstacles mobiles sans faute. Le cross
                    consiste à galoper en terrain varié, prairie, sous-bois,
                    chemins, montées, descentes et franchir des obstacles dont
                    la construction évoque des situations naturelles : tronc
                    d&apos;arbres, barrières, contre haut, contre bas, passage
                    de route ou gué.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Pony-Games
                  </h3>
                  <p>
                    Sport d&apos;équipe où chacun évolue individuellement, le
                    but est de réaliser un parcours ludique sans erreur le plus
                    rapidement possible : vitesse, habileté motrice et aisance à
                    cheval sont les principales qualités attendues.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">Equifun</h3>
                  <p>
                    L&apos;objectif est de réaliser un parcours composé
                    d&apos;une succession de dispositifs à effectuer au
                    chronomètre : parcours, obstacles, slaloms pour lesquels il
                    faut allier maniabilité, saut, adresse…
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
