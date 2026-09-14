import type {
  Audience,
  Category,
  Condition,
  Discipline,
  GoodiesCategory,
  SizeKind,
  SubCategory,
  Team,
  TeamSlug,
  Universe,
} from "./types";

/**
 * Category tree. Structure and naming follow the "Cavalier" and "Cheval"
 * sections of kramer.fr, trimmed to what makes sense for second-hand club
 * equipment (no feed, no dog section), plus a small "Écurie & pré" universe.
 */
export const UNIVERSES: { slug: Universe; label: string }[] = [
  { slug: "cavalier", label: "Cavalier" },
  { slug: "cheval", label: "Cheval & poney" },
  { slug: "ecurie", label: "Écurie & pré" },
];

export const CATEGORIES: Category[] = [
  // ---------------------------------------------------------------- Cavalier
  {
    slug: "pantalons",
    label: "Pantalons d'équitation",
    universe: "cavalier",
    children: [
      { slug: "pantalons-fond-integral", label: "Pantalons à fond intégral", sizeKind: "pantalon" },
      { slug: "pantalons-basanes", label: "Pantalons à basanes", sizeKind: "pantalon" },
      { slug: "pantalons-grip", label: "Pantalons à grip", sizeKind: "pantalon" },
      { slug: "leggings", label: "Leggings d'équitation", sizeKind: "pantalon" },
      { slug: "pantalons-hiver", label: "Pantalons d'hiver", sizeKind: "pantalon" },
      { slug: "jodhpurs", label: "Pantalons jodhpur", sizeKind: "pantalon" },
    ],
  },
  {
    slug: "hauts",
    label: "Hauts d'équitation",
    universe: "cavalier",
    children: [
      { slug: "t-shirts-polos", label: "T-shirts & polos", sizeKind: "vetement" },
      { slug: "pulls-cols-roules", label: "Pulls & cols roulés", sizeKind: "vetement" },
      { slug: "sweats-polaires", label: "Sweats, polaires & hoodies", sizeKind: "vetement" },
      { slug: "gilets", label: "Gilets d'équitation", sizeKind: "vetement" },
      { slug: "vestes-manteaux", label: "Vestes & manteaux", sizeKind: "vetement" },
      { slug: "vetements-pluie", label: "Vêtements de pluie", sizeKind: "vetement" },
    ],
  },
  {
    slug: "tenues-concours",
    label: "Tenues de concours",
    universe: "cavalier",
    children: [
      { slug: "vestes-concours", label: "Vestes de concours", sizeKind: "vetement" },
      { slug: "chemises-polos-concours", label: "Chemises & polos de concours", sizeKind: "vetement" },
      { slug: "cravates-lavallieres", label: "Cravates & lavallières", sizeKind: "aucune" },
      { slug: "tenues-equipe", label: "Tenues d'équipe", sizeKind: "vetement" },
    ],
  },
  {
    slug: "chaussures-bottes",
    label: "Chaussures & bottes",
    universe: "cavalier",
    children: [
      { slug: "bottes-equitation", label: "Bottes d'équitation", sizeKind: "pointure" },
      { slug: "bottes-hiver", label: "Bottes d'hiver", sizeKind: "pointure" },
      { slug: "boots-equitation", label: "Boots d'équitation", sizeKind: "pointure" },
      { slug: "boots-ecurie", label: "Boots d'écurie", sizeKind: "pointure" },
      { slug: "mini-chaps", label: "Mini-chaps", sizeKind: "vetement" },
      { slug: "accessoires-bottes", label: "Accessoires de bottes & boots", sizeKind: "aucune" },
    ],
  },
  {
    slug: "casques-protections",
    label: "Casques & gilets de protection",
    universe: "cavalier",
    children: [
      { slug: "casques", label: "Casques d'équitation", sizeKind: "tour-de-tete" },
      { slug: "gilets-protection", label: "Gilets de protection", sizeKind: "vetement" },
      { slug: "protections-dorsales", label: "Protections dorsales & airbags", sizeKind: "vetement" },
    ],
  },
  {
    slug: "gants",
    label: "Gants d'équitation",
    universe: "cavalier",
    children: [
      { slug: "gants-toutes-saisons", label: "Gants toutes saisons", sizeKind: "gant" },
      { slug: "gants-ete", label: "Gants d'été", sizeKind: "gant" },
      { slug: "gants-hiver", label: "Gants d'hiver", sizeKind: "gant" },
      { slug: "gants-enfants", label: "Gants enfants", sizeKind: "gant" },
    ],
  },
  {
    slug: "cravaches-eperons",
    label: "Cravaches, chambrières & éperons",
    universe: "cavalier",
    children: [
      { slug: "cravaches-saut", label: "Cravaches de saut", sizeKind: "aucune" },
      { slug: "cravaches-dressage", label: "Cravaches de dressage", sizeKind: "aucune" },
      { slug: "cravaches-polyvalentes", label: "Cravaches polyvalentes", sizeKind: "aucune" },
      { slug: "chambrieres", label: "Chambrières", sizeKind: "aucune" },
      { slug: "eperons", label: "Éperons & lanières", sizeKind: "aucune" },
    ],
  },
  {
    slug: "accessoires-cavalier",
    label: "Accessoires cavalier",
    universe: "cavalier",
    children: [
      { slug: "bonnets-casquettes", label: "Bonnets, bandeaux & casquettes", sizeKind: "aucune" },
      { slug: "ceintures", label: "Ceintures", sizeKind: "vetement" },
      { slug: "chaussettes", label: "Chaussettes", sizeKind: "pointure" },
      { slug: "echarpes", label: "Écharpes & tours de cou", sizeKind: "aucune" },
      { slug: "sacs-cavalier", label: "Sacs & bagagerie", sizeKind: "aucune" },
    ],
  },

  // ------------------------------------------------------------------ Cheval
  {
    slug: "selles",
    label: "Selles & accessoires",
    universe: "cheval",
    children: [
      { slug: "selles-mixtes", label: "Selles mixtes", sizeKind: "selle" },
      { slug: "selles-obstacle", label: "Selles d'obstacle", sizeKind: "selle" },
      { slug: "selles-dressage", label: "Selles de dressage", sizeKind: "selle" },
      { slug: "selles-poney", label: "Selles poney & shetland", sizeKind: "selle" },
      { slug: "etriers", label: "Étriers & accessoires", sizeKind: "aucune" },
      { slug: "etrivieres", label: "Étrivières", sizeKind: "aucune" },
      { slug: "sangles-courtes", label: "Sangles courtes", sizeKind: "sangle" },
      { slug: "sangles-longues", label: "Sangles longues", sizeKind: "sangle" },
      { slug: "housses-selle", label: "Housses de selle", sizeKind: "aucune" },
      { slug: "accessoires-selle", label: "Accessoires pour selles", sizeKind: "aucune" },
    ],
  },
  {
    slug: "briderie",
    label: "Briderie & accessoires",
    universe: "cheval",
    children: [
      { slug: "bridons", label: "Bridons & filets", sizeKind: "briderie" },
      { slug: "brides", label: "Brides", sizeKind: "briderie" },
      { slug: "bridons-sans-mors", label: "Bridons sans embouchure", sizeKind: "briderie" },
      { slug: "muserolles", label: "Muserolles", sizeKind: "briderie" },
      { slug: "frontaux", label: "Frontaux", sizeKind: "briderie" },
      { slug: "renes", label: "Rênes", sizeKind: "briderie" },
      { slug: "colliers-martingales", label: "Colliers de chasse & martingales", sizeKind: "briderie" },
      { slug: "enrenements", label: "Enrênements", sizeKind: "briderie" },
      { slug: "accessoires-briderie", label: "Accessoires de briderie", sizeKind: "aucune" },
    ],
  },
  {
    slug: "mors",
    label: "Mors",
    universe: "cheval",
    children: [
      { slug: "mors-simple-brisure", label: "Mors simple brisure", sizeKind: "mors" },
      { slug: "mors-double-brisure", label: "Mors double brisure", sizeKind: "mors" },
      { slug: "mors-droits", label: "Mors droits", sizeKind: "mors" },
      { slug: "mors-bride-pelham", label: "Mors de bride & pelham", sizeKind: "mors" },
      { slug: "mors-poney", label: "Mors pour poneys", sizeKind: "mors" },
      { slug: "accessoires-mors", label: "Accessoires pour mors", sizeKind: "aucune" },
    ],
  },
  {
    slug: "tapis-pads",
    label: "Tapis de selle & pads",
    universe: "cheval",
    children: [
      { slug: "tapis-selle", label: "Tapis de selle & chabraques", sizeKind: "tapis" },
      { slug: "amortisseurs", label: "Amortisseurs & pads", sizeKind: "tapis" },
      { slug: "bonnets", label: "Bonnets", sizeKind: "briderie" },
    ],
  },
  {
    slug: "protections",
    label: "Protections de travail",
    universe: "cheval",
    children: [
      { slug: "guetres", label: "Guêtres", sizeKind: "protection" },
      { slug: "protege-boulets", label: "Protège-boulets", sizeKind: "protection" },
      { slug: "cloches", label: "Cloches & protège-glomes", sizeKind: "protection" },
      { slug: "guetres-transport", label: "Guêtres de transport & d'écurie", sizeKind: "protection" },
      { slug: "bandes", label: "Bandes & sous-bandages", sizeKind: "aucune" },
      { slug: "hipposandales", label: "Hipposandales", sizeKind: "aucune" },
      { slug: "therapie-membres", label: "Articles de thérapie", sizeKind: "protection" },
    ],
  },
  {
    slug: "couvertures",
    label: "Chemises & couvertures",
    universe: "cheval",
    children: [
      { slug: "couvertures-exterieur", label: "Couvertures & chemises d'extérieur", sizeKind: "couverture" },
      { slug: "couvertures-ecurie", label: "Couvertures d'écurie", sizeKind: "couverture" },
      { slug: "chemises-sechantes", label: "Chemises séchantes & polaires", sizeKind: "couverture" },
      { slug: "chemises-anti-mouches", label: "Chemises anti-mouches", sizeKind: "couverture" },
      { slug: "couvre-reins", label: "Couvre-reins & couvertures de marcheur", sizeKind: "couverture" },
      { slug: "accessoires-couvertures", label: "Accessoires de couvertures", sizeKind: "aucune" },
    ],
  },
  {
    slug: "licols-longes",
    label: "Licols & longes",
    universe: "cheval",
    children: [
      { slug: "licols-synthetiques", label: "Licols synthétiques", sizeKind: "briderie" },
      { slug: "licols-cuir", label: "Licols en cuir", sizeKind: "briderie" },
      { slug: "licols-securite", label: "Licols de sécurité", sizeKind: "briderie" },
      { slug: "licols-noeuds", label: "Licols à nœuds", sizeKind: "briderie" },
      { slug: "licols-poney", label: "Licols poneys & poulains", sizeKind: "briderie" },
      { slug: "longes", label: "Longes", sizeKind: "aucune" },
    ],
  },
  {
    slug: "anti-mouches",
    label: "Protections anti-mouches",
    universe: "cheval",
    children: [
      { slug: "bonnets-anti-mouches", label: "Bonnets anti-mouches", sizeKind: "briderie" },
      { slug: "masques-anti-mouches", label: "Masques anti-mouches", sizeKind: "briderie" },
      { slug: "franges", label: "Franges anti-mouches", sizeKind: "briderie" },
    ],
  },
  {
    slug: "soins-pansage",
    label: "Soins & pansage",
    universe: "cheval",
    children: [
      { slug: "materiel-pansage", label: "Matériel de pansage", sizeKind: "aucune" },
      { slug: "coffres-sacs", label: "Coffres & sacs de pansage", sizeKind: "aucune" },
      { slug: "produits-soin", label: "Produits de soin", sizeKind: "aucune" },
      { slug: "tondeuses", label: "Tondeuses", sizeKind: "aucune" },
    ],
  },

  // ------------------------------------------------------------------ Écurie
  {
    slug: "ecurie",
    label: "Écurie & pré",
    universe: "ecurie",
    children: [
      { slug: "materiel-ecurie", label: "Matériel d'écurie", sizeKind: "aucune" },
      { slug: "rangement", label: "Rangement & transport", sizeKind: "aucune" },
      { slug: "pre-clotures", label: "Pré & clôtures", sizeKind: "aucune" },
      { slug: "divers", label: "Divers", sizeKind: "aucune" },
    ],
  },
];

