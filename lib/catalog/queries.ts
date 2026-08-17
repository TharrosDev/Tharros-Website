import { PRODUCTS } from "./products";
/**
 * Which frame of a piece to show is a catalogue question, so it is answered
 * behind the same seam as everything else a component is allowed to read.
 */
export {
  orderedImages,
  heroImage,
  cardImages,
  galleryImages,
  onBodyImages,
  inSituImages,
  detailImages,
  thumbnailImage,
} from "./images";
import { getModel, type ModelProfile } from "./models";
import type {
  Availability,
  CategoryId,
  ImageSlotData,
  Product,
  ProductQuery,
  Size,
  SortKey,
  Variant,
} from "./types";

/** A fitting credit with its model resolved. Never produced without both halves. */
export type ResolvedCredit = {
  model: ModelProfile;
  size: Size;
  image?: ImageSlotData;
};

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

/**
 * Apply a sort to a list that has already been assembled.
 *
 * `listProducts` sorts what it filters, but search results come out of
 * `searchProducts` in relevance order and had no way to be re-sorted — so the
 * sort links on a search page changed the URL and nothing else. Sold-out pieces
 * still sink to the bottom, exactly as they do in the grid: hiding them loses
 * the sense that the line is bigger than what is in stock.
 */
export function sortProducts(products: Product[], sort: SortKey = "featured"): Product[] {
  return [...products].sort((a, b) => {
    const buyable = Number(isPurchasable(b)) - Number(isPurchasable(a));
    return buyable || SORTERS[sort](a, b);
  });
}

/** The other half of the same seam: narrowing a list the caller already holds. */
export function filterProducts(products: Product[], query: ProductQuery = {}): Product[] {
  const { category = "all", drop, isNew } = query;
  return products.filter((product) => {
    if (category !== "all" && product.category !== category) return false;
    if (drop && product.drop !== drop) return false;
    if (isNew && !product.isNew) return false;
    return true;
  });
}

export function listProducts(query: ProductQuery = {}): Product[] {
  return sortProducts(filterProducts(PRODUCTS, query), query.sort ?? "featured");
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

/**
 * Look a piece up by its id rather than its route.
 *
 * The bag and the wishlist both store `product.id`, and both used to resolve it
 * through `getProduct`, which matches on `slug`. That works only because every
 * product currently declares the same string for both — an undocumented
 * coupling with nothing enforcing it. One new piece whose slug differed from its
 * id would silently empty somebody's saved list and drop their bag lines, with
 * no error anywhere. Storage lookups go through here instead.
 */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function allProductSlugs(): string[] {
  return PRODUCTS.map((product) => product.slug);
}

export function getFeatured(limit = 4): Product[] {
  return listProducts({ sort: "featured" }).slice(0, limit);
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

/**
 * The people photographed in a piece, resolved against the model register.
 *
 * Returns `[]` whenever either side is missing, which is every product today.
 * A credit naming a model who is not in the register is dropped rather than
 * rendered with a blank name — a half-resolved credit is a claim about a person
 * that nobody made.
 */
export function onBodyCredits(product: Product): ResolvedCredit[] {
  if (!product.onBody?.length) return [];

  return product.onBody.flatMap((credit) => {
    const model = getModel(credit.modelId);
    if (!model) return [];
    const image = credit.imageCode
      ? product.images.find((slot) => slot.code === credit.imageCode)
      : undefined;
    return [{ model, size: credit.size, image }];
  });
}

/**
 * The fit line — "Jae is 183 cm and wears a size M."
 *
 * Composed only from values that exist. An unmeasured height is omitted, never
 * guessed and never replaced with a typical figure, so the sentence gets
 * shorter rather than less true.
 */
export function fitNote(product: Product): string | null {
  const credit = onBodyCredits(product)[0];
  if (!credit) return null;

  const { model, size } = credit;
  return model.heightCm === null
    ? `${model.name} wears a size ${size}.`
    : `${model.name} is ${model.heightCm} cm and wears a size ${size}.`;
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
