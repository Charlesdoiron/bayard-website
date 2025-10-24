import Image from "next/image";

export default function Competition() {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
        {/* Details section */}
        <section aria-labelledby="details-heading">
          <div className="flex flex-col items-center text-center">
            <h2
              id="details-heading"
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              La compétition
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-gray-600">
              Le CBE dispose à cheval comme à poney de plusieurs équipes
              compétition :
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8">
            <div>
              <Image
                width={1000}
                height={1000}
                alt="Drawstring top with elastic loop closure and textured interior padding."
                src="/slide_1.jpg"
                className="aspect-3/2 w-full rounded-lg object-cover"
              />
              <p className="mt-8 text-base text-gray-500">
                À poney : CCE, Equifun, Hunter, Pony Games
              </p>
            </div>
            <div>
              <Image
                width={1000}
                height={1000}
                alt="Front zipper pouch with included key ring."
                src="/slide_1.jpg"
                className="aspect-3/2 w-full rounded-lg object-cover"
              />
              <p className="mt-8 text-base text-gray-500">
                À cheval : CCE, Dressage, Hunter.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
