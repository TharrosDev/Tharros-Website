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
 *   —   hero            picture     sparse      full viewport
 *   01  the run         paper       dense       the grid
 *   02  statement       pale        sparse      type only
 *   03  the studio      paper       medium      sticky frame + list
 *   04  the people      picture     full bleed  alternating frames
 *   05  the archive     bone        densest     a ledger, 11px
 *   06  in development  pale        quiet       type + one frame
 *
 * The archive is the one new movement and the only section on the page that is
 * information rather than atmosphere; it is what stops the sequence reading as
 * seven marketing blocks.
 *
 * The lookbook rail that used to sit at 05 is gone with the lookbook page. It
 * photographed the same people in the same drop as the campaign sequence four
 * sections earlier, so it read as more of that rather than as anything new.
 *
 * Rhythm is a device, not a constant. The statement and the next drop breathe;
 * the archive sits tight; the hero, the piece and the people get
 * the room. Every section below the hero was once `rhythm-default`, which gave
 * the page one spacing value for its whole length and meant nothing could be a
 * pause.
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
