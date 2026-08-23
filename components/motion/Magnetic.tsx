"use client";

import { useRef } from "react";
import { useScene } from "@/lib/motion/use-scene";
import { QUERY } from "@/lib/motion/media";
import { DUR, EASE } from "@/lib/motion/config";

/**
 * A control that leans toward the pointer.
 *
 * The travel is capped in pixels rather than expressed as a fraction of the
 * element, so a wide button and a small one lean by the same amount. An
 * uncapped magnet on a 300px button throws it half its own width and the
 * cursor stops being over the thing it is pointing at.
 *
 * WHERE THIS IS NOT ALLOWED, and it is an accessibility rule rather than a
 * taste one: never on a control in a purchase or data-entry path. A hit target
 * that moves as you approach it is a target you can miss, and missing it in
 * checkout costs someone an order. So: not in `BuyPanel`, `CheckoutFlow`,
 * `QuantityStepper`, `CartDrawer`, `FilterBar`, `SizeGuideModal`, the size
 * chips in `ProductCard`, or any `.field`.
 *
 * It belongs on the controls where the gesture is the point and the stakes are
 * nil: hero calls to action, section actions, the footer, the 404.
 *
 * Coarse pointers and reduced motion attach nothing at all — the child renders
 * exactly as it would have. `quickTo` writes straight to the node, so there is
 * no state and no re-render per pointer move.
 */
export default function Magnetic({
  children,
  /** Fraction of the pointer's offset from centre that is followed. */
  strength = 0.28,
  /** Hard ceiling on the travel, px. */
  cap = 12,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  cap?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useScene(
    ref,
    ({ gsap }, node) => {
      const media = gsap.matchMedia();

      media.add(`${QUERY.motion} and ${QUERY.fine}`, () => {
        const moveX = gsap.quickTo(node, "x", { duration: DUR.base, ease: EASE.out });
        const moveY = gsap.quickTo(node, "y", { duration: DUR.base, ease: EASE.out });

        const clamp = (value: number) => Math.max(-cap, Math.min(cap, value));

        const onMove = (event: PointerEvent) => {
          const box = node.getBoundingClientRect();
          const offsetX = event.clientX - (box.left + box.width / 2);
          const offsetY = event.clientY - (box.top + box.height / 2);
          moveX(clamp(offsetX * strength));
          moveY(clamp(offsetY * strength));
        };

        const release = () => {
          moveX(0);
          moveY(0);
        };

        node.addEventListener("pointermove", onMove);
        node.addEventListener("pointerleave", release);
        // Keyboard focus must not leave the control displaced from wherever
        // the pointer happened to be when it last passed over.
        node.addEventListener("blur", release, true);

        return () => {
          node.removeEventListener("pointermove", onMove);
          node.removeEventListener("pointerleave", release);
          node.removeEventListener("blur", release, true);
        };
      });
    },
    [strength, cap],
  );

  // `inline-block` so the wrapper is the size of the control it holds; a
  // full-width block would magnetise from anywhere on the row.
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
