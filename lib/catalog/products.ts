/**
 * THE CATALOGUE.
 *
 * Prices are minor units, `runSize` is the real number made and
 * `variants[].inventory` is real stock — the storefront prints all three
 * verbatim and derives every "x left" from them, so neither can be inflated to
 * look bigger without the site saying something untrue.
 *
 * A piece carries no release date and no release state: both belong to the
 * drop it names in `drop`, and `queries.ts` reads them from there.
 *
 * This module is the seam a CMS or database swaps in behind. Nothing imports
 * it except `lib/catalog/queries.ts`.
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
 * These are declared, not taken — they name the frames the shoot is meant to
 * produce so the layouts can be built against a real set rather than a guess.
 * Order here is authoring order only: what the site actually shows is decided
 * by the ladder in `lib/catalog/images.ts`, so a piece that ends up with three
 * of these frames instead of six still renders correctly.
 *
 * The alt text describes the photograph, not the state of the shoot. Anything
 * about what has and has not been shot is a note for this repository and is
 * never allowed into an accessible name, a caption or a metadata field.
 */
function shots(code: string, name: string): Product["images"] {
  return [
    // Each slot declares the shape it is actually photographed at: a flat lay
    // is square, a detail is 3:4, a figure is 2:3. They were all rounded to
    // portrait or editorial before, which cropped a quarter off the width of
    // every flat lay and a sixth off the height of every figure.
    { code: `${code}-01`, alt: `${name}, front view, laid flat`, kind: "front", ratio: "square" },
    { code: `${code}-02`, alt: `${name}, back view, laid flat`, kind: "back", ratio: "square" },
    { code: `${code}-03`, alt: `${name}, close detail of fabric and construction`, kind: "detail", ratio: "portrait" },
    { code: `${code}-04`, alt: `Model wearing the ${name}, full length`, kind: "model", ratio: "tall", crop: "full" },
    { code: `${code}-05`, alt: `Model wearing the ${name}, walking`, kind: "lifestyle", ratio: "tall", crop: "walking" },
    { code: `${code}-06`, alt: `Model wearing the ${name}, close`, kind: "model", ratio: "tall", crop: "close" },
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
      "Heavyweight jersey with enough body to stand away from you. Cut wide through the chest and shoulder with a shortened hem, so it holds a square line instead of draping. The wordmark sits small at the left chest — the silhouette is the point, not the branding. Wears clean on its own and layers under the Work Jacket without bunching.",
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
  },
  {
    id: "noise-silence-tee",
    name: "Noise / Silence Tee",
    slug: "noise-silence-tee",
    description: "Full-back graphic. Oversized cut, heavy hand-feel print.",
    story:
      "Two words, front and back, set at scale. NOISE across the chest, SILENCE across the back — the same garment reads differently depending on which way you are walking. Printed heavy, so the graphic sits on the fabric with a hand you can feel rather than soaking into it. Cut long and wide; size down if you want it to sit closer.",
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
  },
  {
    id: "arc-hoodie",
    name: "Arc Hoodie",
    slug: "arc-hoodie",
    description: "Heavyweight fleece with a double-layer hood.",
    story:
      "The heaviest piece in the drop. Brushed-back fleece dense enough to hold structure through the hood and the shoulder, so the hood stands rather than collapses. The arc graphic runs low across the back and breaks at the side seams. Cuffs and hem are ribbed tight, which is what keeps the volume in the body instead of letting it hang.",
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
  },
  {
    id: "monument-crewneck",
    name: "Monument Crewneck",
    slug: "monument-crewneck",
    description: "Structured crewneck with a raised chest hit.",
    story:
      "A crewneck with real weight to it. Loopback cotton, a raised chest hit you can feel with a thumb, and ribbing carried through the collar, cuff and hem so it keeps a clean line under a jacket rather than rucking up at the waist.",
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
  },
  {
    id: "utility-cargo-pant",
    name: "Utility Cargo Pant",
    slug: "utility-cargo-pant",
    description: "Wide leg, articulated knee, six pockets.",
    story:
      "Cut wide from the hip with an articulated knee, so the leg breaks once and stacks over a boot instead of pooling. Six pockets, placed to carry weight without dragging the silhouette out of shape, and a drawcord at the hem to close the leg down when you want it narrower.",
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
  },
  {
    id: "logo-cap",
    name: "Logo Cap",
    slug: "logo-cap",
    description: "Unstructured six-panel with a low embroidered wordmark.",
    story:
      "Unstructured, so it collapses flat in a pocket and sits low on the head rather than standing off it. Cotton twill, six panels, the wordmark embroidered small on the front and repeated on the back strap.",
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
  },
  {
    id: "work-jacket",
    name: "Work Jacket",
    slug: "work-jacket",
    description: "Boxy cotton canvas with a four-pocket front.",
    story:
      "A workwear shape squared off through the body, with four pockets across the front and corozo buttons up the placket. The canvas starts stiff and breaks in with wear, so it ends up holding the shape of whoever wore it. Boxy enough to go over the Arc Hoodie.",
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
  },

  // — Drop 002: announced, not released ————————————————————————————
  {
    id: "shell-jacket-01",
    name: "Shell Jacket 01",
    slug: "shell-jacket-01",
    description: "Technical outer layer. Taped seams, storm hood.",
    story:
      "A technical outer layer, cut oversized to go over the Arc Hoodie without pulling across the back. Taped seams, a two-way zip, a storm hood that holds its shape in wind, and a hem that sits below the seat.",
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
  },
  {
    id: "ribbed-beanie",
    name: "Ribbed Beanie",
    slug: "ribbed-beanie",
    description: "Fine-gauge rib with a woven label at the cuff.",
    story:
      "Fine-gauge rib, knitted long so it can be cuffed short or pulled down over the ears. The woven label sits on the cuff and stays visible either way.",
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
  },
];
