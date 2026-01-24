import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative h-[70vh] md:h-screen overflow-hidden bg-gray-800">
      {/* Background images - art direction for mobile/desktop */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bkg-mobile.webp"
          alt="Club Bayard background"
          fill
          priority
          className="object-cover object-center md:hidden"
          sizes="100vw"
        />
        <Image
          src="/bkg.webp"
          alt="Club Bayard background"
          fill
          priority
          className="object-cover object-center hidden md:block"
          sizes="100vw"
        />
      </div>

      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Content positioned at bottom left */}
      <div className="absolute bottom-12 left-8 md:left-16 lg:left-32 z-20">
        <h1 className="text-[28px] md:text-[clamp(48px,6vw,88px)] font-semibold tracking-[-0.02em] leading-[1.05] text-white mb-4">
          Montez à cheval <br /> au cœur de Paris
        </h1>
        <div className="">
          <Image src="/arrow.svg" alt="Flèche vers le bas pour découvrir le contenu" width={32} height={50} />
        </div>
      </div>
    </div>
  );
}
