export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "OS";

export const APPAREL_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

export type CategoryId =
  | "t-shirts"
  | "hoodies"
  | "sweatshirts"
  | "pants"
  | "outerwear"
  | "accessories";

export type Category = {
  id: CategoryId;
  name: string;
  slug: string;
  /** Sizing table this category reads from. `null` = one size / not sized. */
  sizingKey: "top" | "bottom" | null;
};

/**
 * What the storefront is allowed to say about stock.
 * Never assigned by hand — `resolveAvailability` derives it from inventory so
 * scarcity can only be shown when the numbers back it.
 */
export type Availability =
  | "available"
  | "low-stock"
  | "sold-out"
  | "coming-soon"
  | "preorder";

/** Release posture, set in data. Inventory decides the rest. */
export type ReleaseState = "released" | "coming-soon" | "preorder";

export type ImageKind = "front" | "back" | "detail" | "lifestyle" | "model";

export type Ratio = "portrait" | "editorial" | "campaign" | "wide" | "square";

/**
 * An image slot. `src` is intentionally optional: until real photography
 * exists, the slot renders as a ratio-correct frame carrying `code` and `alt`.
 * Adding a photograph is a one-line data change — no layout moves.
 */
export type ImageSlotData = {
  code: string;
  alt: string;
  kind: ImageKind;
  ratio: Ratio;
  src?: string;
};

export type Variant = {
  size: Size;
  sku: string;
  /** Units on hand. 0 = that size cannot be added to the bag. */
  inventory: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  /** One or two sentences, shown under the price. */
  description: string;
  /** Longer editorial paragraph for the DESCRIPTION accordion. */
  story: string;
  /** Minor units (cents) so arithmetic never touches floats. */
  price: number;
  compareAtPrice?: number;
  category: CategoryId;
  collections: string[];
  colorway: string;
  images: ImageSlotData[];
  variants: Variant[];
  materials: string[];
  fit: string[];
  care: string[];
  featured: boolean;
  isNew: boolean;
  release: ReleaseState;
  /** ISO date — drives "Newest" sort and the drop ordering. */
  releasedAt: string;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  season: string;
  statement: string;
  body: string[];
  cover: ImageSlotData;
};

export type LookbookSpread = {
  id: string;
  /** Layout the spread claims on the page. */
  layout: "full" | "pair" | "offset" | "stack";
  caption: string;
  index: string;
  images: ImageSlotData[];
  /** Product slugs worn in the spread, linked quietly beneath the caption. */
  wearing: string[];
};

export type JournalBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "image"; image: ImageSlotData };

export type JournalEntry = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
  cover: ImageSlotData;
  blocks: JournalBlock[];
};

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

export type ProductQuery = {
  category?: CategoryId | "all";
  collection?: string;
  isNew?: boolean;
  sort?: SortKey;
};
