import Image from "next/image";

export default function Activities() {
  return (
    <section
      id="activities"
      className="py-8 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white w-full"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl text-center font-bold text-[#005896]">
            Nos activités
          </h2>
          <h3 className="text-xs md:text-sm text-center uppercase tracking-widest text-gray-600 mt-2">
            Toute l&apos;année
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center max-w-4xl mx-auto">
          {/* Image Section */}
          <div className="relative h-[250px] md:h-[400px] lg:h-[500px] overflow-hidden ">
            <Image
              src="/activity_1.jpg"
              alt="Cours d'équitation individuel"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Content Section */}
          <div className="space-y-3 md:space-y-6 px-2 md:px-0">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-widest text-gray-600 mb-2">
                L&apos; école d&apos;équitation
              </p>
              <h3 className="text-xl md:text-3xl lg:text-4xl text-gray-900 font-bold">
                Des cours réguliers tout la semaine
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Tous les jours de la semaine, toute l’année, de nombreuses
              reprises sont programmées, allant du débutant jusqu’à la
              compétition, tant à poney qu’à cheval. Pensés comme un
              accompagnement individuel, ces cours collectifs permettent
              d&apos;établir une relation pédagogique forte, d&apos;adapter les
              contenus aux besoins spécifiques de chaque élève et de suivre les
              progrès sur le long terme. Le programme est structuré sur
              l&apos;année scolaire, avec un rythme hebdomadaire ou bimensuel
              selon les objectifs de chacun. C&apos;est l&apos;option idéale
              pour les personnes désireuses de s&apos;engager dans une pratique
              approfondie, régulière et structurée.
            </p>
            <a
              href="https://www.ucpa.com/centres-sportifs/bayard-vincennes/planning-tarifs"
              target="_blank"
              className=" mt-8 text-[#005896] hover:font-bold"
            >
              Découvrez nos horaires et tarifs →
            </a>
          </div>
        </div>
        <div className="mt-10 md:mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center max-w-4xl mx-auto">
          {/* Image Section */}
          <div className="relative h-[250px] md:h-[400px] lg:h-[500px] overflow-hidden  lg:order-2">
            <Image
              src="/activity_2.jpg"
              alt="Stages intensifs d'équitation"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Content Section */}
          <div className="space-y-3 md:space-y-6 px-2 md:px-0 lg:order-1">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-widest text-gray-600 mb-2">
                Coaching intensif
              </p>
              <h3 className="text-xl md:text-3xl lg:text-4xl text-gray-900 font-bold">
                Des stages de tous niveaux
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Les stages intensifs pendant les vacances offrent une immersion
              complète sur une courte période, idéale pour consolider ses
              acquis, débloquer une difficulté ou découvrir de nouvelles
              approches. Organisés durant les vacances scolaires, ces stages
              s&apos;adaptent aux besoins et aux niveaux de chacun. Un format
              idéal pour avancer efficacement tout en profitant de son temps
              libre.
            </p>
            <a
              href="https://www.ucpa.com/centres-sportifs/bayard-vincennes/stages"
              target="_blank"
              className=" mt-8 text-[#005896] hover:font-bold"
            >
              Découvrez nos stages →
            </a>
          </div>
        </div>
        <div className="mt-10 md:mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center max-w-4xl mx-auto">
          {/* Image Section */}
          <div className="relative h-[250px] md:h-[400px] lg:h-[500px] overflow-hidden ">
            <Image
              src="/activity_3.jpg"
              alt="Examens fédéraux d'équitation"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Content Section */}
          <div className="space-y-3 md:space-y-6 px-2 md:px-0">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-widest text-gray-600 mb-2">
                Parcours certifiant
              </p>
              <h3 className="text-xl md:text-3xl lg:text-4xl text-gray-900 font-bold">
                Examens fédéraux
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-md md:text-base">
              Les examens fédéraux sont une étape clé dans la progression du
              cavalier. Ils permettent de valider les compétences acquises tout
              au long de l&apos;année et d&apos;obtenir une reconnaissance
              officielle.
            </p>
          </div>
        </div>
        <div className="mt-10 md:mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center max-w-4xl mx-auto">
          {/* Content Section */}
          <div className="space-y-3 md:space-y-6 px-2 md:px-0">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-widest text-gray-600 mb-2">
                Découverte
              </p>
              <h3 className="text-xl md:text-3xl lg:text-4xl text-gray-900 font-bold">
                Baptème à poney & initiation à cheval
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Afin de découvrir l’équitation, dès 2ans, nous organisons des
              séances d’initiation certains dimanches après-midi. Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem
              ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </p>
            <a
              href="#"
              target="_blank"
              className=" mt-8 text-[#005896] hover:font-bold "
            >
              Découvrir nos séances d&apos;initiation →
            </a>
          </div>
          {/* Image Section */}
          <div className="relative h-[250px] md:h-[400px] lg:h-[500px] overflow-hidden ">
            <Image
              src="/activity_4.jpg"
              alt="Baptème de poney"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
        <div className="mt-10 md:mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center max-w-4xl mx-auto">
          {/* Image Section */}
          <div className="relative h-[250px] md:h-[400px] lg:h-[500px] overflow-hidden ">
            <Image
              src="/activity_5.jpg"
              alt="Animations"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Content Section */}
          <div className="space-y-3 md:space-y-6 px-2 md:px-0">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-widest text-gray-600 mb-2">
                Perfectionnement
              </p>
              <h3 className="text-xl md:text-3xl lg:text-4xl text-gray-900 font-bold">
                Animations
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Le dimanche après-midi et certains jours fériés, nous proposons
              des animations permettant de découvrir de nombreuses disciplines :
              Hunter, saut, dressage, cross, equifun, éthologie, travail à pied
              …
            </p>
            <a
              href="#"
              target="_blank"
              className=" mt-8 text-[#005896] hover:font-bold"
            >
              Découvrir nos animations →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
