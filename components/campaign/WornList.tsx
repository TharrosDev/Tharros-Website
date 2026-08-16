import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import { getProduct, thumbnailImage } from "@/lib/catalog/queries";
import { formatPrice } from "@/lib/format";

/**
 * What is in the picture, and where to buy it.
 *
 * This is the model-led discovery route, and it is deliberately a list of real
 * links rather than markers floating on the image. It is in the tab order, it
 * works on touch, it works with a right click, it works with scripting off, and
 * it says the price — which a marker on a photograph cannot do without becoming
 * a tooltip that half the people who need it will never trigger.
 *
 * Markers are the enhancement on top (see FrameHotspots), not the mechanism.
 *
 * Unknown slugs are dropped rather than rendered as dead entries, the same way
 * the lookbook's `Wearing` line already behaves.
 */
export default function WornList({
  slugs,
  frameId,
  variant = "rail",
  onDark = false,
}: {
  slugs: string[];
  /** Ties each entry to its marker, for `aria-describedby`. */
  frameId: string;
  /** `rail` scrolls horizontally; `stack` runs down a column beside a frame. */
  variant?: "rail" | "stack";
  onDark?: boolean;
}) {
  const products = slugs
    .map((slug) => getProduct(slug))
    .filter((product) => product !== undefined);

  if (products.length === 0) return null;

  // Over a picture the faint tone has no headroom — it only just clears AA on
  // pure black — so the on-dark metadata layer steps up one stop. Hierarchy is
  // carried by the mono face and scale instead of by tone.
  const muted = onDark ? "text-ink-on-dark-muted" : "text-ink-faint";
  const rule = onDark ? "border-rule-on-dark" : "border-rule";

  return (
    <div>
      <p className={`type-meta ${muted} ${rule} border-t pt-3`}>In this frame</p>

      <ul
        className={
          variant === "rail"
            ? "no-scrollbar mt-4 flex gap-6 overflow-x-auto pb-1"
            : "mt-4 flex flex-col gap-5"
        }
      >
        {products.map((product) => (
          <li
            key={product.id}
            id={`worn-${frameId}-${product.slug}`}
            className={variant === "rail" ? "w-44 shrink-0" : ""}
          >
            <Link href={`/shop/${product.slug}`} className="group flex items-center gap-3">
              <span className="w-12 shrink-0">
                <ImageSlot image={thumbnailImage(product)} ratio="square" sizes="48px" />
              </span>
              <span className="min-w-0">
                <span
                  className={`type-body-sm block truncate ${onDark ? "text-ink-on-dark" : "text-ink"} underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current`}
                >
                  {product.name}
                </span>
                <span className={`num mt-1 block text-[0.6875rem] ${muted}`}>
                  {formatPrice(product.price)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
