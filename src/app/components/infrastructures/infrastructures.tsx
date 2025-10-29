const infrastructures = [
  {
    id: 1,
    image: "/archi.svg",
    number: "4",
    title: "carrières",
  },
  {
    id: 2,
    image: "/archi1.svg",
    number: "4",
    title: "manèges",
  },
  {
    id: 3,
    image: "/archi.svg",
    number: "1",
    title: "parcours de cross",
  },
  {
    id: 4,
    image: "/archi.svg",
    number: "3",
    title: "paddocks",
  },
];

export default function Infrastructures() {
  return (
    <section
      id="infrastructures"
      className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white w-full"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[#005896] sm:text-4xl">
            Nos infrastructures
          </h2>

          <h3 className="text-xs md:text-sm text-center uppercase tracking-widest text-gray-600 mt-2">
            Tous temps
          </h3>
          <p className="text-md text-gray-500 mt-8 max-w-xl mx-auto text-center leading-relaxed">
            Pour ses 61 chevaux et 73 poneys, le centre équestre est doté
            d&apos;une écurie de 30 boxes, d&apos;une grande halle accueillant
            40 boxes et d&apos;une stabulation.
            <br /> Le poney club, regroupe 20 boxes et 3 stabulations.
          </p>
        </div>

        {/* create a grid of 4 infrastructures with big numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mx-auto">
          {infrastructures.map((infrastructure) => (
            <div
              key={infrastructure?.id}
              className="text-center space-y-4 px-4"
            >
              <div className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#005896] mb-2">
                {infrastructure?.number}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                {infrastructure?.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
