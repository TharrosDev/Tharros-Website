import ImageSlot from "@/components/media/ImageSlot";
import { onBodyCredits, onBodyImages } from "@/lib/catalog/queries";
import type { Product } from "@/lib/catalog/types";

/**
 * ON BODY — the piece on people.
 *
 * The section a size chart cannot replace: how long it actually is, how it
 * falls off the shoulder, what it looks like from behind and in motion. Where
 * more than one person has been photographed in a piece it shows them
 * together, which is the useful way to answer "will this fit me" — not as a
 * statement about bodies, just as more than one data point.
 *
 * Renders nothing without frames. The credits underneath render nothing without
 * a fitting, independently — so a shoot that happened before the paperwork
 * still shows its pictures, and never invents the people in them.
 */
export default function OnBody({ product }: { product: Product }) {
  const frames = onBodyImages(product);
  if (frames.length === 0) return null;

  const credits = onBodyCredits(product);

  return (
    <section aria-labelledby="on-body" className="rhythm-tight">
      <div className="page-frame">
        <div className="eyebrow border-t border-ink pt-4">
          <span className="num">02</span>
          <span>On body</span>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h2 id="on-body" className="type-display-3 max-w-[14ch] text-balance">
            Worn.
          </h2>

          {credits.length > 0 ? (
            <dl className="flex flex-wrap gap-x-8 gap-y-2">
              {credits.map((credit) => (
                <div key={credit.model.id} className="flex items-baseline gap-3">
                  <dt className="type-meta text-ink-faint">{credit.model.name}</dt>
                  <dd className="type-meta text-ink">
                    {credit.model.heightCm === null
                      ? `Wears ${credit.size}`
                      : `${credit.model.heightCm} cm · wears ${credit.size}`}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {/* A rail rather than a grid: these are frames from one session, and
            reading them in sequence is closer to how the piece was shot. */}
        <ul className="no-scrollbar -mx-gutter mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-2">
          {frames.map((frame) => (
            <li
              key={frame.code}
              className="w-[74vw] shrink-0 snap-start sm:w-[42vw] lg:w-[28vw]"
            >
              <div className="hover-zoom overflow-hidden">
                <ImageSlot
                  image={frame}
                  ratio="portrait"
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, 74vw"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
