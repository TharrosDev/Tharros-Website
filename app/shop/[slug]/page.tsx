import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import BuyPanel from "@/components/product/BuyPanel";
import OnBody from "@/components/product/OnBody";
import FitStory from "@/components/product/FitStory";
import InFrames from "@/components/product/InFrames";
import Measurements from "@/components/product/Measurements";
import ProductGrid from "@/components/product/ProductGrid";
import Accordion from "@/components/ui/Accordion";
import SectionHeading from "@/components/ui/SectionHeading";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { categoryName } from "@/lib/catalog/categories";
import {
  allProductSlugs,
  AVAILABILITY_SCHEMA,
  framesFeaturing,
  galleryImages,
  getProduct,
  getRelated,
  onBodyImages,
  resolveAvailability,
  runStatus,
} from "@/lib/catalog/queries";
import { CURRENCY, formatPrice } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { SHIPPING_OPTIONS, FREE_SHIPPING_THRESHOLD } from "@/lib/commerce/shipping";
import { RETURN_WINDOW } from "@/lib/commerce/returns";
import { getDrop } from "@/lib/catalog/drops";
import { jsonLd } from "@/lib/jsonld";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return allProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) return { title: "Not found" };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} — THARROS`,
      description: product.description,
      url: `${SITE_URL}/shop/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const related = getRelated(product, 4);
  const availability = resolveAvailability(product);
  const drop = getDrop(product.drop);
  const run = runStatus(product);
  const frames = framesFeaturing(product.slug);

  /**
   * The page's numbering series, derived rather than typed.
   *
   * Every section carried a hard-coded index while three of them render only
   * when their data exists, so a piece with no fitting printed 01 followed by
   * 04 — which turns the mono numeral from a position in a sequence into
   * decoration. The sequence is now whatever is actually on the page.
   */
  const sections = [
    "record",
    onBodyImages(product).length > 0 ? "on-body" : null,
    product.fit.length > 0 ? "fit" : null,
    frames.length > 0 ? "frames" : null,
    related.length > 0 ? "related" : null,
  ].filter((id): id is string => id !== null);

  const sectionIndex = (id: string) =>
    String(sections.indexOf(id) + 1).padStart(2, "0");

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${SITE_URL}/shop/${product.slug}#product`,
        name: product.name,
        description: product.description,
        sku: product.variants[0]?.sku,
        color: product.colorway,
        category: categoryName(product.category),
        brand: { "@id": `${SITE_URL}/#organization` },
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/shop/${product.slug}`,
          price: (product.price / 100).toFixed(2),
          priceCurrency: CURRENCY,
          availability: AVAILABILITY_SCHEMA[availability],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: `${SITE_URL}/shop/${product.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />

      <div className="page-frame page-top-tight">
        <Breadcrumbs
          trail={[
            { name: "Shop", href: "/shop" },
            {
              name: categoryName(product.category),
              href: `/shop?category=${product.category}`,
            },
          ]}
          current={product.name}
        />
      </div>

      {/* The garment leads and the record supports it: seven columns of
          photograph against four of type. The split was 6/5 from a time when
          the frames were empty and giving them two thirds of the page would
          have been giving it to nothing; now that a frame carries a picture,
          the picture is what the page is for. */}
      <div className="page-frame mt-8 grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ProductGallery images={galleryImages(product)} productName={product.name} />
        </div>

        <div className="no-scrollbar lg:col-span-4 lg:col-start-9 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:max-h-[calc(100svh-var(--header-h)-3rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain">
          {/* The record opens on an index like every other block on the site.
              It had none, which is why the page's section numbering started at
              02. The code moves up here out of the specimen table: it is the
              piece's identifier, not one of its attributes. */}
          <p className="eyebrow border-t border-ink pt-4">
            <span className="num">{sectionIndex("record")}</span>
            <span>{product.variants[0]?.sku.replace(/-[^-]+$/, "")}</span>
          </p>

          <h1 className="type-display-3 mt-6 max-w-[16ch]">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-4">
            <p className="num type-mono-3">{formatPrice(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="num text-ink-faint line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            ) : null}
          </div>

          {/* The run, stated before anything has to be opened. These are the
              figures that make a small label credible, and they were previously
              collapsed inside an accordion. Real inventory only — the accent
              appears solely when the run is actually finished. */}
          {/* `type-mono-2` here made the stock count the heaviest figure in a
              column whose subject is the garment. The promoted mono steps are
              for full-width contexts — the hero numeral, the drop record — not
              for a 460px column beside a title. */}
          <p className="mt-8 flex items-baseline gap-3 border-t border-ink pt-4">
            <span
              className={`type-mono-3 ${run.remaining === 0 ? "text-signal" : ""}`}
            >
              {run.remaining}
            </span>
            <span className="type-meta text-ink-faint">
              {run.remaining === 0 ? "None left" : "left"} of{" "}
              <span className="num">{run.made}</span> made
            </span>
          </p>

          <p className="type-body mt-6 text-ink-muted">{product.description}</p>

          {/* The specimen table. Material and fit used to be two collapsed
              accordions; they are the two things that build confidence in a
              garment nobody can touch, so they are open by default now. */}
          <dl className="mt-8 divide-y divide-rule border-y border-rule">
            <div className="flex gap-6 py-4">
              <dt className="type-meta w-24 shrink-0 text-ink-faint">Colour</dt>
              <dd className="type-body-sm">{product.colorway}</dd>
            </div>
            {drop ? (
              <div className="flex gap-6 py-4">
                <dt className="type-meta w-24 shrink-0 text-ink-faint">Drop</dt>
                <dd className="type-body-sm">
                  <Link href={`/shop?drop=${drop.slug}`} className="link-rule link-rule-reveal">
                    {drop.name}
                  </Link>
                </dd>
              </div>
            ) : null}
            <div className="flex gap-6 py-4">
              <dt className="type-meta w-24 shrink-0 text-ink-faint">Material</dt>
              <dd className="type-body-sm text-ink-muted">
                {product.materials.join(" · ")}
              </dd>
            </div>
            <div className="flex gap-6 py-4">
              <dt className="type-meta w-24 shrink-0 text-ink-faint">Fit</dt>
              <dd className="type-body-sm text-ink-muted">
                {product.fit.join(" · ")}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <BuyPanel product={product} />
          </div>

          <div className="mt-10">
            <h2 className="visually-hidden">Product information</h2>
            <Accordion title="The piece" defaultOpen>
              <p className="type-body text-ink-muted">{product.story}</p>
            </Accordion>

            {/* Ahead of the run figures and the logistics: this is the last
                question between wanting the piece and picking a size. */}
            <Accordion title="Measurements">
              <Measurements product={product} />
            </Accordion>

            <Accordion title="The run">
              <ul className="type-body space-y-1.5 text-ink-muted">
                <li>
                  <span className="num">{run.made}</span> made in total,{" "}
                  <span className="num">{run.remaining}</span> still available.
                </li>
                {drop ? <li>Released as part of {drop.name}.</li> : null}
                <li>
                  {product.restock === "none"
                    ? "This run will not be remade."
                    : "If it returns it will be in a later drop, and it may not be identical."}
                </li>
              </ul>
              <p className="type-body mt-4 text-ink-muted">
                Garment measurements are published in the{" "}
                <Link href="/size-guide" className="link-rule">
                  size guide
                </Link>
                . Full material specification is confirmed on the production sample
                before launch.
              </p>
              <p className="type-meta mt-5 text-ink-faint">
                Runs are small because production is small, not as a sales tactic.
              </p>
            </Accordion>

            {/* Shipping, returns and care were three separate accordions. They
                are all "what happens after you buy it" and nobody opens them
                one at a time. */}
            <Accordion title="Care & logistics">
              <ul className="type-body space-y-1.5 text-ink-muted">
                {product.care.map((instruction) => (
                  <li key={instruction}>{instruction}</li>
                ))}
              </ul>
              <ul className="type-body mt-5 space-y-1.5 text-ink-muted">
                {SHIPPING_OPTIONS.map((option) => (
                  <li key={option.id}>
                    {option.name} — {option.detail}, {formatPrice(option.price)}
                  </li>
                ))}
                <li>
                  Free standard shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
                </li>
              </ul>
              <p className="type-body mt-5 text-ink-muted">
                Unworn pieces can be returned within {RETURN_WINDOW} of delivery. Full terms are
                on the{" "}
                <Link href="/returns" className="link-rule">
                  returns page
                </Link>
                .
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Past the buying decision the page turns back into an editorial: the
          piece on people, then how it is meant to sit. Both render nothing
          until there is something real behind them. */}
      <OnBody product={product} index={sectionIndex("on-body")} />

      {/* A plain wrapper: `FitStory` is itself the labelled section, and this
          carried a second one around it — two nested landmarks announcing the
          same heading. */}
      <div className="rhythm-tight">
        <div className="page-frame">
          <FitStory product={product} index={sectionIndex("fit")} />
        </div>
      </div>

      {/* The way out of a product page is the drop it belongs to, not another
          product card. */}
      <InFrames frames={frames} index={sectionIndex("frames")} />

      {related.length > 0 ? (
        <section className="rhythm-default">
          <div className="page-frame">
            {/* The heading was index-and-label only, so it emitted no h2 — and
                ProductGrid then supplied a visually hidden one saying the same
                words. One real heading instead of an invisible duplicate. */}
            <SectionHeading
              index={sectionIndex("related")}
              label="Related"
              title="You may also like."
              titleClass="type-display-3"
            />
            <div className="section-lead">
              <ProductGrid products={related} columns={4} specimen />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
