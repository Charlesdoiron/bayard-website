import Image from "next/image";

interface OfferItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
}

const offers: OfferItem[] = [
  {
    id: "expertise",
    title: "Expertise",
    subtitle: "Des moniteurs diplômés d'état",
    image: "/offer_1.jpg",
    alt: "Monitrice diplômée avec un cheval",
  },
  {
    id: "accessibility",
    title: "Accessibilité",
    subtitle: "Ouvert à tous les niveaux",
    image: "/offer_2.jpg",
    alt: "Équipement d'équitation professionnel",
  },
  {
    id: "quality",
    title: "Qualité",
    subtitle: "Des installations modernes",
    image: "/offer_3.jpg",
    alt: "Jeune cavalier sur un cheval",
  },
];

export default function Offers() {
  return (
    <section className="md:py-8 md:py-16 bg-gradient-to-b from-gray-50 to-white w-full">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 relative">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-56 sm:h-64 md:h-80 overflow-hidden">
                <Image
                  src={offer.image}
                  alt={offer.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/50 w-full h-full hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 text-center">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2 tracking-wide">
                    {offer.title}
                  </h3>
                  <p className="text-white text-xs sm:text-sm md:text-xs font-medium uppercase tracking-wide md:tracking-widest px-2">
                    {offer.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
