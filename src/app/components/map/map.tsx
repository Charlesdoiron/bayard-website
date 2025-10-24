export default function Map() {
  const location =
    "Centre Équestre Bayard-Vincennes, Avenue du Polygone, 75012 Paris";
  const encodedLocation = encodeURIComponent(location);

  return (
    <section
      id="contact"
      className="w-full flex flex-col lg:flex-row lg:items-center"
    >
      {/* Contact Information */}
      <div className="bg-white py-8 px-4 sm:py-12 sm:px-6 md:px-8 lg:px-12 w-full lg:w-1/3">
        <div className="max-w-2xl lg:max-w-6xl mx-auto text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold  tracking-wide text-gray-900">
            Club Bayard Equitation
          </h2>
          <div className="text-sm sm:text-base leading-relaxed text-gray-700  sm:space-y-2">
            <p>
              <span className="font-medium text-gray-900"></span>
              <br />
              <span className="font-medium text-gray-900">Adresse:</span>
              <p className="text-[#005896]"> Avenue du Polygone 75012 PARIS</p>
            </p>
            <p>
              <span className="font-medium text-gray-900">Tél:</span>
              <a
                href="tel:+33143654687"
                className="text-[#005896] transition-colors duration-200 "
              >
                01 43 65 46 87
              </a>
            </p>
            <p>
              <span className="font-medium text-gray-900">Email :</span>{" "}
              <a
                href="mailto:infos@clubbayard.com"
                className="text-[#005896] transition-colors duration-200 "
              >
                infos@clubbayard.com
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* Map */}
      <div className="w-full lg:w-2/3 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[800px] relative overflow-hidden">
        <iframe
          src={`https://maps.google.com/maps?q=${encodedLocation}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(100%) contrast(1.2)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg"
          title="Centre Équestre Bayard-Vincennes Location"
        />
      </div>
    </section>
  );
}
