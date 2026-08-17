/**
 * PLACEHOLDER CATALOG.
 *
 * Every product below is placeholder content standing in for the real THARROS
 * line: names, prices, copy, specifications, run sizes and inventory counts are
 * invented for layout and commerce purposes and must be replaced before launch.
 * No product carries photography yet — image slots render as ratio-correct
 * frames until `src` is filled in.
 *
 * The catalogue is deliberately small. THARROS releases in drops of a few
 * pieces rather than maintaining a permanent inventory, and `runSize` is the
 * real number made — the storefront prints it verbatim and derives what is left
 * from actual variant inventory. Do not inflate either to look bigger.
 *
 * This module is the single seam a CMS or database swaps in behind: everything
 * that reads products goes through `lib/catalog/queries.ts`.
 */
import type { Product, Size, Variant } from "./types";

const SKU_PREFIX = "TH";

function sized(code: string, stock: Partial<Record<Size, number>>): Variant[] {
  return (Object.keys(stock) as Size[]).map((size) => ({
    size,
    sku: `${SKU_PREFIX}-${code}-${size}`,
    inventory: stock[size] ?? 0,
  }));
}

/**
 * The shot list every piece is planned to have.
 *
 * These are declared, not taken — like the four before them, they name frames
 * the shoot is meant to produce so the layouts can be built against a real set
 * rather than a guess. Order here is authoring order only: what the site
 * actually shows is decided by the ladder in `lib/catalog/images.ts`, so a
 * piece that ends up with three of these frames instead of six still renders
 * correctly.
 */
function shots(code: string, name: string): Product["images"] {
  return [
    { code: `${code}-01`, alt: `${name}, front view, laid flat`, kind: "front", ratio: "portrait" },
    { code: `${code}-02`, alt: `${name}, back view, laid flat`, kind: "back", ratio: "portrait" },
    { code: `${code}-03`, alt: `${name}, close detail of fabric and construction`, kind: "detail", ratio: "editorial" },
    { code: `${code}-04`, alt: `Model wearing the ${name}, full length`, kind: "model", ratio: "portrait", crop: "full" },
    { code: `${code}-05`, alt: `Model wearing the ${name}, walking`, kind: "lifestyle", ratio: "editorial", crop: "walking" },
    { code: `${code}-06`, alt: `Model wearing the ${name}, close`, kind: "model", ratio: "portrait", crop: "close" },
  ];
}

const CARE = [
  "Machine wash cold, inside out.",
  "Tumble dry low or hang to dry.",
  "Do not bleach. Do not iron directly on print.",
];

