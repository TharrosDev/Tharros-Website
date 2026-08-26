import { PRODUCTS } from "./products";
import { STORE_OPEN } from "@/lib/commerce/state";
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
import { getDrop } from "./drops";
import { CAMPAIGNS } from "./campaign";
import type {
  Availability,
  CategoryId,
  Drop,
  ImageSlotData,
  Product,
  ProductQuery,
  Size,
  SortKey,
  Variant,
} from "./types";

/** One editorial frame a piece appears in, flattened out of the campaigns. */
export type FeaturedFrame = {
  id: string;
  index: string;
  image: ImageSlotData;
  caption?: string;
  href: string;
};

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

  const stock = totalInventory(product);
  if (stock === 0) return "sold-out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "available";
}

/**
 * Can this piece be put in a bag right now?
 *
 * Two conditions, and the first one is the storefront's rather than the
 * piece's: while `STORE_OPEN` is false nothing is purchasable, because no
 * payment provider is connected and a purchase path that cannot complete is
 * worse than no purchase path. Every add-to-bag control, quick-add strip and
 * size selector on the site asks this question, so standing the shop down is
 * one flag rather than a sweep through the components.
 */
export function isPurchasable(product: Product): boolean {
  if (!STORE_OPEN) return false;
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

/**
 * One vocabulary for stock, used everywhere.
 *
 * The site ran two: `sold-out` rendered as "Archived" on a badge and as "Sold
 * out" in a filter, and `coming-soon` rendered as "In development" in four
 * places and "Coming soon" in one. Two words for one state is two states as
 * far as a reader is concerned. These are the words, and nothing else names a
 * stock condition in its own copy.
 */
export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: "Available",
  "low-stock": "Low stock",
  "sold-out": "Sold out",
  "coming-soon": "Coming soon",
};

/** The states a shopper can filter on, in the order the bar offers them. */
export const AVAILABILITY_FILTERS: Availability[] = [
  "available",
  "coming-soon",
  "sold-out",
];

export function isAvailabilityKey(
  value: string | undefined,
): value is Availability {
  return (
    value === "available" ||
    value === "low-stock" ||
    value === "sold-out" ||
    value === "coming-soon"
  );
}

/** Schema.org ItemAvailability, for Product JSON-LD. */
export const AVAILABILITY_SCHEMA: Record<Availability, string> = {
  available: "https://schema.org/InStock",
  "low-stock": "https://schema.org/LimitedAvailability",
  "sold-out": "https://schema.org/SoldOut",
  "coming-soon": "https://schema.org/PreOrder",
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
  const { category = "all", drop, isNew, availability } = query;
  return products.filter((product) => {
    if (category !== "all" && product.category !== category) return false;
    if (drop && product.drop !== drop) return false;
    if (isNew && !product.isNew) return false;
    // "Available" means a shopper can see it on the rail, so low stock counts
    // as available rather than as its own filter — nobody browses for the
    // pieces that are nearly gone.
    if (availability) {
      const state = resolveAvailability(product);
      const matches =
        availability === "available"
          ? state === "available" || state === "low-stock"
          : state === availability;
      if (!matches) return false;
    }
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

/**
 * The drops that actually hold a piece, newest first, with the count each one
 * released.
 *
 * The shop browses by release rather than by facet, so this is the axis the
 * filter bar is built on. Derived from the catalogue rather than from
 * `DROPS`, so a drop announced but not yet stocked cannot appear as an empty
 * view — the same reasoning as `categoriesInUse()`.
 */
export function dropsInUse(): { drop: Drop; count: number }[] {
  const counts = new Map<string, number>();
  for (const product of PRODUCTS) {
    counts.set(product.drop, (counts.get(product.drop) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([id, count]) => ({ drop: getDrop(id), count }))
    .filter(
      (entry): entry is { drop: Drop; count: number } => entry.drop !== undefined,
    )
    .sort((a, b) => b.drop.index.localeCompare(a.drop.index));
}

/**
 * Every editorial frame a piece appears in, in the order the site shows them.
 *
 * Campaign frames only. It also flattened the lookbook spreads until the
 * lookbook page was removed — a second set of photographs of the same drop,
 * on its own route.
 *
 * The link ran one way before this: a frame lists what is worn in it, and
 * nothing on a product page said the piece had been photographed at all.
 * Someone landing on a piece from search met a gallery and a spec table while
 * the campaign it was shot for sat two clicks away, unmentioned.
 */
export function framesFeaturing(slug: string): FeaturedFrame[] {
  const frames: FeaturedFrame[] = [];

  for (const campaign of CAMPAIGNS) {
    for (const frame of [campaign.hero, ...campaign.sequence]) {
      if (frame.wearing.includes(slug)) {
        frames.push({
          id: frame.id,
          index: frame.index,
          image: frame.image,
          caption: frame.caption,
          href: "/drop",
        });
      }
    }
  }

  return frames;
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
