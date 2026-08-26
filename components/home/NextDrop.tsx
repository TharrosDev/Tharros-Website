import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SplitLines from "@/components/motion/SplitLines";
import Magnetic from "@/components/motion/Magnetic";
import ProductGrid from "@/components/product/ProductGrid";
import { NEXT_DROP, NO_DATE_NOTE } from "@/lib/catalog/drops";
import { listProducts } from "@/lib/catalog/queries";

/**
 * A COLLECTION PREVIEW, NOT A PROJECT STATUS REPORT.
 *
 * This section used to say what was being patterned, what was being cut again,
 * which pieces were "far enough along to show", and that the drop would go out
 * "when the fit is right" — a development log, published to customers, closing
 * the home page. Nothing here now states anything that is not confirmed: the
 * name of the release, what is in it, and the fact that it has no date yet.
 * The button used to read "Follow the build".
 */
export default function NextDrop() {
  if (!NEXT_DROP) return null;
  const pieces = listProducts({ drop: NEXT_DROP.id });

  return (
    <section className="on-pale rhythm-breath">
      <div className="page-frame">
        {/* The index is this section's place on the page, never the drop's own
            number — printing "002" in the same column as 01 and 02 puts a
            second series in one position and reads as a step backwards. The
            drop's name carries its number, and the accent marks the state. */}
        <Reveal className="rule-draw flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-4">
          <p className="eyebrow">
            <span className="num">03</span>
            <span>{NEXT_DROP.name}</span>
          </p>
          <p className="type-meta text-signal">Coming next</p>
        </Reveal>

        {/* Split, because this is the last statement on the page and the one
            the visitor leaves on. */}
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
            <p className="type-meta text-ink-faint">{NO_DATE_NOTE}</p>
            <Magnetic className="inline-block pt-4">
              <Link href="/drop" className="btn btn-outline">
                Preview {NEXT_DROP.name}
              </Link>
            </Magnetic>
          </Reveal>

          {/* The pieces themselves rather than a picture of the drop being
              made. Two cards, no specimen row — there are no run figures for
              an unreleased piece and an em dash in a stock column is a figure
              nobody asked for. */}
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
