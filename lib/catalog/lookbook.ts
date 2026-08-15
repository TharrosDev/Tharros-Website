/** PLACEHOLDER CONTENT — lookbook spreads await the Collection 01 shoot. */
import type { LookbookSpread } from "./types";

export const LOOKBOOK: LookbookSpread[] = [
  {
    id: "spread-01",
    index: "01",
    layout: "full",
    caption: "Opening frame. Shell Jacket 01 over the Arc Hoodie.",
    wearing: ["shell-jacket-01", "arc-hoodie"],
    images: [
      {
        code: "LB-01",
        alt: "Model in the Shell Jacket 01 layered over the Arc Hoodie, shot against concrete",
        kind: "lifestyle",
        ratio: "campaign",
      },
    ],
  },
  {
    id: "spread-02",
    index: "02",
    layout: "pair",
    caption: "Core Tee, front and back.",
    wearing: ["core-tee", "utility-cargo-pant"],
    images: [
      {
        code: "LB-02A",
        alt: "Model wearing the Core Tee with the Utility Cargo Pant, front view",
        kind: "model",
        ratio: "editorial",
      },
      {
        code: "LB-02B",
        alt: "Model wearing the Core Tee with the Utility Cargo Pant, back view",
        kind: "model",
        ratio: "editorial",
      },
    ],
  },
  {
    id: "spread-03",
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
    index: "04",
    layout: "full",
    caption: "Night frame. Monument Crewneck, Stacked Sweatpant.",
    wearing: ["monument-crewneck", "stacked-sweatpant"],
    images: [
      {
        code: "LB-04",
        alt: "Model in the Monument Crewneck and Stacked Sweatpant under street lighting",
        kind: "lifestyle",
        ratio: "wide",
      },
    ],
  },
  {
    id: "spread-05",
    index: "05",
    layout: "stack",
    caption: "Fabric studies. Canvas, fleece, twill.",
    wearing: ["work-jacket", "grain-crewneck", "utility-cargo-pant"],
    images: [
      {
        code: "LB-05A",
        alt: "Close detail of cotton canvas from the Work Jacket",
        kind: "detail",
        ratio: "square",
      },
      {
        code: "LB-05B",
        alt: "Close detail of brushed-back fleece from the Grain Crewneck",
        kind: "detail",
        ratio: "square",
      },
      {
        code: "LB-05C",
        alt: "Close detail of cotton twill from the Utility Cargo Pant",
        kind: "detail",
        ratio: "square",
      },
    ],
  },
  {
    id: "spread-06",
    index: "06",
    layout: "full",
    caption: "Closing frame.",
    wearing: ["field-zip-hoodie"],
    images: [
      {
        code: "LB-06",
        alt: "Wide campaign frame of the Field Zip Hoodie in an industrial setting",
        kind: "lifestyle",
        ratio: "campaign",
      },
    ],
  },
];
