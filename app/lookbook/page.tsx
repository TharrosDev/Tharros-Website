import type { Metadata } from "next";
import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import { LOOKBOOK } from "@/lib/catalog/lookbook";
import { CURRENT_COLLECTION } from "@/lib/catalog/collections";
import { getProduct } from "@/lib/catalog/queries";
import type { LookbookSpread } from "@/lib/catalog/types";

export const metadata: Metadata = {
  title: "Lookbook",
  description:
    "THARROS Collection 01 lookbook — Summer 2026. Campaign imagery and the pieces worn in it.",
  alternates: { canonical: "/lookbook" },
};

function Wearing({ slugs }: { slugs: string[] }) {
  const products = slugs.map((slug) => getProduct(slug)).filter(Boolean);
  if (products.length === 0) return null;

  return (
    <p className="type-meta mt-3 flex flex-wrap gap-x-4 gap-y-1 text-ink-faint">
      <span>Wearing</span>
      {products.map((product) => (
        <Link
          key={product!.id}
          href={`/shop/${product!.slug}`}
          className="link-rule link-rule-reveal"
        >
          {product!.name}
        </Link>
      ))}
    </p>
  );
}

function Caption({ spread }: { spread: LookbookSpread }) {
  return (
    <div className="page-frame mt-5">
      <div className="flex flex-wrap items-baseline gap-4">
        <span className="num type-meta text-ink-faint">{spread.index}</span>
        <p className="type-body-sm max-w-prose text-ink-muted">{spread.caption}</p>
      </div>
      <Wearing slugs={spread.wearing} />
    </div>
  );
}

export default function LookbookPage() {
  return (
    <>
      {/* Opens full-bleed under the transparent header, like the home hero. */}
      <section className="on-dark relative flex min-h-[85svh] flex-col justify-end overflow-hidden">
        <ImageSlot image={CURRENT_COLLECTION.cover} fill priority sizes="100vw" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/45"
        />
        <div className="page-frame relative z-10 pb-14">
          <p className="type-meta text-ink-on-dark">
            <span className="num">01</span>
            <span className="ml-4">Lookbook</span>
          </p>
          <h1 className="type-display-1 mt-6">{CURRENT_COLLECTION.name}</h1>
          <p className="type-meta mt-5 text-ink-on-dark-muted">
            Tharros / {CURRENT_COLLECTION.season}
          </p>
        </div>
      </section>

      <div className="rhythm-default space-y-24 md:space-y-32">
        {LOOKBOOK.map((spread) => {
          if (spread.layout === "full") {
            return (
              <Reveal key={spread.id} as="section">
                <ImageSlot image={spread.images[0]} sizes="100vw" />
                <Caption spread={spread} />
              </Reveal>
            );
          }

          if (spread.layout === "pair") {
            return (
              <Reveal key={spread.id} as="section">
                <div className="page-frame grid gap-4 md:grid-cols-2">
                  {spread.images.map((image) => (
                    <ImageSlot
                      key={image.code}
                      image={image}
                      sizes="(min-width: 768px) 48vw, 100vw"
                    />
                  ))}
                </div>
                <Caption spread={spread} />
              </Reveal>
            );
          }

          if (spread.layout === "offset") {
            return (
              <Reveal key={spread.id} as="section">
                <div className="page-frame grid gap-6 md:grid-cols-12">
                  <div className="md:col-span-5">
                    <ImageSlot
                      image={spread.images[0]}
                      sizes="(min-width: 768px) 40vw, 100vw"
                    />
                  </div>
                  <div className="md:col-span-6 md:col-start-7 md:pt-24">
                    <ImageSlot
                      image={spread.images[1] ?? spread.images[0]}
                      sizes="(min-width: 768px) 48vw, 100vw"
                    />
                  </div>
                </div>
                <Caption spread={spread} />
              </Reveal>
            );
          }

          return (
            <Reveal key={spread.id} as="section">
              <div className="page-frame grid grid-cols-3 gap-3">
                {spread.images.map((image) => (
                  <ImageSlot key={image.code} image={image} sizes="31vw" />
                ))}
              </div>
              <Caption spread={spread} />
            </Reveal>
          );
        })}
      </div>

      <section className="rhythm-tight border-t border-rule">
        <div className="page-frame flex flex-wrap items-center justify-between gap-6">
          <p className="type-display-3 uppercase">Shop the collection.</p>
          <Link href="/shop?collection=collection-01" className="btn btn-solid">
            View all pieces
          </Link>
        </div>
      </section>
    </>
  );
}
