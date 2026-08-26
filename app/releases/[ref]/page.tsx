import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ProductGallery from "@/components/product/ProductGallery";
import SectionHeading from "@/components/ui/SectionHeading";
import PieceRail from "@/components/releases/PieceRail";
import {
  allReleaseRefs,
  releaseEntries,
  RELEASE_STATE_LABEL,
  getReleaseEntry,
} from "@/lib/catalog/releases";
import { categoryName } from "@/lib/catalog/categories";
import { galleryImages } from "@/lib/catalog/queries";
import { formatDate, formatPrice } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { breadcrumbList, jsonLd } from "@/lib/jsonld";

type Params = Promise<{ ref: string }>;

export function generateStaticParams() {
  return allReleaseRefs().map((ref) => ({ ref }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { ref } = await params;
  const entry = getReleaseEntry(ref);
  if (!entry) return { title: "Not found" };

  return {
    title: `${entry.garmentId} — ${entry.product.name}`,
    description: `${entry.product.name}. ${entry.made} made. ${entry.product.description}`,
    alternates: { canonical: `/releases/${entry.ref}` },
    openGraph: {
      type: "website",
      title: `${entry.garmentId} ${entry.product.name} — THARROS`,
      description: entry.product.description,
      url: `${SITE_URL}/releases/${entry.ref}`,
    },
  };
}

/**
 * THE RECORD — one garment, documented rather than sold.
 *
 * The product page's gallery-and-column layout with the machinery for buying
 * taken out: no buy panel, no size selector, no logistics. The run figures sit
 * at the top of the column because they are what a record is about, which is
 * the one place on the site where that is true.
 */
export default async function ReleaseRecordPage({ params }: { params: Params }) {
  const { ref } = await params;
  const entry = getReleaseEntry(ref);
  if (!entry) notFound();

  const { product, drop } = entry;
  const frames = galleryImages(product);
  const others = releaseEntries()
    .filter((e) => e.garmentId !== entry.garmentId)
    .slice(0, 4);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList(SITE_URL, [
        { name: "Home", path: "/" },
        { name: "Releases", path: "/releases" },
        { name: entry.garmentId, path: `/releases/${entry.ref}` },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />

      <article>
        <div className="page-frame page-top-tight">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Releases", href: "/releases" },
            ]}
            current={entry.garmentId}
          />
        </div>

        {/* The same split as the product page — seven columns of photograph
            against four of type — and the same sticky rule with it: the gallery
            is bounded by its own `svh` height so it fits a desktop window, the
            record beside it is not, so the picture is the column that holds.
            The min-height query stands it down on a window too short to take
            it, exactly as `/shop/[slug]` does. */}
        <div className="page-frame mt-8 grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7 [@media(min-height:660px)]:lg:sticky [@media(min-height:660px)]:lg:top-[calc(var(--header-h)+1.5rem)] [@media(min-height:660px)]:lg:self-start">
            <ProductGallery images={frames} productName={product.name} />
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:self-start">
            {/* The number IS the heading. On the shop page the name leads,
                because a shopper is looking for a hoodie; here the reader is
                looking up a record, and a record is found by its number. */}
            <p className="eyebrow border-t border-ink pt-4">
              <span>Record</span>
              <span>{drop?.name ?? categoryName(product.category)}</span>
            </p>

            {/* `type-mono-2`, not `-1`. The promoted mono steps are for a
                full-width context — the hero numeral, the drop record — and
                this column is 460px, where `type-mono-1` broke TH-008 across
                two lines as "TH-" and "008". Same reasoning the product page
                already applies to its run figure. */}
            <h1 className="num type-mono-2 mt-6">{entry.garmentId}</h1>
            <p className="type-display-3 mt-3 max-w-[16ch] uppercase">{product.name}</p>

            {/* The two figures this page exists to state, before anything else
                it says. Both derived. */}
            <dl className="mt-8 grid grid-cols-2 gap-x-8 border-t border-ink pt-5">
              <div>
                <dt className="type-meta text-ink-faint">Made</dt>
                <dd className="num type-mono-3 mt-2">{entry.made}</dd>
              </div>
              <div>
                <dt className="type-meta text-ink-faint">
                  {entry.state === "closed" ? "Remaining" : "Available"}
                </dt>
                <dd
                  className={`num type-mono-3 mt-2 ${entry.state === "closed" ? "text-signal" : ""}`}
                >
                  {entry.remaining}
                </dd>
              </div>
            </dl>

            <p className="type-body mt-8 text-ink-muted">{product.description}</p>
            <p className="type-body mt-5 text-ink-muted">{product.story}</p>

            {/* The specimen table, in the shape the product page uses — minus
                the material and fit rows, which are there to help somebody
                decide whether to buy a thing. This is about what it was. */}
            <dl className="mt-10 divide-y divide-rule border-y border-rule">
              <div className="flex gap-6 py-4">
                <dt className="type-meta w-32 shrink-0 text-ink-faint">Colour</dt>
                <dd className="type-body-sm">{product.colorway}</dd>
              </div>
              <div className="flex gap-6 py-4">
                <dt className="type-meta w-32 shrink-0 text-ink-faint">Category</dt>
                <dd className="type-body-sm">{categoryName(product.category)}</dd>
              </div>
              <div className="flex gap-6 py-4">
                <dt className="type-meta w-32 shrink-0 text-ink-faint">Drop</dt>
                <dd className="type-body-sm">{drop?.name ?? "—"}</dd>
              </div>
              <div className="flex gap-6 py-4">
                <dt className="type-meta w-32 shrink-0 text-ink-faint">Released</dt>
                <dd className="type-body-sm">
                  {entry.releasedAt ? formatDate(entry.releasedAt) : "—"}
                </dd>
              </div>
              <div className="flex gap-6 py-4">
                <dt className="type-meta w-32 shrink-0 text-ink-faint">Price at release</dt>
                <dd className="type-body-sm num">{formatPrice(product.price)}</dd>
              </div>
              <div className="flex gap-6 py-4">
                <dt className="type-meta w-32 shrink-0 text-ink-faint">State</dt>
                <dd className="type-body-sm">{RELEASE_STATE_LABEL[entry.state]}</dd>
              </div>
            </dl>

            {/* The one commercial line on the page, and it is a text link. A
                closed run has nothing to link to, so nothing is said. */}
            {entry.state === "available" ? (
              <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
                <p className="type-meta text-ink-faint">This run is still open.</p>
                <Link href={`/shop/${product.slug}`} className="link-rule link-rule-reveal">
                  Buy this piece
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        {others.length > 0 ? (
          <div className="page-frame rhythm-tight">
            <SectionHeading
              index="01"
              label="Released"
              title="Elsewhere in the record."
              titleClass="type-display-3"
              action={{ href: "/releases", label: "All releases" }}
              className="mb-12"
            />
            <PieceRail entries={others} />
          </div>
        ) : null}
      </article>
    </>
  );
}
