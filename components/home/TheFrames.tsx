import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import WornList from "@/components/campaign/WornList";
import SectionHeading from "@/components/ui/SectionHeading";
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
 */
export default function TheFrames() {
  const spreads = LOOKBOOK.slice(0, 5);

  return (
    <section className="rhythm-default">
      <div className="page-frame">
        <SectionHeading
          index="04"
          label="Lookbook"
          title="Drop 001, in full."
          action={{ href: "/lookbook", label: "Open lookbook" }}
        />
      </div>

      <ul className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-2">
        {spreads.map((spread) => (
          <li
            key={spread.id}
            className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw]"
          >
            <Link href="/lookbook" className="hover-zoom block overflow-hidden">
              <ImageSlot
                image={leadFrame(spread)}
                ratio="editorial"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 78vw"
              />
            </Link>
            <p className="type-meta mt-4 text-ink-faint">
              <span className="num">{spread.index}</span>
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
          </li>
        ))}
      </ul>
    </section>
  );
}
