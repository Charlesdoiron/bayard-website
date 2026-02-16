/**
 * Site Configuration Constants
 *
 * This file contains all the SEO and site configuration constants.
 * To update your site's metadata, social media links, or business info,
 * simply modify the values in this file instead of searching through
 * multiple files.
 *
 * Remember to:
 * - Replace the placeholder URL with your actual domain
 * - Update the business contact information
 * - Add real GPS coordinates for your location
 * - Replace social media URLs with actual profiles
 * - Update opening hours as needed
 */
export const SITE_CONFIG = {
  name: "Club Bayard",
  shortName: "Club Bayard",
  description:
    "Club Bayard, centre équestre moderne avec moniteurs diplômés d'état. Cours d'équitation pour tous niveaux,installations de qualité. Découvrez l'équitation dans un cadre exceptionnel.",
  shortDescription:
    "Club Bayard, centre équestre moderne avec moniteurs diplômés d'état. Cours d'équitation pour tous niveaux.",
  url: "https://club-bayard.fr", // Replace with your actual domain
  locale: "fr_FR",
  language: "fr-FR",

  // Business Information
  business: {
    name: "Club Bayard",
    alternateName: "Centre Équestre Club Bayard",
    phone: "+33-01-43-65-46-87", // Replace with actual phone number
    email: "communication@clubbayard.com", // Replace with actual email
    priceRange: "€€",

    // Address
    address: {
      street: "Avenue du Polygone", // Replace with actual address
      city: "Paris",
      postalCode: "75012",
      country: "FR",
    },

    // Coordinates 48.834392791872034, 2.431442608502564
    coordinates: {
      latitude: 48.834392791872034, // Replace with actual coordinates
      longitude: 2.431442608502564,
    },

    // Opening Hours
    openingHours: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "22:00",
      },
      {
        days: ["Saturday", "Sunday"],
        opens: "08:00",
        closes: "22:00",
      },
    ],

    // Social Media
    social: {
      facebook: "https://www.facebook.com/clubbayardequitation", // Replace with actual URLs
      instagram: "https://www.instagram.com/clubbayardequitation/",
      twitter: "clubbayardequitation", // Replace with actual handle
    },
  },

  // SEO Keywords
  keywords: [
    "club équestre",
    "centre équestre",
    "cours équitation",
    "moniteur diplômé",
    "bayard",
    "équitation",
    "cavaliers",
    "chevaux",
    "manège",
  ],

  // Images
  images: {
    logo: "/logo.png",
    ogImage: "https://bayard-website.vercel.app/og-image.jpg",
    favicon: "/fav.ico/favicon.ico",
    favicon16: "/fav.ico/favicon-16x16.png",
    favicon32: "/fav.ico/favicon-32x32.png",
    favicon96: "/fav.ico/favicon-96x96.png",
    appleTouch: "/fav.ico/apple-icon-180x180.png",
    appleIcon57: "/fav.ico/apple-icon-57x57.png",
    appleIcon60: "/fav.ico/apple-icon-60x60.png",
    appleIcon72: "/fav.ico/apple-icon-72x72.png",
    appleIcon76: "/fav.ico/apple-icon-76x76.png",
    appleIcon114: "/fav.ico/apple-icon-114x114.png",
    appleIcon120: "/fav.ico/apple-icon-120x120.png",
    appleIcon144: "/fav.ico/apple-icon-144x144.png",
    appleIcon152: "/fav.ico/apple-icon-152x152.png",
    android192: "/fav.ico/android-icon-192x192.png",
    msIcon144: "/fav.ico/ms-icon-144x144.png",
    safariPinned: "/fav.ico/apple-icon-precomposed.png",
  },

  // Theme
  theme: {
    color: "#ffffff",
    backgroundColor: "#000000",
    tileColor: "#000000",
  },

  // SEO & Verification
  seo: {
    // Search Console Verification Codes
    googleSiteVerification: "", // Add your Google Search Console verification code
    bingSiteVerification: "", // Add your Bing Webmaster verification code

    // Additional SEO Settings
    defaultImage: "/og-image.jpg",
    twitterHandle: "@clubbayardequitation",
  },

  // Services offered (for Service schema)
  services: [
    {
      name: "Cours d'équitation",
      description:
        "Cours d'équitation pour tous niveaux avec moniteurs diplômés d'état",
      serviceType: "EquestrianTraining",
    },
    {
      name: "Compétition",
      description: "Préparation et participation aux compétitions équestres",
      serviceType: "EquestrianCompetition",
    },
  ],
} as const;

// Page Metadata
export const PAGES = {
  home: {
    title: "Club Bayard - Centre Équestre | Cours d'Équitation",
    path: "/",
    priority: 1,
  },
  offers: {
    title: "Nos Offres",
    path: "/#offres",
    priority: 0.8,
  },
  activities: {
    title: "Activités",
    path: "/#activites",
    priority: 0.8,
  },
  infrastructures: {
    title: "Infrastructures",
    path: "/#infrastructures",
    priority: 0.8,
  },
  history: {
    title: "Notre Histoire",
    path: "/#histoire",
    priority: 0.7,
  },
  contact: {
    title: "Contact",
    path: "/#contact",
    priority: 0.9,
  },
} as const;
