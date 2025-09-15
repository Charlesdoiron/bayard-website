export default function Video() {
  return (
    <div
      id="presentation"
      className="flex flex-col items-start justify-center px-8 md:px-16 lg:px-32 py-16 md:py-20 lg:py-24"
    >
      <h4 className="text-lg md:text-xl uppercase text-gray-600">
        Un centre équestre
      </h4>

      <h5 className="text-2xl md:text-3xl -mt-1 font-bold">Au cœur de Paris</h5>

      <p className="text-base md:text-lg max-w-2xl mt-8 md:mt-12 leading-relaxed">
        Le Centre Équestre Bayard UCPA Vincennes vous accueille dans un cadre
        exceptionnel au cœur du Bois de Vincennes. Notre équipe de
        professionnels passionnés vous propose des activités adaptées à tous les
        niveaux, de l&apos;initiation à la compétition.
      </p>

      <div className="relative w-full mt-8 md:mt-12 aspect-video overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/Oct-WX2uv-A?si=lT3aEvCF9ir5jwD6"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}
