/**
 * PLACEHOLDER CONTENT — these entries stand in for real editorial.
 *
 * The journal is where a small label shows its working: what was made, what
 * failed, what changed for the next drop. Structure it so real posts drop
 * straight in; do not invent process details that did not happen.
 */
import type { JournalEntry } from "./types";

export const JOURNAL: JournalEntry[] = [
  {
    id: "making-drop-001",
    title: "The Making Of Drop 001",
    slug: "the-making-of-drop-001",
    category: "Process",
    excerpt:
      "Seven pieces, several more that did not make it, and the patterns that had to be cut three times.",
    publishedAt: "2026-05-02",
    readingMinutes: 4,
    cover: {
      code: "JRN-01-COVER",
      alt: "Patterns and part-sewn samples laid out on a work table",
      kind: "detail",
      ratio: "campaign",
    },
    blocks: [
      {
        type: "paragraph",
        text: "Drop 001 started with more pieces than it ended with. The ones that survived did so because they answered a question the rest could not: what does this do that nothing else in the drop already does?",
      },
      { type: "heading", text: "The tee took three patterns" },
      {
        type: "paragraph",
        text: "The first was too long and read as a nightshirt. The second fixed the length and lost the shoulder. The third shortened the body and kept the width, which is the one that went out.",
      },
      {
        type: "quote",
        text: "Most of the work is the second attempt. The first one only tells you what is wrong.",
      },
      { type: "heading", text: "What the run size means" },
      {
        type: "paragraph",
        text: "Twelve Work Jackets were made because twelve was what could be made properly. They are gone, and the pattern is being reworked rather than repeated — the shoulder needs another pass before it deserves a second run.",
      },
    ],
  },
  {
    id: "learning-to-sew",
    title: "Learning To Sew Properly",
    slug: "learning-to-sew-properly",
    category: "Craft",
    excerpt:
      "Why the construction is being learned first-hand instead of handed to someone else.",
    publishedAt: "2026-06-30",
    readingMinutes: 3,
    cover: {
      code: "JRN-02-COVER",
      alt: "Close detail of a seam being sewn",
      kind: "detail",
      ratio: "campaign",
    },
    blocks: [
      {
        type: "paragraph",
        text: "It would be faster to send a sketch to a factory and wait. It would also mean never knowing why a sample comes back wrong.",
      },
      {
        type: "paragraph",
        text: "Sewing the samples means the fix is obvious: the seam that puckers, the rib that stretches out, the pocket placed where it drags the whole front out of line. Those are things you feel through the machine rather than read in an email.",
      },
      { type: "heading", text: "It shows in the drop" },
      {
        type: "paragraph",
        text: "The difference between the first sample of the Arc Hoodie and the one that shipped is not visible in a photograph. It is in how the hood sits when it is down, which took four attempts.",
      },
    ],
  },
  {
    id: "next-drop",
    title: "What Changes For Drop 002",
    slug: "what-changes-for-drop-002",
    category: "Next",
    excerpt:
      "The cargo pattern gets reworked, the shell gets a second sample, and nothing gets a release date until it is ready.",
    publishedAt: "2026-07-18",
    readingMinutes: 2,
    cover: {
      code: "JRN-03-COVER",
      alt: "A pattern piece pinned to fabric, marked up in pencil",
      kind: "detail",
      ratio: "campaign",
    },
    blocks: [
      {
        type: "paragraph",
        text: "Drop 002 is on the table now. The Shell Jacket is on its second sample and the beanie is approved, which is why both are visible on the site while the rest is not.",
      },
      { type: "heading", text: "The cargo comes back" },
      {
        type: "paragraph",
        text: "The Utility Cargo Pant was the hardest pattern in the first drop and the one most worth redoing. The leg is right; the rise is not.",
      },
      {
        type: "quote",
        text: "It goes out when the fit is right, not when the calendar says so.",
      },
    ],
  },
];

export function getJournalEntry(slug: string): JournalEntry | undefined {
  return JOURNAL.find((entry) => entry.slug === slug);
}

export function listJournal(): JournalEntry[] {
  return [...JOURNAL].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
