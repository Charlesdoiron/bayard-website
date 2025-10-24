import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Menu from "@/app/components/menu/menu";
import Footer from "@/app/components/footer/footer";
import { SITE_CONFIG } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      SITE_CONFIG.business.name +
      " - Centre Équestre | Cours d'Équitation & Pension",
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: "/",
    languages: {
      [SITE_CONFIG.language]: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title:
      SITE_CONFIG.business.name +
      " - Centre Équestre | Cours d'Équitation & Pension",
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.images.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Centre Équestre`,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      SITE_CONFIG.business.name +
      " - Centre Équestre | Cours d'Équitation & Pension",
    description: SITE_CONFIG.shortDescription,
    images: [SITE_CONFIG.images.ogImage],
    creator: SITE_CONFIG.business.social.twitter,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: SITE_CONFIG.images.favicon16, sizes: "16x16", type: "image/png" },
      { url: SITE_CONFIG.images.favicon32, sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: SITE_CONFIG.images.appleTouch,
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: SITE_CONFIG.images.safariPinned,
        color: SITE_CONFIG.theme.backgroundColor,
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": SITE_CONFIG.theme.tileColor,
    "theme-color": SITE_CONFIG.theme.color,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_CONFIG.url}/#organization`,
        name: SITE_CONFIG.business.name,
        alternateName: SITE_CONFIG.business.alternateName,
        url: SITE_CONFIG.url,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_CONFIG.url}${SITE_CONFIG.images.logo}`,
          width: 512,
          height: 512,
        },
        description: SITE_CONFIG.description,
        priceRange: SITE_CONFIG.business.priceRange,
        telephone: SITE_CONFIG.business.phone,
        email: SITE_CONFIG.business.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE_CONFIG.business.address.street,
          addressLocality: SITE_CONFIG.business.address.city,
          postalCode: SITE_CONFIG.business.address.postalCode,
          addressCountry: SITE_CONFIG.business.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SITE_CONFIG.business.coordinates.latitude,
          longitude: SITE_CONFIG.business.coordinates.longitude,
        },
        openingHoursSpecification: SITE_CONFIG.business.openingHours.map(
          (hours) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: hours.days,
            opens: hours.opens,
            closes: hours.closes,
          })
        ),
        sameAs: [
          SITE_CONFIG.business.social.facebook,
          SITE_CONFIG.business.social.instagram,
        ],
      },
      {
        "@type": "SportsActivityLocation",
        "@id": `${SITE_CONFIG.url}/#sports-facility`,
        name: `${SITE_CONFIG.name} - Centre Équestre`,
        sport: "Équitation",
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE_CONFIG.business.address.street,
          addressLocality: SITE_CONFIG.business.address.city,
          postalCode: SITE_CONFIG.business.address.postalCode,
          addressCountry: SITE_CONFIG.business.address.country,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.url}/#website`,
        url: SITE_CONFIG.url,
        name: SITE_CONFIG.name,
        description: `Site officiel du ${SITE_CONFIG.name}, centre équestre`,
        publisher: {
          "@id": `${SITE_CONFIG.url}/#organization`,
        },
        inLanguage: SITE_CONFIG.language,
      },
    ],
  };

  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <Menu />
        {children}
        <Footer />
      </body>
    </html>
  );
}
