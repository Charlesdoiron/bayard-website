import Image from "next/image";

export default function Activities() {
  return (
    <section
      id="activities"
      className="py-8 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white w-full"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl text-center font-bold">
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
                Approche individuelle
              </p>
              <h3 className="text-xl md:text-3xl lg:text-4xl text-gray-900 font-bold">
                Des cours réguliers tout la semaine
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Les cours réguliers s&apos;adressent à toutes celles et ceux qui
              souhaitent progresser de manière continue et durable. Pensés comme
              un accompagnement individuel, ces cours permettent d&apos;établir
              une relation pédagogique forte, d&apos;adapter les contenus aux
              besoins spécifiques de chaque élève et de suivre les progrès sur
              le long terme. Le programme est structuré sur l&apos;année
              scolaire, avec un rythme hebdomadaire ou bimensuel selon les
              objectifs de chacun. C&apos;est l&apos;option idéale pour les
              personnes désireuses de s&apos;engager dans une pratique
              approfondie, régulière et structurée.
            </p>
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
                Des stages intensifs pendant les vacances
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Les stages intensifs offrent une immersion complète sur une courte
              période, idéale pour consolider ses acquis, débloquer une
              difficulté ou découvrir de nouvelles approches. Organisés durant
              les vacances scolaires, ces stages s&apos;adaptent aux besoins et
              aux niveaux de chacun, en proposant un encadrement individuel et
              un programme sur mesure. Que ce soit pour préparer une échéance,
              explorer une nouvelle discipline ou simplement se perfectionner,
              chaque stage est conçu comme un accélérateur de progrès. Un format
              idéal pour avancer efficacement tout en profitant de son temps
              libre.
            </p>
          </div>
        </div>
        <div className="mt-10 md:mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center max-w-4xl mx-auto">
          {/* Image Section */}
          <div className="relative h-[250px] md:h-[400px] lg:h-[500px] overflow-hidden ">
            <Image
              src="/activity_3.jpg"
              alt="Évaluation et examens fédéraux d'équitation"
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
                Evaluation & examens fédéraux
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Les évaluations fédérales sont une étape clé dans la progression
              du cavalier. Elles permettent de valider les compétences acquises
              tout au long de l&apos;année et d&apos;obtenir une reconnaissance
              officielle. Nous accompagnons chaque élève dans la préparation de
              ces examens avec un suivi individualisé, des mises en situation,
              et des contenus adaptés au niveau visé. Que ce soit pour passer un
              Galop ou préparer un concours, l&apos;objectif est d&apos;aborder
              l&apos;évaluation avec confiance et sérénité, en s&apos;appuyant
              sur une préparation rigoureuse et progressive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
