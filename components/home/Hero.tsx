import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import { BRAND_LINE } from "@/lib/site";
import { CURRENT_DROP } from "@/lib/catalog/drops";

/**
 * The hero owns the first screen: one image, one line, one action. Everything
 * else on the page can wait until the visitor has scrolled once.
 */
export default function Hero() {
  return (
    <section className="on-dark relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <ImageSlot
        image={{
          code: "HERO-01",
          alt: "THARROS Drop 001 campaign image",
          kind: "lifestyle",
          ratio: "campaign",
        }}
        fill
        priority
        sizes="100vw"
      />

      {/* Keeps the type legible once a photograph lands behind it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/45"
      />

      <div className="page-frame relative z-10 pb-14 md:pb-20">
        <p className="type-meta text-ink-on-dark">
          <span className="num">{CURRENT_DROP.index}</span>
          <span className="ml-4">
            {CURRENT_DROP.name} — out now
          </span>
        </p>

        <h1 className="type-display-1 mt-6">Tharros</h1>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="type-display-4 max-w-[18ch] text-ink-on-dark">{BRAND_LINE}</p>
          <Link href="/shop" className="btn btn-inverse w-full md:w-auto">
            Shop the drop
          </Link>
        </div>
      </div>
    </section>
  );
}
