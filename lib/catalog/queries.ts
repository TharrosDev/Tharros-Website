import { PRODUCTS } from "./products";
import type {
  Availability,
  CategoryId,
  Product,
  ProductQuery,
  SortKey,
  Variant,
} from "./types";

/** At or below this unit count a product reads LOW STOCK. */
export const LOW_STOCK_THRESHOLD = 6;

export function totalInventory(product: Product): number {
  return product.variants.reduce((sum, variant) => sum + variant.inventory, 0);
}

/**
 * The only place availability is decided. Release posture wins, then the real
 * numbers — so the storefront can never claim scarcity the inventory doesn't
 * support.
 */
export function resolveAvailability(product: Product): Availability {
  if (product.release === "coming-soon") return "coming-soon";
  if (product.release === "preorder") return "preorder";

  const stock = totalInventory(product);
  if (stock === 0) return "sold-out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "available";
}

export function isPurchasable(product: Product): boolean {
  const availability = resolveAvailability(product);
  return availability === "available" || availability === "low-stock";
}

export function variantFor(product: Product, size: string): Variant | undefined {
  return product.variants.find((variant) => variant.size === size);
}

export function isSizeAvailable(product: Product, size: string): boolean {
  if (!isPurchasable(product)) return false;
  return (variantFor(product, size)?.inventory ?? 0) > 0;
}

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: "Available",
  "low-stock": "Low stock",
  "sold-out": "Sold out",
  "coming-soon": "Coming soon",
  preorder: "Preorder",
};

/** Schema.org ItemAvailability, for Product JSON-LD. */
export const AVAILABILITY_SCHEMA: Record<Availability, string> = {
  available: "https://schema.org/InStock",
  "low-stock": "https://schema.org/LimitedAvailability",
  "sold-out": "https://schema.org/SoldOut",
  "coming-soon": "https://schema.org/PreOrder",
  preorder: "https://schema.org/PreOrder",
};

const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) =>
    Number(b.featured) - Number(a.featured) ||
    b.releasedAt.localeCompare(a.releasedAt),
  newest: (a, b) => b.releasedAt.localeCompare(a.releasedAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
};

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low → High" },
  { key: "price-desc", label: "Price: High → Low" },
];

export function isSortKey(value: string | undefined): value is SortKey {
  return value === "featured" || value === "newest" || value === "price-asc" || value === "price-desc";
}

export function listProducts(query: ProductQuery = {}): Product[] {
  const { category = "all", drop, isNew, sort = "featured" } = query;

  const filtered = PRODUCTS.filter((product) => {
    if (category !== "all" && product.category !== category) return false;
    if (drop && product.drop !== drop) return false;
    if (isNew && !product.isNew) return false;
    return true;
  });

  // Sold-out and unreleased pieces stay in the grid but sink to the bottom;
  // hiding them loses the sense that the line is bigger than what is in stock.
  return filtered.sort((a, b) => {
    const buyable = Number(isPurchasable(b)) - Number(isPurchasable(a));
    return buyable || SORTERS[sort](a, b);
  });
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function allProductSlugs(): string[] {
  return PRODUCTS.map((product) => product.slug);
}

export function getFeatured(limit = 4): Product[] {
  return listProducts({ sort: "featured" }).slice(0, limit);
}

export function getNewArrivals(limit?: number): Product[] {
  const items = listProducts({ isNew: true, sort: "newest" });
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

/**
 * Same category first, then anything sharing a collection. Never returns the
 * product itself, and never pads the list with sold-out pieces if buyable ones
 * are available.
 */
export function getRelated(product: Product, limit = 4): Product[] {
  const scored = PRODUCTS.filter((candidate) => candidate.id !== product.id).map(
    (candidate) => {
      let score = 0;
      if (candidate.category === product.category) score += 3;
      if (candidate.drop === product.drop) score += 2;
      if (candidate.featured) score += 1;
      if (!isPurchasable(candidate)) score -= 4;
      return { candidate, score };
    },
  );

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

/**
 * What is left of the run. Both numbers are real: `runSize` is how many were
 * made, and `remaining` counts actual variant inventory. A piece can never
 * claim to be scarcer than it is.
 */
export function runStatus(product: Product): {
  made: number;
  remaining: number;
  neverRestocked: boolean;
} {
  return {
    made: product.runSize,
    remaining: totalInventory(product),
    neverRestocked: product.restock === "none",
  };
}

/** Only the categories that currently hold a piece — a small line does not
 *  need a filter bar full of empty rails. */
export function categoriesInUse(): CategoryId[] {
  return [...new Set(PRODUCTS.map((product) => product.category))];
}

export function searchProducts(term: string, limit = 8): Product[] {
  const query = term.trim().toLowerCase();
  if (query.length < 2) return [];

  const tokens = query.split(/\s+/);

  const scored = PRODUCTS.map((product) => {
    const haystack = [
      product.name,
      product.category,
      product.colorway,
      product.description,
      product.drop,
    ]
      .join(" ")
      .toLowerCase();

    const score = tokens.reduce((total, token) => {
      if (product.name.toLowerCase().startsWith(token)) return total + 5;
      if (product.name.toLowerCase().includes(token)) return total + 3;
      if (haystack.includes(token)) return total + 1;
      return total;
    }, 0);

    return { product, score };
  }).filter((entry) => entry.score > 0);

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.product);
}
