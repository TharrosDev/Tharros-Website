import type { ImageSlotData } from "./types";

/**
 * The six stages a piece goes through, as THARROS describes its own process.
 *
 * Content is data, never JSX — the same rule the catalogue follows. This lives
 * beside the catalogue rather than inside the page because the homepage states
 * a short form of the same sequence and the two must not drift into being two
 * different accounts of how the label works.
 *
 * Nothing here asserts a fact about tooling, premises, suppliers or people.
 * It describes the order of operations, which is the thing the About page,
 * the journal and the product pages already say in prose.
 */
export type StudioStage = {
  index: string;
  name: string;
  /** The sentence the homepage uses. Short enough to sit in a list. */
  short: string;
  /** What the studio page adds: what actually goes wrong at this stage. */
  long: string;
  image: ImageSlotData;
};

export const STUDIO_STAGES: StudioStage[] = [
  {
    index: "01",
    name: "Idea",
    short: "A shape gets drawn, argued with, and drawn again before anything is cut.",
    long: "Most ideas do not survive being drawn twice. The ones that do usually started as a problem with an existing garment rather than as a picture of a new one.",
    image: {
      code: "STU-01",
      alt: "Working drawings and notes for a garment, spread on a table",
      kind: "detail",
      ratio: "editorial",
    },
  },
  {
    index: "02",
    name: "Pattern",
    short: "The drawing becomes a pattern. Most of the work — and most of the mistakes — happen here.",
    long: "A drawing can hide a shape that does not exist in cloth. The pattern is where that gets found out, and where a piece is either possible or quietly abandoned.",
    image: {
      code: "STU-02",
      alt: "Paper pattern pieces weighted flat on a cutting table",
      kind: "detail",
      ratio: "editorial",
    },
  },
  {
    index: "03",
    name: "Sample",
    short: "One piece is made and worn. Some patterns survive this. Several have not.",
    long: "The first one made is never the one that goes out. It is made to be worn badly on purpose — slept in, rained on, pulled at the shoulder — because that is the only way the faults show up before a run does.",
    image: {
      code: "STU-03",
      alt: "A first sample garment on a stand, part finished",
      kind: "detail",
      ratio: "editorial",
    },
  },
  {
    index: "04",
    name: "Fit",
    short: "Length, shoulder, hem, weight. The changes are small and they take the longest.",
    long: "Fit is measured on a body rather than on a table. A centimetre at the shoulder changes how the whole piece hangs, and it is the difference between a garment that reads as designed and one that reads as approximately the right size.",
    image: {
      code: "STU-04",
      alt: "A sample being fitted and pinned on a person",
      kind: "model",
      ratio: "editorial",
      crop: "three-quarter",
    },
  },
  {
    index: "05",
    name: "Revision",
    short: "What was wrong gets cut up and used to make the next pattern.",
    long: "A failed sample is not waste, it is the most accurate note anyone could have written. It gets marked up, taken apart, and the corrected pieces become the pattern the run is cut from.",
    image: {
      code: "STU-05",
      alt: "A marked-up sample garment with alterations pinned in place",
      kind: "detail",
      ratio: "editorial",
    },
  },
  {
    index: "06",
    name: "Production",
    short: "A short run is made and goes out. What it teaches goes into the next drop.",
    long: "The run is short because that is genuinely how much can be made well right now. Every piece is accounted for, and the number is printed on its own page rather than described as limited.",
    image: {
      code: "STU-06",
      alt: "Finished garments from a short run, folded and stacked",
      kind: "detail",
      ratio: "editorial",
    },
  },
];
