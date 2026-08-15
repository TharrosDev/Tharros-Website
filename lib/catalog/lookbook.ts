/**
 * PLACEHOLDER CONTENT — spreads await the Drop 001 shoot.
 *
 * A small drop gets a small lookbook. Four spreads that show the pieces and
 * how they sit together beats twenty that pad it out.
 */
import type { LookbookSpread } from "./types";

export const LOOKBOOK: LookbookSpread[] = [
  {
    id: "spread-01",
    drop: "drop-001",
    index: "01",
    layout: "full",
    caption: "Opening frame. Arc Hoodie, Utility Cargo Pant.",
    wearing: ["arc-hoodie", "utility-cargo-pant"],
    images: [
      {
        code: "LB-01",
        alt: "Model in the Arc Hoodie and Utility Cargo Pant, shot against concrete",
        kind: "lifestyle",
        ratio: "campaign",
      },
    ],
  },
  {
    id: "spread-02",
    drop: "drop-001",
    index: "02",
    layout: "pair",
    caption: "Core Tee, front and back.",
    wearing: ["core-tee"],
    images: [
      {
        code: "LB-02A",
        alt: "Model wearing the Core Tee, front view",
        kind: "model",
        ratio: "editorial",
      },
      {
        code: "LB-02B",
        alt: "Model wearing the Core Tee, back view",
        kind: "model",
        ratio: "editorial",
      },
    ],
  },
  {
    id: "spread-03",
    drop: "drop-001",
    index: "03",
    layout: "offset",
    caption: "Noise / Silence. Read from either direction.",
    wearing: ["noise-silence-tee"],
    images: [
      {
        code: "LB-03A",
        alt: "Close detail of the Noise / Silence Tee graphic",
        kind: "detail",
        ratio: "editorial",
      },
      {
        code: "LB-03B",
        alt: "Model walking away, the Noise / Silence Tee back graphic visible",
        kind: "lifestyle",
        ratio: "portrait",
      },
    ],
  },
  {
    id: "spread-04",
    drop: "drop-001",
    index: "04",
    layout: "stack",
    caption: "Fabric studies. Canvas, fleece, twill.",
    wearing: ["work-jacket", "monument-crewneck", "utility-cargo-pant"],
    images: [
      {
        code: "LB-04A",
        alt: "Close detail of cotton canvas from the Work Jacket",
        kind: "detail",
        ratio: "square",
      },
      {
        code: "LB-04B",
        alt: "Close detail of loopback cotton from the Monument Crewneck",
        kind: "detail",
        ratio: "square",
      },
      {
        code: "LB-04C",
        alt: "Close detail of cotton twill from the Utility Cargo Pant",
        kind: "detail",
        ratio: "square",
      },
    ],
  },
];
