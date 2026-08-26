import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SplitLines from "@/components/motion/SplitLines";
import Magnetic from "@/components/motion/Magnetic";
import ProductGrid from "@/components/product/ProductGrid";
import { NEXT_DROP } from "@/lib/catalog/drops";
import { formatDate } from "@/lib/format";
import { listProducts } from "@/lib/catalog/queries";

/**
 * The next release, closing the home page: its name, its statement, its date
 * and the pieces announced for it. Nothing that is not confirmed.
 */
export default function NextDrop() {
  if (!NEXT_DROP) return null;
  const pieces = listProducts({ drop: NEXT_DROP.id });

  return (
    <section className="on-pale rhythm-breath">
      <div className="page-frame">
        {/* The index is this section's place on the page, never the drop's own
            number — the drop's name already carries that. */}
        <Reveal className="rule-draw flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-4">
          <p className="eyebrow">
            <span className="num">03</span>
            <span>{NEXT_DROP.name}</span>
          </p>
          <p className="type-meta text-signal">Coming next</p>
        </Reveal>

        {/* Split: the last statement on the page and the one the visitor
            leaves on. */}
        <SplitLines
          as="h2"
          text={NEXT_DROP.statement}
          className="type-display-2 mt-10 max-w-[16ch] md:mt-12"
        />

        <div className="section-lead grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <Reveal mode="wipe" className="space-y-5 lg:col-span-5">
            {NEXT_DROP.body.map((paragraph) => (
              <p key={paragraph} className="type-body text-ink-muted">
                {paragraph}
              </p>
            ))}
            {NEXT_DROP.releasedAt ? (
              <p className="type-meta text-ink-faint">
                <time dateTime={NEXT_DROP.releasedAt}>
                  {formatDate(NEXT_DROP.releasedAt)}
                </time>
              </p>
            ) : null}
            <Magnetic className="inline-block pt-4">
              <Link href="/drop" className="btn btn-outline">
                Preview {NEXT_DROP.name}
              </Link>
            </Magnetic>
          </Reveal>

          {/* The pieces themselves are the picture. */}
          {pieces.length > 0 ? (
            <div className="lg:col-span-6 lg:col-start-7">
              <ProductGrid
                products={pieces}
                heading={`${NEXT_DROP.name} pieces`}
                columns={2}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