const cm = (from: number, to: number, step: number) => {
  const out: string[] = [];
  for (let v = from; v <= to + 1e-9; v += step) {
    out.push(`${Number.isInteger(v) ? v : v.toFixed(1)} cm`);
  }
  return out;
};

const range = (from: number, to: number, step = 1, suffix = "") => {
  const out: string[] = [];
  for (let v = from; v <= to + 1e-9; v += step) {
    out.push(`${Number.isInteger(v) ? v : v.toFixed(1)}${suffix}`);
  }
  return out;
};

/** Size options per size kind. The "Taille" filter adapts to the chosen category. */
export const SIZE_OPTIONS: Record<SizeKind, string[]> = {
  "tour-de-tete": [...cm(49, 61, 1)],
  vetement: [
    "XXS", "XS", "S", "M", "L", "XL", "XXL",
    "4 ans", "6 ans", "8 ans", "10 ans", "12 ans", "14 ans", "16 ans",
  ],
  pantalon: [
    ...range(32, 50, 2),
    "4 ans", "6 ans", "8 ans", "10 ans", "12 ans", "14 ans", "16 ans",
  ],
  pointure: range(28, 47),
  gant: ["XS", "S", "M", "L", "XL", ...range(5, 10, 0.5)],
  selle: range(15, 18.5, 0.5, '"'),
  briderie: ["Shetland", "Poney", "Cob", "Full", "X-Full"],
  couverture: cm(95, 165, 5),
  protection: ["Shetland", "Poney", "Cob", "Full", "X-Full"],
  sangle: [...cm(40, 80, 5), ...cm(100, 150, 5)],
  mors: cm(9.5, 15.5, 0.5),
  tapis: ["Shetland", "Poney", "Cob", "Full"],
  aucune: [],
};

