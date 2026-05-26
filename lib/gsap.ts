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

export { gsap, ScrollTrigger, SplitText, useGSAP };
