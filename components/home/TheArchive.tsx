import ArchiveLedger from "@/components/archive/ArchiveLedger";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { archiveEntries, archiveTotals } from "@/lib/catalog/archive";

/**
 * THE ARCHIVE — the densest movement on the page, and the point of it.
 *
 * Everything above this is a picture with a caption. This is a ledger: small
 * type, ruled rows, figures in columns, no photography larger than a thumbnail.
 * The page needs one section that is information rather than atmosphere, and
 * putting it here — between the campaign and the black band that closes the
 * page — is what stops the homepage reading as a series of equally-weighted
 * marketing blocks.
 *
 * It sits on the pale band rather than on paper so the density reads as a
 * different kind of surface: a page from a catalogue tipped into a book of
 * photographs. `.on-pale` rather than a bare `bg-` class, so the metadata
 * inside it resolves its tones through the surface it is actually on.
 *
 * Six rows, not nine. The homepage states that a record exists and what it
 * looks like; the archive itself is one click away and is where the whole
 * thing is read.
 */
export default function TheArchive() {
  const entries = archiveEntries().slice(0, 6);
  const totals = archiveTotals();

  if (entries.length === 0) return null;

  return (
    <section className="on-pale rhythm-default">
      <div className="page-frame">
        <SectionHeading
          index="05"
          label="The archive"
          title="Everything made so far."
          action={{ href: "/archive", label: "All garments" }}
        />

        <Reveal delay={60} className="section-lead">
          <p className="type-body max-w-xl text-ink-muted">
            A finished run is not removed from the site. It stays here with the number it
            closed at, because what the label has made is a more useful thing to be able to
            look up than what it currently has in stock.
          </p>
        </Reveal>

        <ArchiveLedger entries={entries} />

        <Reveal delay={120} className="mt-8 flex flex-wrap gap-x-12 gap-y-3">
          <p className="type-meta text-ink-faint">
            <span className="num">{totals.garments}</span> garments
          </p>
          <p className="type-meta text-ink-faint">
            <span className="num">{totals.made}</span> units made
          </p>
          <p className="type-meta text-ink-faint">
            <span className="num">{totals.archived}</span> runs closed
          </p>
        </Reveal>
      </div>
    </section>
  );
}
