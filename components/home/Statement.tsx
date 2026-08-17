import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

/**
 * The pause between the drop and the process, and the only place on the page
 * where type is the entire composition.
 *
 * It used to split the statement and the body into two columns of roughly equal
 * weight, which made the black band read as a paragraph with a large first
 * line. The statement now takes the top of the band at the heaviest step on the
 * ladder and the prose sits under it in a single narrow column — so the section
 * is a pause because it is loud and short, not because it is empty.
 *
 * `rhythm-breath` rather than `rhythm-default`: this is the page's one held
 * breath, and every section around it is the default step.
 */
export default function Statement() {
  return (
    <section className="on-dark rhythm-breath">
      <div className="page-frame">
        <SectionHeading
          index="02"
          label="Built from the ground up"
          title="Made small. Made with intent."
          titleClass="type-display-1"
        />

        <Reveal
          delay={120}
          className="section-lead grid gap-x-12 lg:grid-cols-12"
        >
          <div className="space-y-5 lg:col-span-5 lg:col-start-8">
            <p className="type-body text-ink-on-dark-muted">
              THARROS is an independent label run at a small scale on purpose. Pieces
              are designed, patterned and sampled here, then made in short runs — few
              enough that every one is accounted for.
            </p>
            <p className="type-body text-ink-on-dark-muted">
              Every product page prints how many were made and how many are left. When
              a size is gone, it is gone.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
