import Image from "next/image";

export default function ImageSection() {
  return (
    <div className="relative h-96 w-full">
      <Image src="/archi.svg" alt="Image" fill className="object-cover" />
    </div>
  );
}
