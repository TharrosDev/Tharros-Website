import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Scene, { SceneLayer } from "@/components/motion/Scene";

/**
 * The pause between the drop and the process, and the only place on the page
 * where type is the entire composition.
 *
 * The statement takes the top of the band at the heaviest step on the ladder
 * and the prose sits under it in a single narrow column — so the section is a
 * pause because it is loud and short, not because it is empty.
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

        <SceneLayer name="prose">
          <Reveal
            delay={120}
            className="section-lead grid gap-x-12 lg:grid-cols-12"
          >
            <div className="space-y-5 lg:col-span-5 lg:col-start-8">
              <p className="type-body text-ink-muted">
                THARROS is an independent label run at a small scale on purpose.
                Pieces are designed, patterned and sampled here, then made in
                short runs — few enough that every one is accounted for.
              </p>
              <p className="type-body text-ink-muted">
                Every product page prints how many were made and how many are
                left. When a size is gone, it is gone.
              </p>
            </div>
          </Reveal>
        </SceneLayer>
      </div>
    </Scene>
  );
}
