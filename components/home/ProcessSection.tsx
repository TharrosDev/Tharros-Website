import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageSlot from "@/components/media/ImageSlot";
import { STUDIO_STAGES } from "@/lib/catalog/studio";
import { PAGE_FRAMES } from "@/lib/catalog/images";

/**
 * The studio: one detail, and the sequence named.
 *
 * WHAT THIS REPLACED, AND WHY. It was a sticky 3:4 frame beside an `<ol>` of
 * the six stages, each row a numbered `h3` and two lines of body copy. Three
 * things were wrong with it and none of them were spacing.
 *
 * It was a feature list. Six identical rows of bold-name-plus-grey-sentence is
 * the shape of a SaaS "how it works" block, and reading it costs ~120 words in
 * a section whose job on this page is atmosphere. The owner's word for it was
 * clutter, and six rows of similar length is what that word describes.
 *
 * The sticky premise did not fire. At 1440x900 the picture measured 780px and
 * the list 900px, so the frame "held while the steps travelled past it" for
 * about 120px of scroll. Below `lg` the columns stack and there is no sticky at
 * all — which is where the section was worst: 2350px, the tallest thing on the
 * page at 768x1024, for one picture and six sentences.
 *
 * And it argued the same case as 02 immediately above it. "Designed, patterned
 * and sampled here" and "idea / pattern / sample / fit / revision / production"
 * are one claim stated twice, which is the page doctrine's one prohibition.
 *
 * So the reading is cut to the sequence itself. The six `short` lines stay in
 * `lib/catalog/studio.ts` for the page that states them at length; what belongs
 * on a home page is that there are six stages and what they are called. Six
 * words on one rule says that, and says it in the technical register the mono
 * layer exists for.
 *
 * THE FRAME IS LANDSCAPE, AND IT IS THE ONLY ONE ON THE PAGE. 02 gave up its
 * picture, so this section takes the whole page frame for a single wide detail
 * — a macro crop, close, no figure in it. Every other picture on `/` is a
 * portrait: the hero, the run's cards, the campaign frame below. One band
 * across the measure is what makes this section a different shape rather than
 * a different margin. Below `md` it steps to 4:5, because 21:9 on a phone is
 * the 167px band `ratioSm` exists to prevent.
 *
 * The title stays at `type-display-2`. It was tried a rung down, to separate it
 * from 02's `display-1`, and a rung down is also a rung narrower: `display-3`
 * inside `SectionHeading`'s 16ch measure is a 470px block with 800px of empty
 * paper beside it at 1440, which reads as a heading that failed to fill rather
 * than as a heading that chose not to. The change of volume between 02 and 03
 * is carried by what is under the two headings, not by their size.
 */
export default function ProcessSection() {
  return (
    <section className="rhythm-default">
      <div className="page-frame">
        <SectionHeading
          index="03"
          label="The studio"
          aside="Designed, tested, refined"
          title="Every piece gets made twice before it gets made properly."
        />

        <Reveal mode="mask" className="section-lead">
          <ImageSlot
            image={PAGE_FRAMES["PRC-01"]!}
            ratio="wide"
            ratioSm="editorial"
            sizes="(min-width: 1600px) 1600px, 100vw"
          />
        </Reveal>

        {/* The stages as a strip rather than a stack. Two cells on a phone,
            three on a tablet, all six on one rule from `lg` — so the sequence
            is something you take in at a glance instead of something you
            scroll. The names are labels, not headings: six `h3`s carrying one
            word each inflated the outline of the page for no reader. */}
        <ol className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {STUDIO_STAGES.map((stage, i) => (
            <Reveal
              as="li"
              key={stage.index}
              mode="wipe"
              delay={i * 60}
              className="border-t border-ink pt-3"
            >
              <span className="num type-meta block text-ink-faint">
                {stage.index}
              </span>
              <span className="type-mono-3 mt-2 block text-ink">
                {stage.name}
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
