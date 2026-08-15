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
          alt: "THARROS campaign frame — model in Collection 01 against concrete",
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
            <h2 className="type-display-2">This is Tharros.</h2>
            <p className="type-body mt-6 max-w-md text-ink-on-dark-muted">
              THARROS exists for people who refuse to disappear into the crowd.
            </p>
            <Link href="/about" className="btn btn-inverse mt-10">
              Discover the story
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
