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
    "Club Bayard, centre équestre moderne avec moniteurs diplômés d'état. Cours d'équitation pour tous niveaux, pension pour chevaux, installations de qualité. Découvrez l'équitation dans un cadre exceptionnel.",
  shortDescription:
    "Club Bayard, centre équestre moderne avec moniteurs diplômés d'état. Cours d'équitation pour tous niveaux, pension pour chevaux.",
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
      facebook: "https://facebook.com/clubbayard", // Replace with actual URLs
      instagram: "https://instagram.com/clubbayard",
      twitter: "@clubbayard", // Replace with actual handle
    },
  },

  // SEO Keywords
  keywords: [
    "club équestre",
    "centre équestre",
    "cours équitation",
    "moniteur diplômé",
    "pension chevaux",
    "bayard",
    "équitation",
    "cavaliers",
    "chevaux",
    "manège",
  ],

  // Images
  images: {
    logo: "/logo.png",
    ogImage: "/og-image.jpg",
    favicon16: "/favicon-16x16.png",
    favicon32: "/favicon-32x32.png",
    appleTouch: "/apple-touch-icon.png",
    android192: "/android-chrome-192x192.png",
    android512: "/android-chrome-512x512.png",
    safariPinned: "/safari-pinned-tab.svg",
  },

  // Theme
  theme: {
    color: "#ffffff",
    backgroundColor: "#000000",
    tileColor: "#000000",
  },
} as const;

// Page Metadata
export const PAGES = {
  home: {
    title: "Club Bayard - Centre Équestre | Cours d'Équitation & Pension",
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
