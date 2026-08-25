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
 * ONE SENTENCE, NOT TWO PARAGRAPHS. The band used to say that pieces are
 * "designed, patterned and sampled here" and that "every product page prints
 * how many were made and how many are left" — the first is the argument
 * `/about` spends two chapters on and 03 makes again forty lines below, and the
 * second describes the grid immediately above, where every card already prints
 * MADE and LEFT. A pause that restates its neighbours is not a pause. What is
 * left is the one claim nothing else on the page makes in words, and it is
 * short enough to sit on the measure without a second column.
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
            label="The scale"
            title="Made small. Made with intent."
            titleClass="type-display-1"
            split
          />
        </SceneLayer>

        <SceneLayer name="lead" className="section-lead">
          <Reveal>
            <p className="type-lead text-ink">
              An independent label working at a scale where every garment is
              accounted for.
            </p>
          </Reveal>
        </SceneLayer>
      </div>
    </Scene>
  );
}
