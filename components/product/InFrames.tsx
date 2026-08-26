import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import SectionHeading from "@/components/ui/SectionHeading";
import type { FeaturedFrame } from "@/lib/catalog/queries";

/**
 * IN THE FRAMES — where this piece has been photographed.
 *
 * The campaign and the lookbook both say what is worn in a picture, and until
 * now nothing said the reverse: someone landing on a piece from search met a
 * gallery and a spec table, while the editorial the piece was shot for sat two
 * clicks away with no sign it existed. This is the return leg of that link, and
 * it is also the honest way out of a product page — toward the drop the piece
 * belongs to rather than toward another product card.
 *
 * A rail rather than a grid: these are frames from one
 * session and reading them in sequence is how they were made.
 */
export default function InFrames({
  frames,
  index,
}: {
  frames: FeaturedFrame[];
  index: string;
}) {
  if (frames.length === 0) return null;

  return (
    <section aria-labelledby="in-frames" className="rhythm-tight">
      <div className="page-frame">
        <SectionHeading
          index={index}
          label="In the frames"
          title="Photographed in the drop."
          titleClass="type-display-3"
          titleId="in-frames"
          action={{ href: "/drop", label: "See the drop" }}
        />
      </div>

      <ul className="no-scrollbar section-lead flex snap-x snap-mandatory gap-8 overflow-x-auto px-gutter pb-2 md:gap-12">
        {frames.map((frame) => (
          <li
            key={frame.id}
            className="w-[72vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw]"
          >
            <Link
              href={frame.href}
              className="hover-zoom block overflow-hidden"
            >
              <ImageSlot
                image={frame.image}
                ratio="tall"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 72vw"
              />
            </Link>
            <p className="type-meta mt-4 flex items-baseline gap-3 text-ink-faint">
              <span className="num">{frame.index}</span>
              {frame.caption ? (
                <span className="normal-case tracking-normal">
                  {frame.caption}
                </span>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
