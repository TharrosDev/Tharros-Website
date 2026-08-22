import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import CinematicFrame from "@/components/media/CinematicFrame";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ArchiveLedger from "@/components/archive/ArchiveLedger";
import {
  allArchiveRefs,
  archiveEntries,
  ARCHIVE_STATE_LABEL,
  getArchiveEntry,
} from "@/lib/catalog/archive";
import { categoryName } from "@/lib/catalog/categories";
import { galleryImages, isPurchasable } from "@/lib/catalog/queries";
import { formatDate, formatPrice } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { breadcrumbList, jsonLd } from "@/lib/jsonld";

type Params = Promise<{ ref: string }>;

export function generateStaticParams() {
  return allArchiveRefs().map((ref) => ({ ref }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { ref } = await params;
  const entry = getArchiveEntry(ref);
  if (!entry) return { title: "Not found" };

  return {
    title: `${entry.garmentId} — ${entry.product.name}`,
    description: `${entry.product.name}. ${entry.made} made. ${entry.product.description}`,
    alternates: { canonical: `/archive/${entry.ref}` },
    openGraph: {
      type: "website",
      title: `${entry.garmentId} ${entry.product.name} — THARROS archive`,
      description: entry.product.description,
      url: `${SITE_URL}/archive/${entry.ref}`,
    },
  };
}

/**
 * THE RECORD — one garment, documented rather than sold.
 *
 * This is deliberately not the product page with the buy button taken out.
 * The product page answers "should I get this", so it leads with a gallery, a
 * price and a size selector. This answers "what was this", so it leads with
 * the number and the run, sets the figures at the scale the page is actually
 * about, and keeps the single link to the shop at the bottom in metadata
 * weight — present for the pieces still available, never the point.
 *
 * The two pages share their data and none of their composition. That is the
 * whole argument for the archive existing as its own route.
 */
export default async function ArchiveRecordPage({ params }: { params: Params }) {
  const { ref } = await params;
  const entry = getArchiveEntry(ref);
  if (!entry) notFound();

  const { product, drop } = entry;
  const frames = galleryImages(product);
  const buyable = isPurchasable(product);
  const others = archiveEntries()
    .filter((e) => e.garmentId !== entry.garmentId)
    .slice(0, 4);

  /**
   * The mono index counts the sections that actually render, exactly as the
   * product page does. Material and development are both conditional on data
   * that does not exist for any piece yet, so a hard-coded ladder here would
   * print 02 followed by 04 and turn a position in a sequence into decoration.
   */
  const sections = [
    "piece",
    frames.length > 1 ? "frames" : null,
    others.length > 0 ? "others" : null,
  ].filter((id): id is string => id !== null);

  const sectionIndex = (id: string) => String(sections.indexOf(id) + 1).padStart(2, "0");

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList(SITE_URL, [
        { name: "Home", path: "/" },
        { name: "Archive", path: "/archive" },
        { name: entry.garmentId, path: `/archive/${entry.ref}` },
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
              { name: "Archive", href: "/archive" },
            ]}
            current={entry.garmentId}
            className="mb-10"
          />

          {/* The number IS the heading. On the shop page the name leads,
              because a shopper is looking for a hoodie; here the reader is
              looking up a record, and a record is found by its number. */}
          <Reveal className="rule-draw pt-4">
            <p className="eyebrow">
              <span>Record</span>
              <span>{drop?.name ?? categoryName(product.category)}</span>
            </p>
            <h1 className="num type-mono-1 mt-10 md:mt-12">{entry.garmentId}</h1>
            <p className="type-display-3 mt-4 uppercase">{product.name}</p>
          </Reveal>

          {/* The specimen block: the figures this page exists to state, at the
              scale that says so. Every one derived. */}
          <dl className="section-lead grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-4">
            {/* An unreleased piece has no run size and no stock: both figures
                would print 0, which reads as "none were made" rather than as
                "this has not been made yet". The em dash is the same admission
                the size tables already use for a measurement nobody has taken. */}
            <div>
              <dt className="type-meta text-ink-faint">Made</dt>
              <dd className="num type-mono-2 mt-2">
                {entry.state === "in-development" ? <>&mdash;</> : entry.made}
              </dd>
            </div>
            <div>
              <dt className="type-meta text-ink-faint">
                {entry.state === "archived" ? "Remaining" : "Available"}
              </dt>
              <dd
                className={`num type-mono-2 mt-2 ${entry.state === "archived" ? "text-signal" : ""}`}
              >
                {entry.state === "in-development" ? <>&mdash;</> : entry.remaining}
              </dd>
            </div>
            <div>
              <dt className="type-meta text-ink-faint">Released</dt>
              <dd className="type-mono-3 mt-2">
                {product.releasedAt && drop?.releasedAt ? formatDate(product.releasedAt) : "—"}
              </dd>
            </div>
            <div>
              <dt className="type-meta text-ink-faint">State</dt>
              <dd className="type-mono-3 mt-2">{ARCHIVE_STATE_LABEL[entry.state]}</dd>
            </div>
          </dl>
        </div>

        {/* One frame, given a whole screen. The archive's job is to make
            someone look closely at a garment they cannot buy, and nothing else
            on this page competes with this. */}
        {frames[0] ? (
          <CinematicFrame
            image={frames[0]}
            priority
            className="mt-16 md:mt-24"
            eyebrow={entry.garmentId}
            caption={product.name}
            aside={
              <>
                <span className="num">{entry.made}</span> made
              </>
            }
          />
        ) : null}

        <div className="page-frame rhythm-tight">
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal className="rule-draw pt-4">
                <p className="eyebrow">
                  <span className="num">{sectionIndex("piece")}</span>
                  <span>The piece</span>
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 lg:pt-4">
              <Reveal delay={90}>
                <p className="type-lead">{product.description}</p>
                <p className="type-body mt-6 text-ink-muted">{product.story}</p>
              </Reveal>

              <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="border-t border-rule pt-3">
                  <dt className="type-meta text-ink-faint">Colour</dt>
                  <dd className="type-body-sm mt-1">{product.colorway}</dd>
                </div>
                <div className="border-t border-rule pt-3">
                  <dt className="type-meta text-ink-faint">Category</dt>
                  <dd className="type-body-sm mt-1">{categoryName(product.category)}</dd>
                </div>
                <div className="border-t border-rule pt-3">
                  <dt className="type-meta text-ink-faint">Drop</dt>
                  <dd className="type-body-sm mt-1">{drop?.name ?? "—"}</dd>
                </div>
                <div className="border-t border-rule pt-3">
                  <dt className="type-meta text-ink-faint">Price at release</dt>
                  <dd className="type-body-sm num mt-1">{formatPrice(product.price)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* The remaining frames, as a study rather than as a gallery: no
            counter, no thumbnails, nothing to operate. Just the pictures. */}
        {frames.length > 1 ? (
          <div className="rhythm-tight">
            {/* The opener sits on the page grid; the frames break out of it.
                A full-bleed frame nested inside `page-frame` is not full-bleed,
                it is a frame with gutters — so the padding goes on the heading
                rather than on the section. */}
            <div className="page-frame">
              <SectionHeading index={sectionIndex("frames")} label="Frames" title="The rest of it." />
            </div>
            <div className="section-lead space-y-16 md:space-y-24">
              {frames.slice(1).map((image, i) => (
                <CinematicFrame
                  key={image.code}
                  image={image}
                  height="half"
                  eyebrow={String(i + 2).padStart(2, "0")}
                  caption={image.alt}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* The one commercial line on the page, and it is a text link. If the
            run is closed there is nothing to link to and nothing is said. */}
        {buyable ? (
          <div className="page-frame pb-8">
            <Reveal className="rule-draw flex flex-wrap items-baseline justify-between gap-4 pt-4">
              <p className="type-meta text-ink-faint">This run is still open.</p>
              <Link href={`/shop/${product.slug}`} className="link-rule link-rule-reveal">
                Buy this piece
              </Link>
            </Reveal>
          </div>
        ) : null}

        {others.length > 0 ? (
          <div className="page-frame rhythm-tight">
            <SectionHeading
              index={sectionIndex("others")}
              label="The record"
              title="Elsewhere in the archive."
              action={{ href: "/archive", label: "All garments" }}
            />
            <ArchiveLedger entries={others} />
          </div>
        ) : null}
      </article>
    </>
  );
}
