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
  // pure black — so the on-dark metadata layer steps up. It stepped up ONE
  // stop, to `--ink-on-dark-muted`, and that is not enough: muted is tuned
  // against near-black, and a photograph is not near-black. Measured by pixel
  // readback against the home hero's own frame it lands at 2.2–2.9 wherever the
  // picture behind it is pale, which is most of a daylight shot against a wall.
  //
  // So on a picture the metadata is paper held back to 90%, which measures
  // 4.6–5.9 over the same grounds. Hierarchy is carried by the mono face and
  // scale rather than by tone — which is what the rule always said it was,
  // there was simply no tone left to spend.
  const muted = onDark ? "text-ink-on-dark/90" : "text-ink-faint";
  const rule = onDark ? "border-rule-on-dark" : "border-rule";

  return (
    <div>
      <p className={`type-meta ${muted} ${rule} border-t pt-3`}>In this frame</p>

      {/* A stack beside a frame on a desktop is a column of two or three names.
          On a phone that column pushes the next frame off the screen, so below
          `md` every variant is the snap rail — the same gesture the lookbook
          rail and the product gallery already use. */}
      <ul
        className={
          variant === "rail"
            ? "no-scrollbar mt-4 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-1"
            : "no-scrollbar mt-4 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-1 md:flex-col md:gap-5 md:overflow-visible"
        }
      >
        {products.map((product) => (
          <li
            key={product.id}
            id={`worn-${frameId}-${product.slug}`}
            className={
              variant === "rail"
                ? "w-44 shrink-0 snap-start"
                : "w-44 shrink-0 snap-start md:w-auto md:shrink"
            }
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
                <span className={`num type-meta mt-1 block ${muted}`}>
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
