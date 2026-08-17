import type { Metadata } from "next";
import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import EditorialPair from "@/components/media/EditorialPair";
import ModelCredit from "@/components/campaign/ModelCredit";
import ParallaxNumeral from "@/components/motion/ParallaxNumeral";
import Reveal from "@/components/ui/Reveal";
import { LOOKBOOK } from "@/lib/catalog/lookbook";
import { campaignFor } from "@/lib/catalog/campaign";
import { CURRENT_DROP } from "@/lib/catalog/drops";
import { getProduct } from "@/lib/catalog/queries";
import type { LookbookSpread } from "@/lib/catalog/types";
import { SITE_URL } from "@/lib/site";
import { breadcrumbList, jsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Lookbook",
  description:
    "The Drop 001 lookbook — a small set of frames showing the pieces and how they sit together.",
  alternates: { canonical: "/lookbook" },
  openGraph: {
    type: "website",
    title: `${CURRENT_DROP.name} lookbook`,
    description:
      "A small set of frames showing the pieces and how they sit together.",
    url: `${SITE_URL}/lookbook`,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/lookbook#page`,
      url: `${SITE_URL}/lookbook`,
      name: `${CURRENT_DROP.name} lookbook`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    breadcrumbList(SITE_URL, [
      { name: "Home", path: "/" },
      { name: "Lookbook", path: "/lookbook" },
    ]),
  ],
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
        <ParallaxNumeral className="num type-meta text-ink-faint">
          {spread.index}
        </ParallaxNumeral>
        <p className="type-body-sm max-w-prose text-ink-muted">{spread.caption}</p>
      </div>
      <ModelCredit modelIds={spread.models} />
      <Wearing slugs={spread.wearing} />
    </div>
  );
}

export default function LookbookPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />

      {/* Opens full-bleed under the transparent header, like the home hero. */}
      <section className="on-dark relative flex min-h-[85svh] flex-col justify-end overflow-hidden">
        {/* The campaign's own hero when there is one — the lookbook and the
            home page should open on the same picture, because they are the
            same drop seen from two places. */}
        <ImageSlot
          image={campaignFor(CURRENT_DROP.id)?.hero.image ?? CURRENT_DROP.cover}
          fill
          priority
          sizes="100vw"
        />
        {/* Anchored to the block it protects, not to a fraction of the
            viewport. A band across a `min-h-[85svh]` section drifts as the
            screen height changes and leaves the type on bare picture — which
            is exactly the failure the home hero was rebuilt to avoid. */}
        <div className="page-frame relative z-10 pb-14">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -bottom-14 -z-10 bg-gradient-to-t from-black/90 via-black/80 to-transparent"
          />
          <p className="type-meta text-ink-on-dark">
            <span className="num">{CURRENT_DROP.index}</span>
            <span className="ml-4">Lookbook</span>
          </p>
          <h1 className="type-display-1 mt-6">{CURRENT_DROP.name}</h1>
          {/* Derived. It used to assert "Four frames. Every piece in the drop."
              — a count that a fifth spread would have falsified, and a coverage
              claim nothing in the data supports. */}
          <p className="type-meta mt-5 text-ink-on-dark-muted">
            <span className="num">
              {String(LOOKBOOK.length).padStart(2, "0")}
            </span>
            <span className="ml-3">
              {LOOKBOOK.length === 1 ? "Frame" : "Frames"} from the drop
            </span>
          </p>
        </div>
      </section>

      <div className="rhythm-default space-y-24 md:space-y-32">
        {LOOKBOOK.map((spread) => {
          if (spread.layout === "full") {
            return (
              <Reveal key={spread.id} as="section">
                <ImageSlot
                  image={spread.images[0]}
                  ratioSm="editorial"
                  sizes="100vw"
                />
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

          // The offset spread is the site's specimen-crop signature, so it is
          // the shared component rather than a second hand-built version of it.
          if (spread.layout === "offset") {
            return (
              <Reveal key={spread.id} as="section">
                <div className="page-frame">
                  <EditorialPair
                    wide={spread.images[0]}
                    crop={spread.images[1] ?? spread.images[0]}
                  />
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
          <p className="type-display-3 uppercase">Shop the drop.</p>
          <Link href={`/shop?drop=${CURRENT_DROP.slug}`} className="btn btn-solid">
            View all pieces
          </Link>
        </div>
      </section>
    </>
  );
}
