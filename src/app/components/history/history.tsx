import Image from "next/image";

export default function History() {
  return (
    <section id="history" className="w-full bg-white">
      {/* Hero Image */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-700 shadow-xl ring-1 ring-gray-400/10">
        <Image
          src="/history.jpg"
          alt="Cheval du Club Bayard"
          fill
          className="object-cover object-center"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyOiKhGikpyULBWTIzYtWHbLJ2kZzn7"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Section */}
      <div className="py-16 md:py-20 lg:py-24 px-8 md:px-16 lg:px-32">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-[#005896] sm:text-4xl">
              Notre histoire
            </h2>
            <p className="text-sm md:text-base uppercase tracking-widest text-gray-600">
              CLUB BAYARD ÉQUITATION
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6 md:space-y-4 text-gray-800">
            <p className="text-base md:text-lg leading-relaxed text-justify">
              Le Club Bayard Equation est l’une des plus anciennes associations
              équestres de France.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-justify">
              Créée en 1947 par quelques amis sous la forme d’une association
              régie par la loi de 1901, le CBE compte alors 250 cavaliers.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-justify">
              Grâce à l’appui d’Antoine QUINSON, Député-Maire de Vincennes, en
              1957, la municipalité met à la disposition du CBE l’actuelle
              carrière « Jean Osdoit » située dans le stade Léo Lagrange.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-justify">
              En 1960, Jean OSDOIT est élu Président, le CBE compte alors 500
              membres et le 16 juin 1975, une convention est signée entre le CBE
              et la ville de Paris qui lui attribue pour 20 ans la concession
              d’un emplacement de 3 hectares dans le Bois de Vincennes.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-justify">
              Cette même année, le CBE signe un premier partenariat de 20 ans
              avec l’UCPA pour la gestion du centre équestre.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-justify">
              En janvier 1998, sous l’impulsion de Christian CLERET son
              Président, le CBE et l’UCPA entame une première tranche de
              travaux. Le Poney Club, la maison d’habitation, la grande carrière
              sont rénovés et la nouvelle écurie est créée.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-justify">
              En septembre 2018, sous la présidence d’Éric Vernon, les travaux
              de rénovation des grandes halles datant de 1878, du club house et
              l&apos;extension du poney club ont été effectués. L’ensemble de
              ces travaux ont très largement contribué à la valorisation du
              patrimoine de la ville de Paris et à la mise en valeur de ce site
              tant apprécié de tous.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-justify">
              Notre politique a toujours consisté à favoriser la pratique de
              l’équitation au moindre coût dans un système de valeurs
              associatives permettant à chacun de s’impliquer dans la vie du
              club, un lieu où tous aiment à se retrouver au-delà de la seule
              pratique de l’équitation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
