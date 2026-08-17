import Link from "next/link";
import { getProduct } from "@/lib/catalog/queries";
import type { Hotspot } from "@/lib/catalog/types";

/**
 * Markers on a frame that identify the pieces in it.
 *
 * This is the *enhancement*, not the mechanism. WornList already lists every
 * piece in the frame as a real link with a price, and that list is what works
 * on touch, with a keyboard, with a right click and with scripting off. These
 * markers only add the "which one is that" answer for someone using a pointer.
 *
 * Three rules it has to keep:
 *
 * - The container is `pointer-events-none` and only the markers take pointer
 *   events. A transparent overlay across a whole frame steals clicks from
 *   everything under it, which is exactly what CLAUDE.md forbids.
 * - Each marker is a real 44x44 box, not a dot with an expanded invisible hit
 *   area. The visible mark is small; the control is not.
 * - `aria-describedby` points at the matching WornList entry, so a screen
 *   reader gets the name and price from the list rather than needing the same
 *   copy duplicated onto the picture.
 *
 * It never renders below `md`: a 44px target on a 390px frame is 11% of its
 * width, and there is no hover to reveal the label anyway.
 *
 * No client JavaScript. The label was a React state toggle wrapped in
 * `AnimatePresence`, which made this a client component and pulled an animation
 * library in for one fade. Hover and focus are things CSS already knows about,
 * and `group-hover`/`group-focus-visible` do it with no state, no bundle and no
 * hydration — so this is a server component that ships nothing.
 */
export default function FrameHotspots({
  hotspots,
  frameId,
}: {
  hotspots: Hotspot[];
  frameId: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {hotspots.map((spot) => {
        const product = getProduct(spot.productSlug);
        if (!product) return null;

        return (
          <div
            key={spot.productSlug}
            className="absolute"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          >
            <Link
              href={`/shop/${product.slug}`}
              aria-describedby={`worn-${frameId}-${product.slug}`}
              className="group pointer-events-auto relative flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            >
              {/* The mark is small; the control is the 44px box around it. */}
              <span
                aria-hidden="true"
                className="block h-3 w-3 border border-paper bg-black/40 transition-colors duration-[var(--dur-fast)] group-hover:bg-paper group-focus-visible:bg-paper"
              />
              <span className="visually-hidden">{product.name}</span>

              <span
                aria-hidden="true"
                className="type-meta pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 bg-black/85 px-2 py-1 whitespace-nowrap text-paper opacity-0 transition-opacity duration-[var(--dur-fast)] group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {product.name}
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