export const COLORS: { slug: string; label: string; hex: string }[] = [
  { slug: "noir", label: "Noir", hex: "#111111" },
  { slug: "blanc", label: "Blanc", hex: "#f5f5f5" },
  { slug: "bleu-marine", label: "Bleu marine", hex: "#1f2a55" },
  { slug: "bleu", label: "Bleu", hex: "#005896" },
  { slug: "bleu-clair", label: "Bleu clair", hex: "#8fc1e3" },
  { slug: "gris", label: "Gris", hex: "#9a9a9a" },
  { slug: "beige", label: "Beige", hex: "#d8c7a5" },
  { slug: "marron", label: "Marron", hex: "#6b4423" },
  { slug: "havane", label: "Havane", hex: "#a0522d" },
  { slug: "rouge", label: "Rouge", hex: "#b3261e" },
  { slug: "bordeaux", label: "Bordeaux", hex: "#6d1f2c" },
  { slug: "rose", label: "Rose", hex: "#e8a5c0" },
  { slug: "vert", label: "Vert", hex: "#2f6b3a" },
  { slug: "kaki", label: "Kaki", hex: "#7a7a4f" },
  { slug: "jaune", label: "Jaune", hex: "#e8c547" },
  { slug: "orange", label: "Orange", hex: "#e07b2a" },
  { slug: "violet", label: "Violet", hex: "#6a4c93" },
  { slug: "multicolore", label: "Multicolore", hex: "linear" },
];

