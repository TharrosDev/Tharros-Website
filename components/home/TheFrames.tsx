import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import SectionHeading from "@/components/ui/SectionHeading";
import { LOOKBOOK } from "@/lib/catalog/lookbook";

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
                image={spread.images[0]}
                ratio="editorial"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 78vw"
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
