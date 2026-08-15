import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import ProductGrid from "@/components/product/ProductGrid";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import { CURRENT_DROP, NEXT_DROP } from "@/lib/catalog/drops";
import { listProducts, runStatus } from "@/lib/catalog/queries";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Current Drop",
  description:
    "Drop 001 — a small run of original pieces from THARROS. Made in limited numbers, not restocked on a schedule.",
  alternates: { canonical: "/drop" },
};

export default function DropPage() {
  const pieces = listProducts({ drop: CURRENT_DROP.id });
  const upcoming = NEXT_DROP ? listProducts({ drop: NEXT_DROP.id }) : [];

  const totalMade = pieces.reduce((sum, product) => sum + product.runSize, 0);
  const remaining = pieces.reduce((sum, product) => sum + runStatus(product).remaining, 0);

  return (
    <>
      <PageIntro
        index={CURRENT_DROP.index}
        label={
          CURRENT_DROP.releasedAt
            ? `Released ${formatDate(CURRENT_DROP.releasedAt)}`
            : "In development"
        }
        title={CURRENT_DROP.name}
        lead={CURRENT_DROP.statement}
      >
        {/* Real numbers, straight from the catalogue. Nothing here is a
            marketing figure. */}
        <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-ink pt-6">
          <div>
            <dt className="type-meta text-ink-faint">Pieces</dt>
            <dd className="num type-display-4 mt-2">{pieces.length}</dd>
          </div>
          <div>
            <dt className="type-meta text-ink-faint">Units made</dt>
            <dd className="num type-display-4 mt-2">{totalMade}</dd>
          </div>
          <div>
            <dt className="type-meta text-ink-faint">Still available</dt>
            <dd className="num type-display-4 mt-2">{remaining}</dd>
          </div>
        </dl>
      </PageIntro>

      <div className="page-frame">
        <div className="max-w-2xl space-y-5">
          {CURRENT_DROP.body.map((paragraph) => (
            <p key={paragraph} className="type-body text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="page-frame rhythm-tight">
        <ProductGrid
          products={pieces}
          heading={`${CURRENT_DROP.name} pieces`}
          columns={3}
          priorityCount={3}
        />
      </div>

      {NEXT_DROP ? (
        <section className="on-dark rhythm-default">
          <div className="page-frame">
            <div className="flex items-baseline justify-between gap-6 border-t border-rule-on-dark pt-4">
              <p className="eyebrow">
                <span className="num">{NEXT_DROP.index}</span>
                <span>{NEXT_DROP.name}</span>
              </p>
              <p className="type-meta text-ink-on-dark-faint">In development</p>
            </div>

            <h2 className="type-display-2 mt-8 max-w-[16ch]">{NEXT_DROP.statement}</h2>

            <div className="mt-8 grid gap-x-6 gap-y-10 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-5">
                {NEXT_DROP.body.map((paragraph) => (
                  <p key={paragraph} className="type-body text-ink-on-dark-muted">
                    {paragraph}
                  </p>
                ))}
                <p className="type-meta text-ink-on-dark-faint">
                  No release date is published until there is one.
                </p>
              </div>

              <Reveal className="lg:col-span-6 lg:col-start-7">
                <ImageSlot
                  image={NEXT_DROP.cover}
                  ratio="editorial"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </Reveal>
            </div>

            {upcoming.length > 0 ? (
              <div className="mt-16">
                <p className="eyebrow border-t border-rule-on-dark pt-4">
                  <span>Far enough along to show</span>
                </p>
                <div className="mt-10">
                  <ProductGrid
                    products={upcoming}
                    heading={`${NEXT_DROP.name} pieces in development`}
                    columns={4}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="page-frame rhythm-tight border-t border-rule">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="type-display-3 uppercase">See how it was made.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/journal" className="btn btn-outline">
              Read the journal
            </Link>
            <Link href="/lookbook" className="btn btn-solid">
              Open the lookbook
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
