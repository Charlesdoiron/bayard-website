"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback } from "react";

const DotLottiePlayer = dynamic(
  () => import("@dotlottie/react-player").then((mod) => mod.DotLottiePlayer),
  { ssr: false },
);

const menuItems = [
  { href: "#presentation", label: "Présentation" },
  { href: "#activities", label: "Activités" },
  { href: "#infrastructures", label: "Infrastructures" },
  { href: "#infos", label: "Infos pratiques" },
  { href: "#contact", label: "Contact" },
];

export default function Menu() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lottieRef = useRef<any>(null);
  const prevScrollY = useRef(0);
  const prevTime = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Detect if we've scrolled past the hero section
      const heroHeight =
        window.innerWidth >= 768
          ? window.innerHeight
          : window.innerHeight * 0.7;
      setIsPastHero(currentScrollY > heroHeight - 100);

      // Lottie speed based on scroll velocity
      const now = Date.now();
      const dt = now - prevTime.current || 16;
      const dy = Math.abs(currentScrollY - prevScrollY.current);
      const velocity = dy / dt; // px/ms
      const speed = Math.min(Math.max(velocity * 3, 0.3), 4);
      prevScrollY.current = currentScrollY;
      prevTime.current = now;

      if (lottieRef.current) {
        lottieRef.current.setSpeed(speed);
      }

      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);

      // Don't hide menu if we're at the very top
      if (currentScrollY < 10) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Hide menu when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // Close mobile menu when clicking outside or on links
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        !(event.target as Element).closest(".mobile-menu-container")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    }

    return () => {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Play/pause lottie based on scroll
  useEffect(() => {
    if (!lottieRef.current) return;
    if (isScrolling) {
      lottieRef.current.play();
    } else {
      lottieRef.current.pause();
    }
  }, [isScrolling]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${"transform translate-y-0"} ${isMobileMenuOpen ? "bg-black" : isPastHero ? "lg:bg-black bg-transparent" : "bg-transparent"}`}
    >
      {/* Glass morphism background */}

      <nav
        className={`relative flex items-center justify-between px-4 md:px-8 lg:px-12 transition-all duration-300 py-4 md:py-6 ${isPastHero && !isMobileMenuOpen ? "lg:py-0" : ""}`}
      >
        {/* Logo */}
        <div
          className={`flex-shrink-0 transition-opacity duration-300 ${isPastHero && !isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <Link href="/" className="block p-2 -m-2">
            <div className="relative">
              <Image
                src="/logo.svg"
                alt="Logo Club Bayard"
                width={60}
                height={60}
                className="brightness-0 invert"
              />
            </div>
          </Link>
        </div>

        {/* Lottie Horse - visible when past hero */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`flex-shrink-0 transition-all duration-300 absolute left-4 sm:left-6 lg:left-8 flex items-center gap-3 cursor-pointer ${isPastHero && !isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className="bg-white lg:bg-transparent rounded-full p-2 ring-1 ring-black/5 lg:ring-0 shadow-sm lg:shadow-none">
            <div className="brightness-0 lg:brightness-0 lg:invert">
              <DotLottiePlayer
                ref={lottieRef}
                src="/horse.lottie"
                autoplay={isScrolling}
                loop
                style={{ width: 32, height: 32 }}
              />
            </div>
          </div>
          <span className="-ml-3 hidden lg:block text-white/50 text-sm font-medium font-[family-name:var(--font-inter)] tracking-wide -mb-1">
            | Club Bayard Equitation
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 font-[family-name:var(--font-inter)]">
          {menuItems.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className="relative group px-3 xl:px-4 py-2 text-md  font-medium whitespace-nowrap text-white hover:text-white"
              >
                <span className="relative z-10 tracking-wide">
                  {item.label}
                </span>

                {/* Underline effect */}
                <div className="absolute bottom-1 left-3 xl:left-4 right-3 xl:right-4 h-px bg-white rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={handleMobileMenuToggle}
          className={`lg:hidden mobile-menu-container transition-all duration-300 bg-white rounded-full p-3 ring-1 ring-black/5 shadow-sm text-black hover:text-black ${isMobileMenuOpen ? "mr-2" : ""}`}
          aria-label="Toggle mobile menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1 cursor-pointer">
            <div
              className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <div
              className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <div
              className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      <div
        className={`mobile-menu-container lg:hidden fixed inset-x-0 top-full bg-black/95 backdrop-blur-md transition-all duration-300 ease-in-out transform ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{
          zIndex: 40,
          maxHeight: isMobileMenuOpen ? "100vh" : "0",
          overflow: "hidden",
        }}
      >
        <nav className="px-4 py-6 space-y-1 font-[family-name:var(--font-inter)]">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={handleMobileLinkClick}
              className="block w-full text-left px-4 py-4 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-lg font-medium uppercase tracking-wide"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
