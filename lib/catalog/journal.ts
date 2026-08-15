/** PLACEHOLDER CONTENT — journal entries stand in for real editorial. */
import type { JournalEntry } from "./types";

export const JOURNAL: JournalEntry[] = [
  {
    id: "collection-01-notes",
    title: "Notes On Collection 01",
    slug: "notes-on-collection-01",
    category: "Collection",
    excerpt:
      "Fifteen pieces, one palette, and a rule we kept coming back to: if it isn't doing work, take it off.",
    publishedAt: "2026-07-18",
    readingMinutes: 4,
    cover: {
      code: "JRN-01-COVER",
      alt: "Collection 01 pieces laid out on a concrete floor",
      kind: "lifestyle",
      ratio: "campaign",
    },
    blocks: [
      {
        type: "paragraph",
        text: "Collection 01 started as a pile of rejected samples. Everything that survived did so because it answered a question the rest of the pile couldn't: what does this piece do that nothing else in the drop already does?",
      },
      { type: "heading", text: "Weight First" },
      {
        type: "paragraph",
        text: "The decision that shaped the rest was fabric weight. Once the fleece went heavy, the patterns had to change — a heavier cloth holds a squarer shoulder, so the cuts got boxier and the hems got longer to balance them.",
      },
      {
        type: "quote",
        text: "If the fabric can stand up on its own, the pattern has to earn its shape.",
      },
      {
        type: "paragraph",
        text: "The graphics came last, not first. Most of them didn't survive. What remains is set at scale or left off entirely — there is no middle register in this collection.",
      },
    ],
  },
  {
    id: "how-to-wear-heavy",
    title: "Wearing Heavy",
    slug: "wearing-heavy",
    category: "Styling",
    excerpt:
      "Layering heavyweight pieces without ending up shapeless. Three rules and one exception.",
    publishedAt: "2026-06-30",
    readingMinutes: 3,
    cover: {
      code: "JRN-02-COVER",
      alt: "Layered heavyweight pieces photographed against a plain wall",
      kind: "lifestyle",
      ratio: "campaign",
    },
    blocks: [
      {
        type: "paragraph",
        text: "Heavyweight garments carry volume. Stack three of them without thinking and the silhouette disappears. The fix is proportion, not restraint.",
      },
      { type: "heading", text: "One Volume At A Time" },
      {
        type: "paragraph",
        text: "If the top is oversized, the bottom holds its line. The Utility Cargo Pant is wide enough to balance a shell, but not underneath one — the Stacked Sweatpant does that job better.",
      },
      { type: "heading", text: "Let The Hem Do The Work" },
      {
        type: "paragraph",
        text: "Length is the quietest tool in the collection. The Field Zip Hoodie runs long on purpose so it reads as a layer, not a top.",
      },
    ],
  },
  {
    id: "the-name",
    title: "On The Name",
    slug: "on-the-name",
    category: "Brand",
    excerpt: "Tharros is a Greek word for courage. Here is why it is on the label.",
    publishedAt: "2026-05-02",
    readingMinutes: 2,
    cover: {
      code: "JRN-03-COVER",
      alt: "The THARROS wordmark embroidered on a garment label",
      kind: "detail",
      ratio: "campaign",
    },
    blocks: [
      {
        type: "paragraph",
        text: "Tharros — θάρρος — is a Greek word for courage: the nerve to act, and to be seen acting.",
      },
      {
        type: "paragraph",
        text: "Clothing is the most public decision most people make in a day. Wearing something with intent means accepting you will be read. That is the whole idea behind the label.",
      },
      {
        type: "quote",
        text: "The world doesn't need another brand. Make your own.",
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
