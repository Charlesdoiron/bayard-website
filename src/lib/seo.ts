import { SITE_CONFIG } from "./constants";

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
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
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.business.address.street,
      addressLocality: SITE_CONFIG.business.address.city,
      postalCode: SITE_CONFIG.business.address.postalCode,
      addressCountry: SITE_CONFIG.business.address.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_CONFIG.business.phone,
      email: SITE_CONFIG.business.email,
      contactType: "customer service",
      areaServed: "FR",
      availableLanguage: ["French"],
    },
    sameAs: [
      SITE_CONFIG.business.social.facebook,
      SITE_CONFIG.business.social.instagram,
    ],
  };
}

/**
 * Generate Service structured data for equestrian services
 */
export function generateServiceSchemas() {
  return SITE_CONFIG.services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.serviceType,
    name: service.name,
    description: service.description,
    provider: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: SITE_CONFIG.url,
      servicePhone: SITE_CONFIG.business.phone,
    },
  }));
}

/**
 * Generate enhanced LocalBusiness schema
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
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
    image: `${SITE_CONFIG.url}${SITE_CONFIG.images.ogImage}`,
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
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services Équestres",
      itemListElement: SITE_CONFIG.services.map((service, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
        },
        position: index + 1,
      })),
    },
  };
}

/**
 * Generate complete structured data graph for the site
 */
export function generateStructuredDataGraph() {
  const baseUrl = SITE_CONFIG.url;
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      generateLocalBusinessSchema(),
      {
        "@type": "SportsActivityLocation",
        "@id": `${baseUrl}/#sports-facility`,
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
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: SITE_CONFIG.name,
        description: `Site officiel du ${SITE_CONFIG.name}, centre équestre`,
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        inLanguage: SITE_CONFIG.language,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      ...generateServiceSchemas(),
    ],
  };
}

