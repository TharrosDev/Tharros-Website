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

/**
 * What a slot holds. `campaign` is an environment frame that leads a page — it
 * is not a product shot and never appears in a product gallery.
 */
export type ImageKind =
  | "front"
  | "back"
  | "detail"
  | "lifestyle"
  | "model"
  | "campaign";

/**
 * How a person shot is framed. Only meaningful on `model`, `lifestyle` and
 * `campaign` slots — a flat lay has no crop.
 */
export type Crop = "full" | "three-quarter" | "close" | "walking";

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
  crop?: Crop;
  /**
   * Manual override of the discovery ladder in `lib/catalog/images.ts`. Lower
   * sorts first. Set it when one particular frame is the best picture of a
   * piece regardless of what kind it is.
   */
  rank?: number;
};

export type Variant = {
  size: Size;
  sku: string;
  /** Units on hand. 0 = that size cannot be added to the bag. */
  inventory: number;
};

/**
 * How a run is treated once it sells through. Drives the only restock claim
 * the storefront is allowed to make.
 */
export type RestockPolicy = "none" | "possible";

/**
 * Who is wearing the piece in the on-body frames, and the size they actually
 * wore. Absent until a fitting has happened — see `lib/catalog/models.ts`.
 */
export type OnBodyCredit = {
  modelId: string;
  size: Size;
  /** Ties the credit to one frame, for when more than one person is shot in a piece. */
  imageCode?: string;
};

/**
 * A piece's own garment measurements — the numbers someone who cannot touch
 * the clothes buys on.
 *
 * `table` names which set of columns the values line up with (`SIZE_TABLES` in
 * `lib/catalog/sizing.ts`), so a row is a plain array in that table's order and
 * nothing has to repeat the column names per product. A `null` is a
 * measurement nobody has taken yet, and renders as an em dash exactly like the
 * category table does — a piece may ship a chest and a length before its
 * sleeve has been measured.
 *
 * Absent entirely means no fitting has happened, which the product page states
 * rather than hides.
 */
export type PieceMeasurements = {
  table: "top" | "bottom";
  /** Size → one value per column of the named table, in inches. */
  rows: Partial<Record<Size, (number | null)[]>>;
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
  /** The drop this piece was released in. */
  drop: string;
  /**
   * How many were made. Real number, not a marketing figure — the storefront
   * shows it verbatim and derives "x left" from it.
   */
  runSize: number;
  restock: RestockPolicy;
  colorway: string;
  images: ImageSlotData[];
  /** Fitting credits for the on-body frames. Absent until someone has been photographed in it. */
  onBody?: OnBodyCredit[];
  /** This piece's own measured garment dimensions. Absent until it is measured. */
  measurements?: PieceMeasurements;
  variants: Variant[];
  /** The swing-tag line. Always present — the shortest true thing about the cloth. */
  materials: string[];
  fit: string[];
  care: string[];
  featured: boolean;
  isNew: boolean;
  release: ReleaseState;
  /** ISO date — drives "Newest" sort and the drop ordering. */
  releasedAt: string;
};

/**
 * A drop is the unit THARROS releases in: a small, numbered, dated batch of
 * pieces. Everything the storefront calls a "collection" is one of these.
 */
export type Drop = {
  id: string;
  /** Zero-padded, shown in the mono layer: 001, 002. */
  index: string;
  name: string;
  slug: string;
  statement: string;
  body: string[];
  /** ISO date, or null while a drop is still in development. */
  releasedAt: string | null;
  status: "released" | "in-development";
  cover: ImageSlotData;
};

/**
 * A point on a campaign frame that identifies a garment in it, as a percentage
 * of the frame from the top left. Only meaningful against a real photograph —
 * see `components/campaign/FrameHotspots.tsx`, which refuses to render without
 * one.
 */
export type Hotspot = {
  productSlug: string;
  x: number;
  y: number;
};

/**
 * One frame of a campaign: a picture of people in the clothes, and the pieces
 * they are wearing. The `wearing` list is what turns an editorial image into a
 * way into the shop.
 */
export type CampaignFrame = {
  id: string;
  /** Shown in the mono layer beside the frame. */
  index: string;
  image: ImageSlotData;
  /** A line set with the frame. Most frames carry none. */
  line?: string;
  caption?: string;
  /** Product slugs worn in the frame. */
  wearing: string[];
  /** Model ids, resolved against `lib/catalog/models.ts`. Empty until a shoot happens. */
  models?: string[];
  hotspots?: Hotspot[];
};

export type Campaign = {
  /** The drop this campaign documents. */
  drop: string;
  hero: CampaignFrame;
  /** The editorial sequence — "the people". */
  sequence: CampaignFrame[];
};

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

export type ProductQuery = {
  category?: CategoryId | "all";
  drop?: string;
  isNew?: boolean;
  sort?: SortKey;
};
