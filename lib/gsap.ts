"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Registered once per client bundle. All importers are client components,
// so window exists; the guard keeps any accidental server import inert.
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
  // Don't let the scroller fight native smooth-scroll math on anchor jumps.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

// Decisive ease-out curves only (no bounce / elastic) to match the Redline
// motion law: every effect is snappy and lands hard.
export const EASE_EXPO = "expo.out";
export const EASE_QUART = "power4.out";
export const EASE_QUINT = "power3.out";

// GSAP's line `mask` wrappers clip to the line box, but our display type runs
// line-height < 1, so glyph descenders sit below that box and get sheared off
// (text reads as "cut off at the bottom" once a reveal settles). Pad the clip
// region down and pull it back with an equal negative margin: full glyphs show
// while line spacing and surrounding layout stay put. Pair with a reveal start
// of yPercent ≥ 135 so the line still begins fully hidden below the padded box.
export const MASK_PAD = "0.25em";
export function unclipMaskDescenders(split: InstanceType<typeof SplitText>) {
  if (split.masks.length) {
    gsap.set(split.masks, { paddingBottom: MASK_PAD, marginBottom: `-${MASK_PAD}` });
  }
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
