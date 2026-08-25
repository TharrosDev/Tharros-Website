/**
 * The six stages a piece goes through, as THARROS describes its own process.
 *
 * Content is data, never JSX — the same rule the catalogue follows. This lives
 * beside the catalogue rather than inside the page because more than one
 * surface states the sequence and the two must not drift into being two
 * different accounts of how the label works.
 *
 * IT IS SIX NAMES, BECAUSE SIX NAMES IS WHAT ANYTHING READS. Each stage also
 * carried a `short` sentence, a `long` paragraph and an image slot — eighteen
 * authored fields across the six, and not one of them had a consumer. The home
 * page sets the stages as a strip of labels on one rule, which was a deliberate
 * choice: six rows of a name plus a sentence is a feature list, and reading it
 * was the bulk of what that section asked for. The prose was kept "for the
 * surface that states the process at length", and that surface is `/about`,
 * which states it in its own words and always did.
 *
 * The image slots went with them. `STU-01` through `STU-06` were declared here,
 * rendered nowhere, absent from the photography brief, and invisible even to
 * `photography.test.ts` — six frames nobody was ever going to shoot.
 *
 * If a long-form process page is ever built, it writes its own copy against the
 * stage it belongs to. Six unread paragraphs sitting in a data file is not a
 * head start on that page; it is copy nobody has edited since it was written.
 *
 * Nothing here asserts a fact about tooling, premises, suppliers or people.
 * It describes the order of operations.
 */
export type StudioStage = {
  index: string;
  name: string;
};

export const STUDIO_STAGES: StudioStage[] = [
  { index: "01", name: "Idea" },
  { index: "02", name: "Pattern" },
  { index: "03", name: "Sample" },
  { index: "04", name: "Fit" },
  { index: "05", name: "Revision" },
  { index: "06", name: "Production" },
];
