const infrastructures = [
  {
    id: 1,
    image: "/archi.svg",
    title: "La grande carrière",
    description:
      "La carrière de devant est une carrière éclairée de 80m de long et 40m de large. Elle est équipée d'un sol de sable",
  },
  {
    id: 2,
    image: "/archi1.svg",
    title: "La carrière cross",
    description:
      "La carrière cross est une carrière éclairée de 70m de long et 40m de large. Elle est équipée d'un sol de sable",
  },
  {
    id: 3,
    image: "/archi.svg",
    title: "La carrière Jean Osdoit",
    description:
      "La carrière Jean Osdoit, située au stade Léo Lagrange, est mise gracieusement à notre disposition par la Ville de Vincennes",
  },
  {
    id: 4,
    image: "/archi.svg",
    title: "Le cross",
    description:
      "Situé dans le cadre privilégié du bois de Vincennes sur un terrain de 3 hectares, le centre équestre bénéficie d'un parcours de cross homologué  à la disposition des cavaliers pour concours, examens, et séances  d'initiation. ",
  },

  {
    id: 5,
    image: "/archi.svg",
    title: "Le grand manège",
    description:
      "Le grand manège est un manège de 80m de long et 30m de large. Il est équipé d'un sol de sable",
  },

  {
    id: 6,
    image: "/archi.svg",
    title: "Le petit manège",
    description:
      "Le petit manège est un manège de 28m de long et 13 m de large. Il est équipé d'un sol de sable",
  },
  {
    id: 7,
    image: "/archi.svg",
    title: "Le manège de la Garde Républicaine",
    description:
      "Le manège de la Garde Républicaine est un manège de 40m de long et 20 m de large. Il est équipé d'un sol de sable",
  },
  {
    id: 8,
    image: "/archi.svg",
    title: "Le poney club",
    description:
      "Le poney club est un poney club de 50m de long et 30m de large. Il est équipé d'un sol de sable et de 2 boxes.",
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-center">
            Nos infrastructures
          </h2>
          <h3 className="text-xs md:text-sm text-center uppercase tracking-widest text-gray-600 mt-2">
            Tous temps
          </h3>
          <p className="text-md text-gray-500 mt-8 max-w-xl mx-auto text-justify leading-relaxed">
            Pour ses 61 chevaux et  73 poneys, le centre équestre s&apos;est
            doté d&apos;une écurie de 30 boxes, d&apos;une grande halle
            accueillant 40 boxes et d&apos;une stabulation pour nos 3 amis
            camarguais.
            <br /> Le poney club, quant à lui agrandi cette année, regroupe 20
            boxes et 3 stabulations regroupées dans un nouveau batiment.
          </p>
        </div>

        {/* create a grid of 3 images with a title and a description */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mx-auto">
          {infrastructures.map((infrastructure) => (
            <div key={infrastructure.id} className="text-center space-y-4 px-4">
              <h3 className="text-2xl font-bold text-gray-900 text-left">
                {infrastructure.title}
              </h3>
              <p className="text-sm text-left md:text-base text-gray-700 ">
                {infrastructure.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
