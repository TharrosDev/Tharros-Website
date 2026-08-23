import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ImageSlot from "@/components/media/ImageSlot";
import Scene, { SceneLayer } from "@/components/motion/Scene";

/**
 * The pause between the drop and the process, and the page's heaviest sentence.
 *
 * The statement takes the top of the band at the heaviest step on the ladder,
 * and under it a frame and the prose share one row — so the section is a pause
 * because it is loud and short, not because it is empty.
 *
 * THE FRAME. This band held type and nothing else for a while, and the left of
 * it read as a hole rather than as a rest. The picture fills it and takes the
 * one register the home page was not already spending: `lifestyle` with no
 * crop, which is a figure small inside a large piece of architecture. The hero
 * is a `hero` frame, the campaign runs `street` and `worn`, the studio is
 * `detail` and the archive is `flat` — a scene is the only one left, and it
 * happens to be the right one for a sentence about being deliberately small.
 *
 * It is the slowest plane in the scene, at a third of the prose's travel. The
 * site's parallax says the same thing everywhere: the picture is the ground
 * and the type moves against it, never the reverse.
 *
 * THE HELD BEAT. This is the one pinned scene in the top half of the page. The
 * section is held still for the length of its own height while the statement
 * drifts up and the prose comes in under it, so the page stops moving for a
 * moment on the sentence that says what the label is. Everything either side
 * of it scrolls normally, which is what makes the stop legible as a stop
 * rather than as a stall.
 *
 * It is authored as an ordinary stacked section first and pinned second. That
 * is why the reduced-motion and no-JS versions are not degraded: they are the
 * section as written, and the pin is something the scene does on top.
 *
 * `rhythm-breath` rather than `rhythm-default`: the page's one held breath.
 */
export default function Statement() {
  return (
    <Scene
      as="section"
      className="on-pale rhythm-breath"
      pin
      end="+=80%"
      steps={[
        { at: 0, layer: "title", to: { yPercent: -14 } },
        { at: 0, layer: "frame", to: { yPercent: -6 } },
        { at: 0.1, layer: "prose", to: { yPercent: -34 } },
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

        {/* Both layers take `lg:row-start-1` explicitly. The frame is first in
            the DOM so a phone reads statement, picture, prose; without the row
            pinned, placing the prose at `col-start-8` would let auto-flow drop
            the second item onto a row of its own the moment the order changed. */}
        <div className="section-lead grid gap-x-12 gap-y-12 lg:grid-cols-12">
          <SceneLayer name="frame" className="lg:col-span-6 lg:row-start-1">
            {/* `mask`, not the default fade: this is a photograph, and the site
                uncovers pictures rather than sliding them. */}
            <Reveal mode="mask">
              <ImageSlot
                image={{
                  code: "STM-01",
                  alt: "A figure at the foot of a plain concrete wall",
                  kind: "lifestyle",
                  ratio: "square",
                }}
                ratio="square"
                ratioSm="editorial"
                sizes="(min-width: 1024px) min(48vw, 680px), 100vw"
              />
            </Reveal>
          </SceneLayer>

          {/* Hung at the foot of the frame rather than level with its top. Two
              short paragraphs against a square picture leave the space either
              above the type or below it, and above is where it reads as air —
              the same call the campaign captions make. */}
          <SceneLayer
            name="prose"
            className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-end"
          >
            <Reveal delay={120} className="space-y-5">
              <p className="type-body text-ink-muted">
                THARROS is an independent label run at a small scale on purpose.
                Pieces are designed, patterned and sampled here, then made in
                short runs — few enough that every one is accounted for.
              </p>
              <p className="type-body text-ink-muted">
                Every product page prints how many were made and how many are
                left. When a size is gone, it is gone.
              </p>
            </Reveal>
          </SceneLayer>
        </div>
      </div>
    </Scene>
  );
}
