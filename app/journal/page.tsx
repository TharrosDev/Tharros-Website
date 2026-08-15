import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import { listJournal } from "@/lib/catalog/journal";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "The THARROS journal — collection notes, styling, culture and the thinking behind the clothing.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const [lead, ...rest] = listJournal();

  return (
    <>
      <PageIntro
        index="01"
        label="Journal"
        title="Journal"
        lead="Collection notes, styling, and the thinking behind the clothing."
      />

      {lead ? (
        <Reveal className="page-frame">
          <Link href={`/journal/${lead.slug}`} className="group block">
            <div className="hover-zoom overflow-hidden">
              <ImageSlot image={lead.cover} sizes="100vw" priority />
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-12">
              <p className="type-meta text-ink-faint md:col-span-3">
                {lead.category} — {formatDate(lead.publishedAt)}
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
        <ul className="grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((entry) => (
            <li key={entry.id}>
              <Link href={`/journal/${entry.slug}`} className="group block">
                <div className="hover-zoom overflow-hidden">
                  <ImageSlot
                    image={entry.cover}
                    ratio="editorial"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <p className="type-meta mt-5 text-ink-faint">
                  {entry.category} — {formatDate(entry.publishedAt)}
                </p>
                <h2 className="type-display-4 mt-3 group-hover:opacity-70">{entry.title}</h2>
                <p className="type-body-sm mt-3 text-ink-muted">{entry.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
