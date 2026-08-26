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
  runStatus,
} from "@/lib/catalog/queries";
import { CURRENCY, formatPrice } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { SHIPPING_OPTIONS, FREE_SHIPPING_THRESHOLD } from "@/lib/commerce/shipping";
import { RETURN_WINDOW } from "@/lib/commerce/returns";
import { getDrop } from "@/lib/catalog/drops";
import { garmentId, isRecorded } from "@/lib/catalog/archive";
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
  // that sold out rather than as one that has not been cut yet. The em dash is
  // the same admission `ProductCard` and the archive ledger already make, and
  // the record is where the number appears once there is one.
  const recorded = isRecorded(product);
  const frames = framesFeaturing(product.slug);

  /**
   * The page's numbering series, derived rather than typed.
   *
   * Every section carried a hard-coded index while some of them render only
   * when their data exists, so a piece with no campaign frames printed 01
   * followed by 04 — which turns the mono numeral from a position in a
   * sequence into decoration. The sequence is whatever is actually on the
   * page, and the page is three sections at most.
   */
  const sections = [
    "record",
    frames.length > 0 ? "frames" : null,
    related.length > 0 ? "related" : null,
  ].filter((id): id is string => id !== null);

  const sectionIndex = (id: string) =>
    String(sections.indexOf(id) + 1).padStart(2, "0");

  // Google wants an image on a Product node and there is not one to give yet:
  // every product slot is unphotographed, so `heroImage` resolves to a frame
  // with no `src` and the site draws a stand-in. Publishing that URL would be
  // telling a search engine that a piece of free-licence stock is the garment.
  // The key is therefore conditional rather than absent-forever — the day a
  // product carries real photography it starts being published, with no other
  // change here.
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
          photograph against four of type. The split was 6/5 from a time when
          the frames were empty and giving them two thirds of the page would
          have been giving it to nothing; now that a frame carries a picture,
          the picture is what the page is for. */}
      <div className="page-frame mt-8 grid gap-x-16 gap-y-12 lg:grid-cols-12">
        {/* THE PICTURE IS THE COLUMN THAT STICKS.
            The sticky treatment used to be on the record beside it, which is
            backwards in both directions: the record is 1763px and never fits a
            screen, while the gallery is already capped — its main frame is
            `78svh` with `object-cover` — so it comes in around 749px and fits
            almost any desktop window. Sticking the tall one hid its own buy
            control; sticking the short one keeps the garment on screen while
            the specification scrolls past it, which is the way round the page
            wanted anyway.

            No `max-h` and no internal scroll: the frame is bounded by its own
            `svh` height rather than by a cap on the column, which is the
            pattern `ProcessSection` already uses for a picture in a sticky
            column. The min-height query stands the whole thing down on a window
            too short to hold it, so nothing is ever stuck out of reach.

            660px is where it stops fitting, not a round number: the frame is
            `0.78h`, the caption runs about 47px and the header clearance is
            96px, so the column fits while `143 <= 0.22h` — h >= 650. The first
            pass guessed 700 and left a real 677px-tall Chrome window unstuck
            with the void still in it. */}
        <div className="lg:col-span-7 [@media(min-height:660px)]:lg:sticky [@media(min-height:660px)]:lg:top-[calc(var(--header-h)+1.5rem)] [@media(min-height:660px)]:lg:self-start">
          <ProductGallery images={galleryImages(product)} productName={product.name} />
        </div>

        {/* NOT STICKY, AND NOT AN INTERNAL SCROLLER.
            It was both: capped at the viewport with `overflow-y-auto` and
            `no-scrollbar`, which is the bound `CLAUDE.md` asks every sticky
            column to carry. The bound is right for a column that nearly fits.
            This one is 1419px of record — name, price, run, description, six
            specimen rows, the size selector, the buy control and three
            accordions — so it never fits any viewport, and what the cap
            actually did was hide 639–839px of it behind a scroll region with
            no scrollbar to say so.

            Measured: the ADD TO BAG button sits at y=995 inside a column
            clipped at 731 / 831 / 931. At 1440x700, x800 and x900 the primary
            commerce control on the product page was not visible and not
            reachable without discovering an invisible nested scroller. Only
            1080-tall screens ever showed it.

            A sticky column is for content shorter than the screen. This is not
            that, so it scrolls with the page like the gallery beside it. */}
        <div className="lg:col-span-4 lg:col-start-9 lg:self-start">
          {/* The record opens on an index like every other block on the site.
              It had none, which is why the page's section numbering started at
              02. The garment number moves up here out of the specimen table: it
              is the piece's identifier, not one of its attributes — and it is
              a link, because the number is the one thing on this page that
              exists on both sides of the run closing. */}
          <p className="eyebrow border-t border-ink pt-4">
            <span className="num">{sectionIndex("record")}</span>
            {recorded ? (
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

          {/* One price. `compareAtPrice` was an optional field no product has
              ever set, rendering a struck-through was-price for a sale this
              label has not run and does not plan to — see the note on
              `ReleaseState`. */}
          <p className="num type-mono-3 mt-4">{formatPrice(product.price)}</p>

          {/* The run, stated before anything has to be opened. These are the
              figures that make a small label credible, and they were previously
              collapsed inside an accordion. Real inventory only — the accent
              appears solely when the run is actually finished. */}
          {/* `type-mono-2` here made the stock count the heaviest figure in a
              column whose subject is the garment. The promoted mono steps are
              for full-width contexts — the hero numeral, the drop record — not
              for a 460px column beside a title. */}
          {/* THE RUN AS A PROPERTY OF THE RELEASE, NOT AS AN ARGUMENT.
              "Limited release — 40 units" is the whole claim. The figures are
              still derived from real inventory, so the page cannot manufacture
              scarcity; what changed is that they no longer need a sentence
              explaining what the label can currently produce. A piece that has
              not been released has no run size, so it says the one thing that
              is true about it instead of printing a zero. */}
          <p className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-ink pt-4">
            {recorded ? (
              <>
                <span className="type-meta text-ink-faint">Limited release</span>
                <span
                  className={`type-mono-3 ${run.remaining === 0 ? "text-signal" : ""}`}
                >
                  {run.made}
                </span>
                <span className="type-meta text-ink-faint">
                  {run.remaining === 0 ? (
                    "units · sold out"
                  ) : (
                    <>
                      units ·{" "}
                      <span className="num">{run.remaining}</span> left
                    </>
                  )}
                </span>
              </>
            ) : (
              <span className="type-meta text-ink-faint">
                {drop?.name ?? "Coming soon"} · not released yet
              </span>
            )}
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
            {/* FIT HAS ONE HOME AND THIS IS IT. The same three lines were
                also set as a three-column list under a "How it fits" heading
                with its own display-3 title, a screen below — the record
                stating the fit, and then a whole section restating it in
                bigger type. */}
            <div className="flex gap-6 py-4">
              <dt className="type-meta w-24 shrink-0 text-ink-faint">Fit</dt>
              <dd className="type-body-sm text-ink-muted">
                {product.fit.join(" · ")}
              </dd>
            </div>
          </dl>

          {/* Who wore it and what size they took. Returns null until an actual
              fitting has happened, which is why it is a component and not a
              row in the table above. */}
          <ModelCredit product={product} />

          <div className="mt-8">
            <BuyPanel product={product} />
          </div>

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

            {/* THE RUN ACCORDION IS GONE. It restated the two figures printed
                beside the price, then added that how many get made is decided
                on the production sample and that the full material
                specification is confirmed before launch — a manufacturing
                schedule, inside a product page, under a heading a shopper
                opened expecting stock. The one line worth keeping is the
                restock claim, and it only renders when the data states it,
                which is why it lives in `BuyPanel` beside the decision it
                affects.

                Shipping, returns and care were three separate accordions.
                They are all "what happens after you buy it" and nobody opens
                them one at a time. */}
            <Accordion title="Care & delivery">
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

      {/* PAST THE BUYING DECISION, ONE EDITORIAL SECTION AND ONE WAY OUT.
          There were three. "On body" was a rail of the model frames — the same
          photographs the gallery immediately above it had just shown, in the
          same order, at a smaller size. "How it fits" was the three fit lines
          from the record set as a three-up list under a display-3 heading. Both
          were the page saying a thing twice, and between them they added about
          a screen and a half of scroll to every product.

          What survives is the part that brings something new: the campaign
          frames this piece appears in, which are photographs the gallery does
          not hold. It renders nothing when there are none. */}
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
              <ProductGrid products={related} columns={4} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
