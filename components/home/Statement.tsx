import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Scene, { SceneLayer } from "@/components/motion/Scene";

/**
 * The pause between the drop and the studio: one sentence at the top of the
 * ladder, and a short block indented under it. Type only.
 *
 * NO PICTURE HERE ANY MORE. The band used to hold a square `lifestyle` frame on
 * the left with the prose hung to its foot on the right, and the composition
 * had two faults that only a measurement makes obvious. The prose was
 * bottom-aligned against a 615px picture, so the top two thirds of the right
 * column — 560 x 430px at 1440x900 — was empty page; and the whole section ran
 * 1686px, 1.9 viewports, to carry 55 words and one photograph. That is the
 * "empty space around not much" the section was accused of.
 *
 * The frame is also the reason the band had nothing of its own to say. A figure
 * small inside a large piece of architecture is the register the campaign
 * sequence two sections below already owns, so 02 was previewing 04 rather than
 * contrasting with it. Handing the picture back leaves 02 the one thing on the
 * page that is purely typographic, between a grid of photographs above it and a
 * photograph below it — which is what makes it read as a pause rather than as
 * another picture section with more air around it.
 *
 * The prose runs as one row under the title, both columns top-aligned, rather
 * than hung to the foot of anything. Nothing on this page is bottom-aligned to
 * a picture that is no longer there.
 *
 * `split` stays. This is the page's statement and the one place `SplitLines` is
 * spent on `/` — `e2e/routes.spec.ts` waits on `.split-line` as its proof that
 * the motion runtime booted before it asserts nothing pinned.
 *
 * `rhythm-breath` rather than `rhythm-default`: the page's one long breath, and
 * now short enough that the interval reads as a held beat rather than as the
 * section running out of content.
 */
export default function Statement() {
  return (
    <Scene
      as="section"
      className="on-pale rhythm-breath"
      steps={[
        { at: 0, layer: "title", to: { yPercent: -8 } },
        { at: 0.1, layer: "lead", to: { yPercent: -22 } },
      ]}
    >
      <div className="page-frame">
        <SceneLayer name="title">
          <SectionHeading
            index="02"
            label="Built from the ground up"
            title="Made small. Made with intent."
            titleClass="type-display-1"
            split
          />
        </SceneLayer>

        {/* ONE ROW, BOTH COLUMNS FILLED, BOTH TOP-ALIGNED. The prose was a
            single block indented to the middle of the frame, which left the
            leading half of the row — 490 x 250px at 1440x900 — as empty page
            under the title. An indent is only an indent when something else
            holds the line it is indented from. Split across the row the two
            paragraphs fill the measure between them, and the only space left
            is the rag of the display type above, which is the shape of the
            sentence rather than a hole in the layout. */}
        <SceneLayer
          name="lead"
          className="section-lead grid gap-x-12 gap-y-6 lg:grid-cols-12"
        >
          <Reveal className="lg:col-span-6 lg:row-start-1">
            <p className="type-lead text-ink">
              THARROS is an independent label run at a small scale on purpose.
              Pieces are designed, patterned and sampled here, then made in
              short runs — few enough that every one is accounted for.
            </p>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5 lg:col-start-8 lg:row-start-1">
            <p className="type-body text-ink-muted">
              Every product page prints how many were made and how many are
              left. When a size is gone, it is gone.
            </p>
          </Reveal>
        </SceneLayer>
      </div>
    </Scene>
  );
}
