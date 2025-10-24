"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

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
      // Get current scrollbar width to prevent layout shift
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Add CSS class for scroll prevention
      document.body.classList.add("mobile-menu-open");

      // Additional JavaScript-based prevention
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      // Compensate for scrollbar width to prevent layout shift
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // Also compensate the header if needed
      const header = document.querySelector("header");
      if (header) {
        (header as HTMLElement).style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      // Remove CSS class
      document.body.classList.remove("mobile-menu-open");

      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";

      const header = document.querySelector("header");
      if (header) {
        (header as HTMLElement).style.paddingRight = "0px";
      }
    }

    return () => {
      // Cleanup: remove CSS class and reset styles
      document.body.classList.remove("mobile-menu-open");
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";

      const header = document.querySelector("header");
      if (header) {
        (header as HTMLElement).style.paddingRight = "0px";
      }
    };
  }, [isMobileMenuOpen]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed bg-white top-0 left-0 right-0 z-50  transition-transform duration-300 ease-in-out ${
        isVisible ? "transform translate-y-0" : "transform -translate-y-full"
      }`}
    >
      {/* Glass morphism background */}

      <nav className="relative flex items-center justify-between px-4 md:px-8 lg:px-12 py-4 md:py-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="block p-2 -m-2">
            <div className="relative">
              <Image src="/logo.svg" alt="Globe icon" width={60} height={60} />
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4">
          {menuItems.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className="relative group px-3 xl:px-4 py-2 text-sm xl:text-base font-medium text-[#005896] hover:text-[#005896] whitespace-nowrap"
              >
                <span className="relative z-10 uppercase tracking-wide">
                  {item.label}
                </span>

                {/* Hover background */}
                <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                {/* Underline effect */}
                <div className="absolute bottom-1 left-3 xl:left-4 right-3 xl:right-4 h-0.5 bg-gradient-to-r from-white/60 to-white/90 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={handleMobileMenuToggle}
          className="lg:hidden p-2 text-black hover:text-black mobile-menu-container"
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
        className={`mobile-menu-container lg:hidden fixed inset-x-0 top-full bg-black/95 backdrop-blur-md border-t border-white/10 transition-all duration-300 ease-in-out transform ${
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
        <nav className="px-4 py-6 space-y-1">
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
