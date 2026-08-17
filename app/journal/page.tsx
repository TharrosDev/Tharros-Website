import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import { listJournal } from "@/lib/catalog/journal";
import { formatDate } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { breadcrumbList, jsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "The THARROS journal — how the pieces get made, what failed, and what changes for the next drop.",
  alternates: { canonical: "/journal" },
  openGraph: {
    type: "website",
    title: "The THARROS journal",
    description:
      "How the pieces get made, what failed, and what changes for the next drop.",
    url: `${SITE_URL}/journal`,
  },
};

export default function JournalPage() {
  const entries = listJournal();
  const [lead, ...rest] = entries;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/journal#blog`,
        url: `${SITE_URL}/journal`,
        name: "The THARROS journal",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        blogPost: entries.map((entry) => ({
          "@type": "BlogPosting",
          headline: entry.title,
          url: `${SITE_URL}/journal/${entry.slug}`,
          datePublished: entry.publishedAt,
        })),
      },
      breadcrumbList(SITE_URL, [
        { name: "Home", path: "/" },
        { name: "Journal", path: "/journal" },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />

      {/* The eyebrow read "01 Journal" above an h1 reading "Journal". A label
          that repeats the title is a wasted line on the page's strongest
          block. */}
      <PageIntro
        index="01"
        label="Writing"
        title="Journal"
        lead="How the pieces get made, what failed, and what changes next."
        crumbs={[{ name: "Home", href: "/" }]}
      />

      {lead ? (
        <Reveal className="page-frame">
          <Link href={`/journal/${lead.slug}`} className="group block">
            <div className="hover-zoom overflow-hidden">
              <ImageSlot image={lead.cover} sizes="100vw" priority />
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-12">
              <p className="type-meta text-ink-faint md:col-span-3">
                {lead.category} — {formatDate(lead.publishedAt)} —{" "}
                <span className="num">{lead.readingMinutes}</span> min
              </p>
              <div className="md:col-span-8">
                <h2 className="type-display-3 group-hover:opacity-70">{lead.title}</h2>
                <p className="type-body mt-4 max-w-prose text-ink-muted">{lead.excerpt}</p>
              </div>
            </div>
          </Link>
        </Reveal>
      ) : null}

      <div className="page-frame rhythm-default">
        {/* Two columns, not three. The journal holds three entries, so a lead
            plus a three-column grid left a permanent empty column on every
            desktop — a layout built for a volume of writing that does not
            exist. Two reads as editorial at any count. */}
        <ul className="grid gap-x-6 gap-y-16 md:grid-cols-2">
          {rest.map((entry, index) => (
            <Reveal as="li" key={entry.id} delay={index * 80}>
              <Link href={`/journal/${entry.slug}`} className="group block">
                <div className="hover-zoom overflow-hidden">
                  <ImageSlot
                    image={entry.cover}
                    ratio="editorial"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <p className="type-meta mt-5 text-ink-faint">
                  {entry.category} — {formatDate(entry.publishedAt)} —{" "}
                  <span className="num">{entry.readingMinutes}</span> min
                </p>
                <h2 className="type-display-4 mt-3 group-hover:opacity-70">{entry.title}</h2>
                <p className="type-body-sm mt-3 text-ink-muted">{entry.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </>
  );
}
