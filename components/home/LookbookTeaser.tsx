import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import SectionHeading from "@/components/ui/SectionHeading";
import { LOOKBOOK } from "@/lib/catalog/lookbook";

/**
 * A horizontal rail rather than a grid — the lookbook is meant to be scrubbed
 * through, and the overflow signals there is more of it on its own page.
 */
export default function LookbookTeaser() {
  const spreads = LOOKBOOK.slice(0, 5);

  return (
    <section className="rhythm-default">
      <div className="page-frame">
        <SectionHeading
          index="06"
          label="Lookbook"
          title="Collection 01, in full."
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
                image={spread.images[0]}
                ratio="editorial"
                sizes="(min-width: 1024px) 30vw, 78vw"
              />
            </Link>
            <p className="type-meta mt-4 text-ink-faint">
              <span className="num">{spread.index}</span>
              <span className="ml-3 normal-case tracking-normal">{spread.caption}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
