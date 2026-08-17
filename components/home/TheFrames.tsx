import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import WornList from "@/components/campaign/WornList";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { LOOKBOOK } from "@/lib/catalog/lookbook";
import type { LookbookSpread } from "@/lib/catalog/types";

/**
 * The frame that best represents a spread: someone in the clothes if the spread
 * has one, otherwise whatever it leads with. Same rule as the product ladder,
 * applied to a spread's own images.
 */
function leadFrame(spread: LookbookSpread) {
  const worn = spread.images.find(
    (image) => image.kind === "model" || image.kind === "lifestyle",
  );
  return worn ?? spread.images[0];
}

/**
 * The one image-led moment on the page.
 *
 * This replaces a full-bleed campaign block followed immediately by a lookbook
 * rail. Two image-dependent sections back to back is one too many when there is
 * no photography yet — it reads as two grey rectangles in a row. Merged, the
 * page has a single place where imagery leads, and the rail signals there is
 * more of it on its own page.
 *
 * It has to read as a rail rather than as a grid that failed. It used to slice
 * five spreads from a four-spread array at 30vw each, which is 123vw — barely
 * a scroll, no counter, no edge. Now it takes every spread at a width that
 * guarantees the track overflows, and says how many there are, so the overflow
 * is legibly deliberate.
 */
export default function TheFrames() {
  const spreads = LOOKBOOK;
  if (spreads.length === 0) return null;

  return (
    <section className="rhythm-tight">
      <div className="page-frame">
        <SectionHeading
          index="05"
          label="Lookbook"
          title="Drop 001, in full."
          action={{ href: "/lookbook", label: "Open lookbook" }}
        />
        <p className="type-meta mt-6 text-ink-faint">
          <span className="num">
            {String(spreads.length).padStart(2, "0")}
          </span>
          <span className="ml-3">Spreads — scroll</span>
        </p>
      </div>

      <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-2">
        {spreads.map((spread, i) => (
          <Reveal
            as="li"
            key={spread.id}
            delay={i * 80}
            className="w-[78vw] shrink-0 snap-start sm:w-[52vw] lg:w-[38vw]"
          >
            <Link href="/lookbook" className="hover-zoom block overflow-hidden">
              <ImageSlot
                image={leadFrame(spread)}
                ratio="editorial"
                sizes="(min-width: 1024px) 38vw, (min-width: 640px) 52vw, 78vw"
              />
            </Link>
            <p className="type-meta mt-4 text-ink-faint">
              <span className="num">{spread.index}</span>
              <span className="ml-1 opacity-60">
                /{String(spreads.length).padStart(2, "0")}
              </span>
              <span className="ml-3 normal-case tracking-normal">{spread.caption}</span>
            </p>
            {/* The rail is a way into the shop, not just a teaser for the
                lookbook: each frame says what is in it. */}
            <div className="mt-4">
              <WornList
                slugs={spread.wearing}
                frameId={`frames-${spread.id}`}
                variant="stack"
              />
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
