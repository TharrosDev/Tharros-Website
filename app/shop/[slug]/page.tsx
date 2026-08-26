import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import BuyPanel from "@/components/product/BuyPanel";
import InFrames from "@/components/product/InFrames";
import Measurements from "@/components/product/Measurements";
import ModelCredit from "@/components/product/ModelCredit";
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
  heroImage,
  getProduct,
  getRelated,
  resolveAvailability,
  releaseDate,
  runStatus,
} from "@/lib/catalog/queries";
import { CURRENCY, formatDate, formatPrice } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { freeShippingLine, shippingLines } from "@/lib/commerce/shipping";
import { RETURN_WINDOW } from "@/lib/commerce/returns";
import { getDrop } from "@/lib/catalog/drops";
import { garmentId, isReleased } from "@/lib/catalog/releases";
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
  // A piece still being sampled has no run size and no stock, so both figures
  // print 0 — and a signal-red 0 above "None left of 0 made" reads as a run
  // that sold out rather than as one that has not been cut yet.
  const released = isReleased(product);
  const releasesOn = releaseDate(product);
  const frames = framesFeaturing(product.slug);

  /**
   * The numbering counts the sections that actually render. Two of the three
   * are conditional, so a hard-coded index printed 01 followed by 04 on a
   * piece with no campaign frames — a position in a sequence turned into
   * decoration.
   */
  const sections = [
    frames.length > 0 ? "frames" : null,
    related.length > 0 ? "related" : null,
  ].filter((id): id is string => id !== null);

  const sectionIndex = (id: string) =>
    String(sections.indexOf(id) + 1).padStart(2, "0");

  // Published only when the piece actually has a photograph. A slot with no
  // `src` draws a stand-in, and publishing that URL would be telling a search
  // engine that a piece of free-licence stock is the garment.
  const heroSrc = heroImage(product).src;

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
        ...(heroSrc ? { image: `${SITE_URL}${heroSrc}` } : {}),
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
          photograph against four of type. */}
      <div className="page-frame mt-8 grid gap-x-16 gap-y-12 lg:grid-cols-12">
        {/* THE PICTURE IS THE COLUMN THAT STICKS. It is bounded by its own
            `svh` height rather than by a cap on the column — a frame takes its
            height from its width, so a `max-h` here would put a scrollbar down
            the side of the photograph. The specification beside it is taller
            than any viewport and scrolls past.

            Sticky only above 660px tall, which is where the frame stops
            fitting: it is `0.78h`, the caption runs ~47px and the header
            clearance is 96px, so it fits while `143 <= 0.22h`. Below that the
            whole treatment stands down and nothing is stuck out of reach. */}
        <div className="lg:col-span-7 [@media(min-height:660px)]:lg:sticky [@media(min-height:660px)]:lg:top-[calc(var(--header-h)+1.5rem)] [@media(min-height:660px)]:lg:self-start">
          <ProductGallery images={galleryImages(product)} productName={product.name} />
        </div>

        {/* NOT STICKY, AND NOT AN INTERNAL SCROLLER. This column is longer
            than any viewport — name, price, sizes, buy control, specification
            and three accordions — so it scrolls with the page. It was capped at
            the viewport with a hidden overflow, which put the ADD TO BAG button
            out of reach on every window under 1080px tall. */}
        <div className="lg:col-span-4 lg:col-start-9 lg:self-start">
          {/* THE ORDER IS THE BUYING DECISION: name, price, colour, size, add.
              Everything that describes the piece rather than sells it sits
              below the control, and the garment number is a signature rather
              than an accession number — small mono, beside the drop it came
              from, not competing with the name above it. */}
          <p className="type-meta flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-ink pt-4 text-ink-faint">
            {drop ? (
              <Link
                href={`/shop?drop=${drop.slug}`}
                className="-my-2 py-2 underline-offset-4 hover:underline"
              >
                {drop.name}
              </Link>
            ) : null}
            {released ? (
              <Link
                href={`/releases/${garmentId(product).toLowerCase()}`}
                className="num -my-2 py-2 underline-offset-4 hover:underline"
              >
                {garmentId(product)}
              </Link>
            ) : (
              <span className="num">{garmentId(product)}</span>
            )}
          </p>

          <h1 className="type-display-3 mt-6 max-w-[16ch]">{product.name}</h1>

          <p className="num type-mono-3 mt-4">{formatPrice(product.price)}</p>

          <p className="type-body mt-6 text-ink-muted">{product.description}</p>

          <p className="type-meta mt-6 text-ink-faint">
            Colour <span className="ms-3 text-ink">{product.colorway}</span>
          </p>

          {/* Who wore it and what size they took. Returns null until an actual
              fitting has happened. */}
          <ModelCredit product={product} />

          <div className="mt-8">
            <BuyPanel product={product} />
          </div>

          {/* THE RUN AS A PROPERTY OF THE RELEASE, NOT AS AN ARGUMENT.
              "Limited release · 40 units · 24 left" is the whole claim, set in
              the same 11px mono as everything else technical, below the control
              rather than above it. The figures are derived from real inventory,
              so the page cannot manufacture scarcity, and a piece that has not
              been released says the one true thing instead of printing a zero. */}
          <p className="type-meta mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-rule pt-5 text-ink-faint">
            {released ? (
              <>
                <span>Limited release</span>
                <span aria-hidden="true">·</span>
                <span>
                  <span className="num">{run.made}</span> units
                </span>
                <span aria-hidden="true">·</span>
                <span className={run.remaining === 0 ? "text-ink" : ""}>
                  {run.remaining === 0 ? (
                    "sold out"
                  ) : (
                    <>
                      <span className="num">{run.remaining}</span> left
                    </>
                  )}
                </span>
              </>
            ) : (
              <span>
                {drop?.name ?? "Coming soon"}
                {releasesOn ? (
                  <>
                    <span aria-hidden="true"> · </span>
                    <time dateTime={releasesOn}>{formatDate(releasesOn)}</time>
                  </>
                ) : null}
              </span>
            )}
          </p>

          {/* Material and fit are the two things that build confidence in a
              garment nobody can touch, so they are stated rather than
              collapsed — but after the decision, not in front of it. */}
          <dl className="mt-8 divide-y divide-rule border-y border-rule">
            <div className="flex gap-6 py-4">
              <dt className="type-meta w-24 shrink-0 text-ink-faint">Material</dt>
              <dd className="type-body-sm text-ink-muted">
                {product.materials.join(" · ")}
              </dd>
            </div>
            {/* FIT HAS ONE HOME AND THIS IS IT. The same three lines were also
                set as a three-column list under a "How it fits" heading a
                screen below. */}
            <div className="flex gap-6 py-4">
              <dt className="type-meta w-24 shrink-0 text-ink-faint">Fit</dt>
              <dd className="type-body-sm text-ink-muted">
                {product.fit.join(" · ")}
              </dd>
            </div>
          </dl>

          <div className="mt-10">
            <h2 className="visually-hidden">Product information</h2>
            <Accordion title="Description" defaultOpen>
              <p className="type-body text-ink-muted">{product.story}</p>
            </Accordion>

            {/* Ahead of the logistics: this is the last question between
                wanting the piece and picking a size. */}
            <Accordion title="Measurements">
              <Measurements product={product} />
            </Accordion>

            {/* Shipping, returns and care were three accordions and nobody
                opens them one at a time. Every rate comes from
                `lib/commerce/shipping.ts` through `shippingLines()`, so this
                cannot quote a figure the bag and the checkout do not. */}
            <Accordion title="Care & delivery">
              <ul className="type-body space-y-1.5 text-ink-muted">
                {product.care.map((instruction) => (
                  <li key={instruction}>{instruction}</li>
                ))}
              </ul>
              <ul className="type-body mt-5 space-y-1.5 text-ink-muted">
                {shippingLines().map((line) => (
                  <li key={line}>{line}</li>
                ))}
                <li>{freeShippingLine()}</li>
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

      {/* Past the buying decision: the campaign frames this piece appears in,
          which are photographs the gallery does not hold. Nothing when there
          are none. */}
      <InFrames frames={frames} index={sectionIndex("frames")} />

      {related.length > 0 ? (
        <section className="rhythm-default">
          <div className="page-frame">
            <SectionHeading
              index={sectionIndex("related")}
              label="Related"
              title="You may also like."
              titleClass="type-display-3"
            />
            <div className="section-lead">
              <ProductGrid products={related} columns={4} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
