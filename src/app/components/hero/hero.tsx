import Image from "next/image";

export default function Hero() {
  return (
    <div
      className="flex flex-col items-start justify-center h-screen px-8 md:px-16 lg:px-32 relative bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url(/bkg.jpg)" }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      <p className="text-xl md:text-2xl lg:text-3xl text-white relative z-10">
        Centre équestre
      </p>

      <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white relative z-10">
        Club Bayard
      </h1>

      <div className="relative z-10 mt-8">
        <Image src="/arrow.svg" alt="arrow" width={32} height={50} />
      </div>
    </div>
  );
}