/** Brand suggestions for the sell form and the "Marque" filter. */
export const BRANDS: string[] = [
  "Ariat", "Bucas", "Cavallo", "Cheval de Luxe", "CWD", "Equiline", "Equithème",
  "Eskadron", "Felix Bühler", "Fouganza", "Horse Pilot", "Horze", "HKM", "KEP",
  "Kentucky", "Kieffer", "Lami-Cell", "Pikeur", "Prestige", "Rambo", "Samshield",
  "Sprenger", "Tattini", "Uvex", "Veredus", "Waldhausen", "Wintec",
];

export const AUDIENCES: { slug: Audience; label: string }[] = [
  { slug: "cavalier-adulte", label: "Cavalier adulte" },
  { slug: "cavalier-enfant", label: "Cavalier enfant" },
  { slug: "cheval", label: "Cheval" },
  { slug: "poney", label: "Poney" },
  { slug: "shetland", label: "Shetland" },
];

export const CONDITIONS: { slug: Condition; label: string; help: string }[] = [
  { slug: "neuf-etiquette", label: "Neuf avec étiquette", help: "Jamais porté ni utilisé, étiquette ou emballage d'origine." },
  { slug: "tres-bon-etat", label: "Très bon état", help: "Peu utilisé, aucun défaut visible." },
  { slug: "bon-etat", label: "Bon état", help: "Utilisé, légères traces d'usage." },
  { slug: "satisfaisant", label: "Satisfaisant", help: "Usure visible, fonctionnel. Défauts décrits dans l'annonce." },
];

