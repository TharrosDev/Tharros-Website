import DropOpening from "@/components/home/DropOpening";
import TheRun from "@/components/home/TheRun";
import Statement from "@/components/home/Statement";
import ProcessSection from "@/components/home/ProcessSection";
import ThePeople from "@/components/home/ThePeople";
import TheArchive from "@/components/home/TheArchive";
import NextDrop from "@/components/home/NextDrop";

/**
 * Six movements, deliberately unequal.
 *
 * The page is bracketed by the release — it opens on the current drop and
 * closes on the one in development — and in between it is composed rather than
 * stacked. Every section varies at least two of surface, density and register
 * from the one above it, so no two neighbours are built the same way:
 *
 *   —   hero            picture     sparse      88svh, 92 from md
 *   01  the run         paper       dense       the grid
 *   02  statement       pale        sparse      type only
 *   03  the studio      paper       medium      one wide band + a mono strip
 *   04  the people      paper       sparse      one tall frame + a column
 *   05  the archive     bone        densest     a ledger, 11px
 *   06  in development  pale        quiet       type only
 *
 * The archive is the section that is information rather than atmosphere; it is
 * what stops the sequence reading as six marketing blocks.
 *
 * 02, 03 AND 04 WERE ALL "A PICTURE BESIDE SOME WORDS" AND ARE NOT ANY MORE.
 * They ran 6330px of a 13131px page at 1440x900 — nearly half of it — to carry
 * three photographs and about 300 words, and two of them made the same
 * argument. 02 has given its picture up entirely and is the one purely
 * typographic movement on the page. 03 spends that picture as a single
 * landscape band with the six studio stages named on one rule under it, rather
 * than as a sticky frame beside six paragraphs. 04 shows one campaign frame and
 * links to `/drop`, where the sequence belongs and runs whole. The same three
 * sections now measure 3335px.
 *
 * Shape is the contrast between 03 and 04, and it is deliberate: 03's picture
 * is the only landscape frame on the page and 04's is a standing figure. Every
 * other picture here is a portrait.
 *
 * Rhythm is a device, not a constant. The statement and the next drop breathe;
 * the hero and the people get the room. Every section below the hero was once
 * `rhythm-default`, which gave the page one spacing value for its whole length
 * and meant nothing could be a pause.
 *
 * The numbering series runs 01–06 and it counts positions on this page. A
 * section's index is never a drop's number.
 */
export default function HomePage() {
  return (
    <>
      <DropOpening />
      <TheRun />
      <Statement />
      <ProcessSection />
      <ThePeople />
      <TheArchive />
      <NextDrop />
    </>
  );
}