export const PRODUCTS: Product[] = [
  {
    id: "core-tee",
    name: "Core Tee",
    slug: "core-tee",
    description: "The foundation piece. Heavyweight cotton, boxy through the body.",
    story:
      "The first pattern that felt finished. Cut wide through the chest and shoulder with a shortened body, so it holds its shape instead of draping. The wordmark sits small at the left chest — the point is the silhouette, not the branding. Three fits were made before this one; the other two were too long.",
    price: 7000,
    category: "t-shirts",
    drop: "drop-001",
    runSize: 40,
    restock: "possible",
    colorway: "Washed Black",
    images: shots("CORE-TEE", "Core Tee"),
    variants: sized("CORE-TEE", { XS: 2, S: 5, M: 7, L: 6, XL: 3, XXL: 1 }),
    materials: ["Heavyweight cotton jersey", "Ribbed collar", "Tonal embroidery"],
    fit: ["Boxy fit", "Drops at the shoulder", "True to size"],
    care: CARE,
    featured: true,
    isNew: false,
    release: "released",
    releasedAt: "2026-05-02",
  },
  {
    id: "noise-silence-tee",
    name: "Noise / Silence Tee",
    slug: "noise-silence-tee",
    description: "Full-back graphic. Oversized cut, heavy hand-feel print.",
    story:
      "Two words, front and back, set at scale. NOISE across the chest, SILENCE across the back — the same garment read differently depending on which way you are walking. Printed heavy so the graphic sits on the fabric rather than in it.",
    price: 7500,
    category: "t-shirts",
    drop: "drop-001",
    runSize: 30,
    restock: "none",
    colorway: "Off White",
    images: shots("NS-TEE", "Noise / Silence Tee"),
    variants: sized("NS-TEE", { XS: 0, S: 1, M: 2, L: 1, XL: 2, XXL: 1 }),
    materials: ["Heavyweight cotton jersey", "Screen-printed graphic"],
    fit: ["Oversized fit", "Size down for a regular fit"],
    care: CARE,
    featured: true,
    isNew: false,
    release: "released",
    releasedAt: "2026-05-02",
  },
  {
    id: "arc-hoodie",
    name: "Arc Hoodie",
    slug: "arc-hoodie",
    description: "Heavyweight fleece with a double-layer hood.",
    story:
      "Built dense enough to hold structure through the hood and shoulder. The arc graphic runs low across the back, breaking at the side seams. Cuffs and hem are ribbed tight so the body keeps its volume. The heaviest thing in the drop, and the one that took the most sampling.",
    price: 18000,
    category: "hoodies",
    drop: "drop-001",
    runSize: 24,
    restock: "possible",
    colorway: "Black",
    images: shots("ARC-HOOD", "Arc Hoodie"),
    variants: sized("ARC-HOOD", { XS: 1, S: 3, M: 4, L: 3, XL: 2, XXL: 0 }),
    materials: ["Heavyweight brushed-back fleece", "Double-layer hood", "Metal-tipped drawcord"],
    fit: ["Relaxed fit", "Dropped shoulder", "True to size"],
    care: CARE,
    featured: true,
    isNew: false,
    release: "released",
    releasedAt: "2026-05-02",
  },
  {
    id: "monument-crewneck",
    name: "Monument Crewneck",
    slug: "monument-crewneck",
    description: "Structured crewneck with a raised chest hit.",
    story:
      "A crewneck with weight to it. Raised chest graphic, ribbing carried through the collar, cuff and hem so it holds a clean line under outerwear.",
    price: 15000,
    category: "sweatshirts",
    drop: "drop-001",
    runSize: 20,
    restock: "possible",
    colorway: "Bone",
    images: shots("MON-CREW", "Monument Crewneck"),
    variants: sized("MON-CREW", { XS: 1, S: 2, M: 3, L: 3, XL: 1, XXL: 0 }),
    materials: ["Heavyweight loopback cotton", "Raised print", "Ribbed trims"],
    fit: ["Regular fit", "True to size"],
    care: CARE,
    featured: false,
    isNew: false,
    release: "released",
    releasedAt: "2026-05-02",
  },
  {
    id: "utility-cargo-pant",
    name: "Utility Cargo Pant",
    slug: "utility-cargo-pant",
    description: "Wide leg, articulated knee, six pockets.",
    story:
      "Cut wide from the hip with an articulated knee so the leg stacks properly over a boot. Pockets are placed to carry weight without pulling the silhouette out of shape. The hardest pattern in the drop and the one most likely to change next time.",
    price: 19000,
    category: "pants",
    drop: "drop-001",
    runSize: 18,
    restock: "possible",
    colorway: "Black",
    images: shots("UTL-CARGO", "Utility Cargo Pant"),
    variants: sized("UTL-CARGO", { XS: 0, S: 2, M: 3, L: 2, XL: 1, XXL: 0 }),
    materials: ["Cotton twill", "Reinforced bar-tacking", "Adjustable hem drawcord"],
    fit: ["Wide leg", "Mid rise", "Stacks over footwear"],
    care: CARE,
    featured: false,
    isNew: false,
    release: "released",
    releasedAt: "2026-05-02",
  },
  {
    id: "logo-cap",
    name: "Logo Cap",
    slug: "logo-cap",
    description: "Unstructured six-panel with a low embroidered wordmark.",
    story:
      "Unstructured so it collapses flat and sits low. The wordmark is embroidered small on the front panel and repeated on the back strap.",
    price: 6000,
    category: "accessories",
    drop: "drop-001",
    runSize: 30,
    restock: "possible",
    colorway: "Black",
    images: shots("LOGO-CAP", "Logo Cap"),
    variants: sized("LOGO-CAP", { OS: 11 }),
    materials: ["Cotton twill", "Embroidered wordmark", "Adjustable strap"],
    fit: ["One size", "Adjustable"],
    care: ["Spot clean only.", "Do not machine wash."],
    featured: false,
    isNew: false,
    release: "released",
    releasedAt: "2026-05-02",
  },
  {
    id: "work-jacket",
    name: "Work Jacket",
    slug: "work-jacket",
    description: "Boxy cotton canvas with a four-pocket front.",
    story:
      "Built on a workwear pattern and squared off through the body. The canvas starts stiff and breaks in with wear, holding the shape of whoever wears it. Twelve were made and twelve went out — the pattern is being reworked for a later drop.",
    price: 30000,
    category: "outerwear",
    drop: "drop-001",
    runSize: 12,
    restock: "none",
    colorway: "Faded Black",
    images: shots("WRK-JKT", "Work Jacket"),
    variants: sized("WRK-JKT", { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 }),
    materials: ["Cotton canvas", "Corozo buttons", "Four-pocket front"],
    fit: ["Boxy fit", "Squared shoulder"],
    care: CARE,
    featured: false,
    isNew: false,
    release: "released",
    releasedAt: "2026-05-02",
  },

  // — Drop 002: patterned and sampled, not released ————————————————
  {
    id: "shell-jacket-01",
    name: "Shell Jacket 01",
    slug: "shell-jacket-01",
    description: "Technical outer layer. Taped seams, storm hood.",
    story:
      "The first piece cut for Drop 002 and the most technical thing attempted so far. Oversized to layer over the Arc Hoodie, with a storm hood that holds its shape and a hem that sits below the seat. Currently on its second sample.",
    price: 34000,
    category: "outerwear",
    drop: "drop-002",
    runSize: 0,
    restock: "possible",
    colorway: "Black",
    images: shots("SHL-01", "Shell Jacket 01"),
    variants: sized("SHL-01", { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 }),
    materials: ["Technical woven shell", "Taped seams", "Two-way zip"],
    fit: ["Oversized fit", "Layers over heavyweight fleece"],
    care: [
      "Machine wash cold on a gentle cycle.",
      "Do not tumble dry. Hang to dry.",
      "Do not iron. Do not dry clean.",
    ],
    featured: false,
    isNew: true,
    release: "coming-soon",
    releasedAt: "2026-09-12",
  },
  {
    id: "ribbed-beanie",
    name: "Ribbed Beanie",
    slug: "ribbed-beanie",
    description: "Fine-gauge rib with a woven label at the cuff.",
    story:
      "Knitted long so it can be worn cuffed short or pulled down. Label sits on the cuff, visible either way. Sampled and approved; waiting on the rest of Drop 002.",
    price: 5500,
    category: "accessories",
    drop: "drop-002",
    runSize: 0,
    restock: "possible",
    colorway: "Charcoal",
    images: shots("RIB-BEAN", "Ribbed Beanie"),
    variants: sized("RIB-BEAN", { OS: 0 }),
    materials: ["Fine-gauge rib knit", "Woven cuff label"],
    fit: ["One size"],
    care: ["Hand wash cold.", "Dry flat."],
    featured: false,
    isNew: true,
    release: "coming-soon",
    releasedAt: "2026-09-12",
  },
];
