import Image from "next/image";

export default function History() {
  return (
    <section id="history" className="w-full bg-white">
      {/* Hero Image */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <Image
          src="/history.jpg"
          alt="Cheval du Club Bayard"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Section */}
      <div className="py-16 md:py-20 lg:py-24 px-8 md:px-16 lg:px-32 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4">
              Notre histoire
            </h2>
            <p className="text-sm md:text-base uppercase tracking-widest text-gray-600">
              CLUB BAYARD ÉQUITATION
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6 md:space-y-8 text-gray-800">
            <p className="text-base md:text-lg leading-relaxed text-justify">
              Le 23 décembre 1946, quelques amis, anciens sous-officiers de
              cavalerie, fonde le Club Bayard Equitation sous la forme
              d&apos;une association régie par la loi de 1901. Le CBE compte
              alors environ 250 cavaliers. Il s&apos;installe pendant 4 ans au
              Fort-Neuf de Vincennes, qu&apos;il quitte pour s&apos;installer à
              Joinville, dans les bâtiments et écuries de trotteurs de Monsieur
              VERCRUYSSE.
            </p>

            <p className="text-base md:text-lg leading-relaxed text-justify">
              Pour compléter son installation et y faire une carrière, le CBE
              loue un terrain de 630 m2 implanté au dessus de galeries
              d&apos;anciennes champignonnières, plein de fondrières. Pour le
              rendre utilisable, il faut les combler avec les pavés abandonnés
              dans le Bois de Vincennes pour recouvrir le tout par de la terre.
              Ce sont les cavaliers du Club qui s&apos;en chargeront et à cette
              époque, et le secrétariat du Syndicat occupe l&apos;un des boxes !
            </p>

            <p className="text-base md:text-lg leading-relaxed text-justify">
              Les années 1950 seront clé. Au cours de l&apos;année 1951,
              débutent les négociations avec la Ville de Paris pour obtenir une
              concession dans le Bois de Vincennes, tandis qu&apos;un petit
              manège couvert voit le jour en 1955. Le terrain couvert de
              mâchefer qui se trouve à côté du « Grand rond »
              d&apos;entraînement des trotteurs, sur le polygone de Vincennes,
              est utilisé comme carrière. C&apos;est à cet emplacement qu&apos;a
              été ensuite créé, par la Ville de Paris, la « Carrière Saint
              Hubert » dont profitent actuellement tous les clubs hippiques
              jouxtant le Bois de Vincennes.
            </p>

            <p className="text-base md:text-lg leading-relaxed text-justify">
              Grâce à l&apos;appui d&apos;Antoine QUINSON, Député-Maire de
              Vincennes, le Club Bayard Equitation est accepté comme membre de
              l&apos;Office Municipal des Sports de la ville. En 1957, la
              municipalité lui met à disposition sa carrière actuelle dans le
              Parc Municipal des Sports de la Ville de Vincennes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
