"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface CarouselSlide {
  id: number;
  image: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    image: "/infr_1.jpg",
  },
  {
    id: 2,
    image: "/infr_2.jpg",
  },
  {
    id: 3,
    image: "/infr_3.jpg",
  },
  {
    id: 4,
    image: "/infr_4.jpg",
  },
  {
    id: 5,
    image: "/infr_5.jpg",
  },
  {
    id: 6,
    image: "/infr_6.jpg",
  },
  {
    id: 7,
    image: "/infr_7.jpg",
  },
  {
    id: 8,
    image: "/infr_8.jpg",
  },
  {
    id: 9,
    image: "/infr_9.jpg",
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (!isAutoPlay || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleMouseEnter = () => setIsAutoPlay(false);
  const handleMouseLeave = () => setIsAutoPlay(true);

  // Touch handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-gray-800"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out bg-gray-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <Image
              src={slide.image}
              alt="Carousel slide"
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-10 p-3 md:p-2 rounded-full bg-white/20 hover:bg-white/30 group cursor-pointer min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center transition-colors duration-200"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-10 p-3 md:p-2 rounded-full bg-white/20 hover:bg-white/30 group min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center transition-colors duration-200"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-3 md:space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="p-2 min-h-[44px] min-w-[44px] md:p-1 md:min-h-0 md:min-w-0 flex items-center justify-center transition-colors duration-200"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={`w-3 h-3 md:w-2 md:h-2 rounded-full transition-colors duration-200 ${
                  index === currentSlide
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
