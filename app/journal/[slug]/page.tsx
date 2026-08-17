import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageSlot from "@/components/media/ImageSlot";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import { JOURNAL, getJournalEntry, listJournal } from "@/lib/catalog/journal";
import { formatDate } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/jsonld";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return JOURNAL.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntry(slug);
  if (!entry) return { title: "Not found" };

  return {
    title: entry.title,
    description: entry.excerpt,
    alternates: { canonical: `/journal/${entry.slug}` },
    openGraph: {
      type: "article",
      title: `${entry.title} — THARROS`,
      description: entry.excerpt,
      publishedTime: entry.publishedAt,
      url: `${SITE_URL}/journal/${entry.slug}`,
    },
  };
}

export default async function JournalEntryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const entry = getJournalEntry(slug);

  if (!entry) notFound();

  const more = listJournal()
    .filter((item) => item.id !== entry.id)
    .slice(0, 2);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: entry.title,
        description: entry.excerpt,
        datePublished: entry.publishedAt,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: `${SITE_URL}/journal/${entry.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/journal` },
          {
            "@type": "ListItem",
            position: 3,
            name: entry.title,
            item: `${SITE_URL}/journal/${entry.slug}`,
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

      <article>
        <div className="page-frame page-top">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Journal", href: "/journal" },
            ]}
            className="mb-10"
          />

          <p className="type-meta text-ink-faint">
            {entry.category} — {formatDate(entry.publishedAt)} —{" "}
            <span className="num">{entry.readingMinutes}</span> min read
          </p>

          <h1 className="type-display-2 mt-6 max-w-[18ch]">{entry.title}</h1>
          <p className="type-lead mt-6 max-w-2xl">{entry.excerpt}</p>
        </div>

        <div className="mt-12">
          <ImageSlot image={entry.cover} sizes="100vw" priority />
        </div>

        <div className="page-frame rhythm-default">
          <div className="mx-auto max-w-2xl space-y-8">
            {entry.blocks.map((block, index) => {
              if (block.type === "heading") {
                return (
                  <h2 key={index} className="type-display-4 pt-4">
                    {block.text}
                  </h2>
                );
              }

              if (block.type === "quote") {
                return (
                  <blockquote key={index} className="border-l-2 border-ink pl-6">
                    <p className="type-display-4">{block.text}</p>
                    {block.attribution ? (
                      <cite className="type-meta mt-3 block text-ink-faint not-italic">
                        {block.attribution}
                      </cite>
                    ) : null}
                  </blockquote>
                );
              }

              if (block.type === "image") {
                return <ImageSlot key={index} image={block.image} sizes="(min-width: 768px) 42rem, 100vw" />;
              }

              return (
                <p key={index} className="type-body text-ink-muted">
                  {block.text}
                </p>
              );
            })}
          </div>
        </div>
      </article>

      {more.length > 0 ? (
        <section className="page-frame rhythm-default border-t border-rule">
          <SectionHeading
            index="02"
            label="More from the journal"
            title="Keep reading."
            titleClass="type-display-3"
          />
          <ul className="section-lead grid gap-x-10 gap-y-16 md:grid-cols-2">
            {more.map((item) => (
              <li key={item.id}>
                <Link href={`/journal/${item.slug}`} className="group block">
                  <div className="hover-zoom overflow-hidden">
                    <ImageSlot
                      image={item.cover}
                      ratio="editorial"
                      sizes="(min-width: 768px) 48vw, 100vw"
                    />
                  </div>
                  <p className="type-meta mt-4 text-ink-faint">{item.category}</p>
                  <h3 className="type-display-4 mt-2 group-hover:opacity-70">{item.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
