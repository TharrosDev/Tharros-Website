import DropOpening from "@/components/home/DropOpening";
import TheRun from "@/components/home/TheRun";
import HomeCampaign from "@/components/home/HomeCampaign";
import NextDrop from "@/components/home/NextDrop";

/**
 * FOUR MOVEMENTS. THE CLOTHES, THE PEOPLE IN THEM, AND WHAT IS NEXT.
 *
 *   —   hero            picture     sparse      88svh, 92 from md
 *   01  the pieces      paper       dense       the grid, four up
 *   02  the campaign    paper       sparse      a held figure, then a full frame
 *   03  drop 002        pale        quiet       type and two cards
 *
 * IT WAS SIX, AND THREE OF THEM WERE ABOUT MANUFACTURING. "The scale" was a
 * statement that the label works at a size where every garment is accounted
 * for; "The studio" was a wide photograph of pattern pieces on a work table
 * with Idea / Pattern / Sample / Fit / Revision / Production named on a rule
 * under it; "The archive" was a ledger headed "Everything made so far". Three
 * of six movements, and roughly a third of the scroll, spent telling a visitor
 * how the clothes get made before showing them a second garment.
 *
 * That is the positioning this page no longer has. What replaced it is not six
 * more paragraphs of brand philosophy — it is the campaign, at the scale it was
 * shot for, and the run, four up instead of five. The page is shorter and it is
 * mostly photographs of clothes on people.
 *
 * Rhythm is still a device rather than a constant: the drop preview breathes,
 * the two picture sections do not. The numbering series runs 01–03 and counts
 * positions on this page; a section's index is never a drop's number.
 */
export default function HomePage() {
  return (
    <>
      <DropOpening />
      <TheRun />
      <HomeCampaign />
      <NextDrop />
    </>
  );
}