export const DISCIPLINES: { slug: Discipline; label: string }[] = [
  { slug: "cso", label: "CSO" },
  { slug: "dressage", label: "Dressage" },
  { slug: "cce", label: "CCE" },
  { slug: "hunter", label: "Hunter" },
  { slug: "pony-games", label: "Pony-games" },
  { slug: "equifun", label: "Equifun" },
  { slug: "loisir", label: "Loisir" },
];

export const TEAMS: Team[] = [
  {
    slug: "dressage",
    label: "Équipe Dressage",
    shortLabel: "Dressage",
    description:
      "Le dressage consiste à faire évoluer les chevaux afin de montrer l'élégance de leurs mouvements et leur facilité d'emploi.",
    image: "/compet_2.jpg",
  },
  {
    slug: "hunter",
    label: "Équipe Hunter",
    shortLabel: "Hunter",
    description:
      "Le hunter consiste à enchaîner un parcours d'obstacles avec la plus grande harmonie possible.",
    image: "/hunter.jpg",
  },
  {
    slug: "cce",
    label: "Équipe CCE",
    shortLabel: "CCE",
    description:
      "Le Concours Complet d'Équitation enchaîne trois tests : dressage, saut d'obstacles et cross.",
    image: "/cce_cheval.jpg",
  },
  {
    slug: "pony-games",
    label: "Équipe Pony-Games",
    shortLabel: "Pony-Games",
    description:
      "Sport d'équipe où chacun évolue individuellement : vitesse, habileté motrice et aisance à cheval.",
    image: "/pony_game.jpeg",
  },
  {
    slug: "equifun",
    label: "Équipe Equifun",
    shortLabel: "Equifun",
    description:
      "Un parcours de dispositifs au chronomètre : maniabilité, saut et adresse.",
    image: "/equifun.jpeg",
  },
];

export const GOODIES_CATEGORIES: { slug: GoodiesCategory; label: string }[] = [
  { slug: "textile", label: "Textile" },
  { slug: "accessoires-cavalier", label: "Accessoires cavalier" },
  { slug: "accessoires-cheval", label: "Accessoires cheval" },
  { slug: "tenue-equipe", label: "Tenue d'équipe" },
  { slug: "divers", label: "Divers" },
];

// ----------------------------------------------------------------- lookups

const categoryBySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));
const subCategoryIndex = new Map<string, { category: Category; sub: SubCategory }>();
for (const category of CATEGORIES) {
  for (const sub of category.children) {
    subCategoryIndex.set(sub.slug, { category, sub });
  }
}
const teamBySlug = new Map(TEAMS.map((t) => [t.slug, t]));

export const getCategory = (slug: string | undefined) =>
  slug ? categoryBySlug.get(slug) : undefined;

export const getSubCategory = (slug: string | undefined) =>
  slug ? subCategoryIndex.get(slug) : undefined;

export const getTeam = (slug: string | undefined): Team | undefined =>
  slug ? teamBySlug.get(slug as TeamSlug) : undefined;

export const isTeamSlug = (value: string): value is TeamSlug =>
  teamBySlug.has(value as TeamSlug);

export const getCondition = (slug: Condition) =>
  CONDITIONS.find((c) => c.slug === slug)!;

export const getAudienceLabel = (slug: Audience) =>
  AUDIENCES.find((a) => a.slug === slug)?.label ?? slug;

export const getDisciplineLabel = (slug: Discipline) =>
  DISCIPLINES.find((d) => d.slug === slug)?.label ?? slug;

export const getColor = (slug: string | undefined) =>
  slug ? COLORS.find((c) => c.slug === slug) : undefined;

export const getGoodiesCategoryLabel = (slug: GoodiesCategory) =>
  GOODIES_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

/**
 * Size options relevant to a category / sub-category selection.
 * With no selection, returns the union of every size kind (deduplicated).
 */
export function sizeOptionsFor(
  categorySlug?: string,
  subCategorySlug?: string,
): string[] {
  const sub = getSubCategory(subCategorySlug);
  if (sub) return SIZE_OPTIONS[sub.sub.sizeKind];
  const category = getCategory(categorySlug);
  const kinds = category
    ? new Set(category.children.map((c) => c.sizeKind))
    : new Set<SizeKind>(Object.keys(SIZE_OPTIONS) as SizeKind[]);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const kind of kinds) {
    for (const size of SIZE_OPTIONS[kind]) {
      if (!seen.has(size)) {
        seen.add(size);
        out.push(size);
      }
    }
  }
  return out;
}
