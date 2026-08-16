import DropRecord from "@/components/home/DropRecord";
import TheRun from "@/components/home/TheRun";
import Statement from "@/components/home/Statement";
import ProcessSection from "@/components/home/ProcessSection";
import TheFrames from "@/components/home/TheFrames";
import NextDrop from "@/components/home/NextDrop";

/**
 * The page is bracketed by the release: it opens on the current drop's record
 * and closes on the one in development. Between them it alternates surface and
 * density — black record, paper specimen grid, black statement, paper process,
 * an image rail, black again — so no two neighbouring sections are built the
 * same way.
 *
 * Only one section depends on photography. With every image slot still empty
 * the page has to hold up on type, figures and rules alone, which is the
 * state it currently ships in.
 */
export default function HomePage() {
  return (
    <>
      <DropRecord />
      <TheRun />
      <Statement />
      <ProcessSection />
      <TheFrames />
      <NextDrop />
    </>
  );
}
