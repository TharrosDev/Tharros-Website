import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import BuyPanel from "@/components/product/BuyPanel";
import ProductGrid from "@/components/product/ProductGrid";
import Accordion from "@/components/ui/Accordion";
import SectionHeading from "@/components/ui/SectionHeading";
import { categoryName } from "@/lib/catalog/categories";
import {
  allProductSlugs,
  AVAILABILITY_SCHEMA,
  galleryImages,
  getProduct,
  getRelated,
  resolveAvailability,
  runStatus,
} from "@/lib/catalog/queries";
import { CURRENCY, formatPrice } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { SHIPPING_OPTIONS, FREE_SHIPPING_THRESHOLD } from "@/lib/commerce/shipping";
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

      <div
        className="page-frame"
        style={{ paddingTop: "calc(var(--header-h) + 2rem)" }}
      >
        <nav aria-label="Breadcrumb">
          <ol className="type-meta flex flex-wrap items-center gap-2 text-ink-faint">
            <li className="flex items-center gap-2">
              <Link href="/shop" className="-my-2 inline-block py-2 transition-opacity hover:opacity-60">
                Shop
              </Link>
              <span aria-hidden="true">/</span>
            </li>
            <li className="flex items-center gap-2">
              <Link
                href={`/shop?category=${product.category}`}
                className="-my-2 inline-block py-2 transition-opacity hover:opacity-60"
              >
                {categoryName(product.category)}
              </Link>
              <span aria-hidden="true">/</span>
            </li>
            <li className="text-ink">{product.name}</li>
          </ol>
        </nav>
      </div>

      {/* Gallery gives up a column to the record beside it. With no photography
          yet, four empty frames should not own two thirds of the page. */}
      <div className="page-frame mt-6 grid gap-x-12 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <ProductGallery images={galleryImages(product)} productName={product.name} />
        </div>

        <div className="no-scrollbar lg:col-span-5 lg:col-start-8 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:max-h-[calc(100svh-var(--header-h)-3rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain">
          <h1 className="type-display-3">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-4">
            <p className="num text-lg">{formatPrice(product.price)}</p>
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
          <p className="mt-8 flex items-baseline gap-3 border-t border-ink pt-4">
            <span
              className={`type-mono-2 ${run.remaining === 0 ? "text-signal" : ""}`}
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
            <div className="flex gap-6 py-3">
              <dt className="type-meta w-24 shrink-0 text-ink-faint">Colour</dt>
              <dd className="type-body-sm">{product.colorway}</dd>
            </div>
            <div className="flex gap-6 py-3">
              <dt className="type-meta w-24 shrink-0 text-ink-faint">Code</dt>
              {/* Style code without the size suffix. */}
              <dd className="num text-[0.8125rem]">
                {product.variants[0]?.sku.replace(/-[^-]+$/, "")}
              </dd>
            </div>
            {drop ? (
              <div className="flex gap-6 py-3">
                <dt className="type-meta w-24 shrink-0 text-ink-faint">Drop</dt>
                <dd className="type-body-sm">
                  <Link href={`/shop?drop=${drop.slug}`} className="link-rule link-rule-reveal">
                    {drop.name}
                  </Link>
                </dd>
              </div>
            ) : null}
            <div className="flex gap-6 py-3">
              <dt className="type-meta w-24 shrink-0 text-ink-faint">Material</dt>
              <dd className="type-body-sm text-ink-muted">
                {product.materials.join(" · ")}
              </dd>
            </div>
            <div className="flex gap-6 py-3">
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
                Unworn pieces can be returned within 30 days of delivery. Full terms are
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

      {related.length > 0 ? (
        <section className="rhythm-default">
          <div className="page-frame">
            <SectionHeading index="02" label="You may also like" />
            <div className="mt-12">
              <ProductGrid products={related} heading="You may also like" columns={4} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
