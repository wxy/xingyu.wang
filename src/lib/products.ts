// Product data types and registry for Chrome Extensions, Android Apps, and other projects

export type ProductType = "extension" | "app";

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  type: ProductType;
  icon: string; // emoji or path to icon image
  coverImage?: string;
  url?: string; // external link (Chrome Web Store, Google Play, etc.)
  technologies: string[];
  features: string[];
  screenshots?: string[]; // paths to screenshots
  featured: boolean;
}

export const extensions: Product[] = [
  {
    slug: "example-extension",
    name: "Example Extension",
    tagline: "A useful Chrome extension that solves a problem",
    description:
      "Detailed description of what this extension does, how it helps users, and why it's worth installing. Replace this with your actual extension details.",
    type: "extension",
    icon: "🧩",
    url: "https://chromewebstore.google.com",
    technologies: ["JavaScript", "Chrome APIs", "HTML/CSS"],
    features: [
      "Feature one — describe what it does",
      "Feature two — describe the benefit",
      "Feature three — describe how it helps",
    ],
    featured: true,
  },
];

export const apps: Product[] = [
  {
    slug: "example-app",
    name: "Example App",
    tagline: "A handy Android application for everyday use",
    description:
      "Detailed description of what this app does, its main use cases, and why users love it. Replace this with your actual app details.",
    type: "app",
    icon: "📱",
    url: "https://play.google.com",
    technologies: ["Kotlin", "Jetpack Compose", "Room DB"],
    features: [
      "Feature one — describe what it does",
      "Feature two — describe the benefit",
      "Feature three — describe how it helps",
    ],
    featured: true,
  },
];

// Get all products combined
export function getAllProducts(): Product[] {
  return [...extensions, ...apps];
}

// Get featured products for homepage
export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((p) => p.featured);
}

// Find a product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}
