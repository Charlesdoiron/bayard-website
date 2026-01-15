import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative h-screen overflow-hidden bg-gray-800">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bkg.jpeg"
          alt="Club Bayard background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Content positioned at bottom left */}
      <div className="absolute bottom-16 md:bottom-24 left-8 md:left-16 lg:left-32 z-20">
        <h1 className="text-[clamp(48px,6vw,88px)] font-semibold tracking-[-0.02em] leading-[1.05] text-white">
          Montez à cheval <br /> au cœur de Paris
        </h1>
        <div className="mt-8">
          <Image src="/arrow.svg" alt="arrow" width={32} height={50} />
        </div>
      </div>
    </div>
  );
}
