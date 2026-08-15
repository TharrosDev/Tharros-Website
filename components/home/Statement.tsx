import Reveal from "@/components/ui/Reveal";

/** The pause between the drop and the products. Type only, no image. */
export default function Statement() {
  return (
    <section className="on-dark rhythm-breath">
      <div className="page-frame">
        <Reveal>
          <p className="type-meta text-ink-on-dark-faint">
            <span className="num">02</span>
            <span className="ml-4">Statement</span>
          </p>
          <p className="type-display-2 mt-10 max-w-[14ch]">
            The world doesn&apos;t need another brand.
          </p>
          <p className="type-display-2 mt-2 max-w-[14ch] text-ink-on-dark-faint">
            Make your own.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
