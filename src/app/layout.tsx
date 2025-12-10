import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Menu from "@/app/components/menu/menu";
import Footer from "@/app/components/footer/footer";
import { SITE_CONFIG } from "@/lib/constants";
import { generateStructuredDataGraph } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const seoVerification: Record<string, string> = {};
if (SITE_CONFIG.seo.googleSiteVerification) {
  seoVerification["google-site-verification"] =
    SITE_CONFIG.seo.googleSiteVerification;
}
if (SITE_CONFIG.seo.bingSiteVerification) {
  seoVerification["msvalidate.01"] = SITE_CONFIG.seo.bingSiteVerification;
}

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
  other: {
    "msapplication-TileColor": SITE_CONFIG.theme.tileColor,
    "theme-color": SITE_CONFIG.theme.color,
    ...seoVerification,
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = generateStructuredDataGraph();

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
        <a href="#main-content" className="sr-only">
          Aller au contenu principal
        </a>
        <Menu />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
