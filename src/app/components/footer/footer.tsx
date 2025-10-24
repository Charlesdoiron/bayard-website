import Image from "next/image";

const navigationLinks = [
  { label: "PRÉSENTATION", href: "#presentation" },
  { label: "ACTIVITÉS", href: "#activites" },
  { label: "INFRASTRUCTURES", href: "#infrastructures" },
  { label: "INFOS PRATIQUES", href: "#infos" },
  { label: "CONTACT", href: "#contact" },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/clubbayardequitation",
    icon: "M18.77 7.46H15.5v-1.9c0-.9.6-1.1 1-1.1h2.2V2.5L15.4 2.5c-3.3 0-4.7 2.5-4.7 4.1v1.8H8.5v1.9h2.2v9.2h3.3v-9.2h2.8l.4-1.9z",
    label: "Facebook",
  },

  {
    href: "https://www.instagram.com/clubbayardequitation/",
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    label: "Instagram",
  },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col items-center space-y-6 md:space-y-8">
          {/* Logo */}
          <div className="relative mb-22">
            <Image src="/logo.svg" alt="Globe icon" width={130} height={130} />
          </div>

          {/* Navigation */}
          <nav className="w-full max-w-md md:max-w-none">
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 md:flex md:flex-wrap md:justify-center md:gap-8 text-xs md:text-sm tracking-wider">
              {navigationLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-gray-300 transition-colors duration-200 text-center px-1 py-2 md:py-1 min-h-[44px] md:min-h-0 flex items-center justify-center"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Social Icons */}
          <div className="flex space-x-5 md:space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-10 md:h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
                aria-label={social.label}
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-gray-400 space-y-2 md:space-y-0">
          <span>Club Bayard</span>
          <span>© 2025. Tous droits réservés.</span>
          <span>
            Conçu et développé par{" "}
            <a href="www.linkedin.com" className="font-bold">
              Studio Fragile
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
