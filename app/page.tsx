import DropOpening from "@/components/home/DropOpening";
import TheRun from "@/components/home/TheRun";
import Statement from "@/components/home/Statement";
import ThePeople from "@/components/home/ThePeople";
import ProcessSection from "@/components/home/ProcessSection";
import TheFrames from "@/components/home/TheFrames";
import NextDrop from "@/components/home/NextDrop";

/**
 * The page is bracketed by the release: it opens on the current drop and closes
 * on the one in development. Between them it alternates surface and density —
 * an image-led record, a paper specimen grid, a black statement, the campaign
 * on people, the process, an image rail, black again — so no two neighbouring
 * sections are built the same way.
 *
 * The sections carry one numbering series, 01 through 06, and it counts. Two
 * sections used to print 03 and the last printed 002, which is a different
 * series in the same column.
 *
 * Rhythm is a device here, not a constant. Every section below the hero was
 * `rhythm-default`, so the page had one spacing value for its whole length and
 * nothing could be a pause. The statement and the next drop breathe; the
 * lookbook rail sits tight against the process above it.
 *
 * The order enters through people and leaves through product. Someone arriving
 * meets a person in the clothes before they meet a card, and every image-led
 * section carries the pieces that are in it, so the way into the shop is the
 * picture rather than a button.
 */
export default function HomePage() {
  return (
    <>
      <DropOpening />
      <TheRun />
      <Statement />
      <ThePeople />
      <ProcessSection />
      <TheFrames />
      <NextDrop />
    </>
  );
}
