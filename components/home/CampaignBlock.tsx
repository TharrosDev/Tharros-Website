import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";

/** Full-bleed campaign frame with the copy set into the lower left. */
export default function CampaignBlock() {
  return (
    <section className="on-dark relative">
      <ImageSlot
        image={{
          code: "CMP-01",
          alt: "THARROS campaign frame — model in Drop 001 against concrete",
          kind: "lifestyle",
          ratio: "wide",
        }}
        sizes="100vw"
        className="min-h-[26rem]"
      />

      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 flex items-end">
        <div className="page-frame w-full pb-12 md:pb-16">
          <Reveal>
            <p className="eyebrow">
              <span className="num">04</span>
              <span>The Label</span>
            </p>
            <h2 className="type-display-2 mt-8">An independent label, in progress.</h2>
            <p className="type-body mt-6 max-w-md text-ink-on-dark-muted">
              Seven pieces in the first drop. The next one is on the table now — cut,
              sewn, worn, and cut again until it earns a run.
            </p>
            <Link href="/about" className="btn btn-inverse mt-10">
              Read the story
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
