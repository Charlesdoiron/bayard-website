import Image from "next/image";

export default function ImageSection() {
  return (
    <div className="relative h-96 w-full shadow-xl ring-1 ring-gray-400/10">
      <Image src="/archi.svg" alt="Image" fill className="object-cover" />
    </div>
  );
}
