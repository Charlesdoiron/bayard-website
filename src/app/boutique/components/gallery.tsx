"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface GalleryProps {
  images: string[];
  alt: string;
  /** Rendered over the main photo, top-left (badges). */
  overlay?: React.ReactNode;
}

/** Vinted-style photo gallery: large photo, arrows, thumbnails, swipe on mobile. */
export default function Gallery({ images, alt, overlay }: GalleryProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div>
      <div className="img-outline relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-100 sm:aspect-[4/3]">
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${alt} — photo ${index + 1} sur ${count}`}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        {overlay ? <div className="absolute start-3 top-3 flex flex-col items-start gap-1">{overlay}</div> : null}
        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Photo précédente"
              className="press absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow ring-1 ring-black/5 hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Photo suivante"
              className="press absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow ring-1 ring-black/5 hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="absolute bottom-3 end-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium tabular-nums text-white">
              {index + 1} / {count}
            </span>
          </>
        ) : null}
      </div>
      {count > 1 ? (
        <ul className="mt-3 flex gap-2 overflow-x-auto scrollbar-none" aria-label="Miniatures">
          {images.map((src, i) => (
            <li key={src + i} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Voir la photo ${i + 1}`}
                aria-pressed={i === index}
                className={`press relative block h-16 w-16 min-h-0 min-w-0 overflow-hidden rounded-md ring-2 ${
                  i === index ? "ring-bayard" : "ring-transparent hover:ring-gray-300"
                }`}
              >
                <Image src={src} alt="" fill sizes="64px" className="img-outline object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
