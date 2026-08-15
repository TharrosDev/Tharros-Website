import Reveal from "@/components/ui/Reveal";

/**
 * The pause between the drop and the process. Two columns rather than one:
 * the statement line alone left too much of the black band empty.
 */
export default function Statement() {
  return (
    <section className="on-dark rhythm-default">
      <div className="page-frame">
        <Reveal>
          <p className="type-meta text-ink-on-dark-faint">
            <span className="num">02</span>
            <span className="ml-4">Built from the ground up</span>
          </p>

          <div className="mt-12 grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:items-end">
            <p className="type-display-2 max-w-[14ch] lg:col-span-6">
              Made small. Made with intent.
            </p>

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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
