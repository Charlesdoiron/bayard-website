"use client";

import { generateBreadcrumbList } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";

interface BreadcrumbsProps {
  items: Array<{ name: string; url: string }>;
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  // Generate structured data
  const breadcrumbSchema = generateBreadcrumbList([
    { name: "Accueil", url: SITE_CONFIG.url },
    ...items,
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <nav
        aria-label="Fil d'Ariane"
        className={`breadcrumbs ${className}`}
        style={{ display: "none" }}
      >
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <a href={SITE_CONFIG.url} className="text-gray-500 hover:text-gray-700">
              Accueil
            </a>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {index === items.length - 1 ? (
                <span className="text-gray-900 font-medium">{item.name}</span>
              ) : (
                <a href={item.url} className="text-gray-500 hover:text-gray-700">
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

