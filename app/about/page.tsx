import type { Metadata } from "next";
import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import { BRAND_LINE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "THARROS is a contemporary streetwear label built on courage, identity and refusing to blend in. Read the philosophy behind the clothing.",
  alternates: { canonical: "/about" },
};

const CHAPTERS = [
  {
    index: "02",
    title: "The philosophy",
    body: [
      "Tharros — θάρρος — is a Greek word for courage. Not the loud kind. The kind it takes to make a decision in public and stand behind it.",
      "Clothing is the most public decision most people make in a day. Wearing something with intent means accepting you will be read, and choosing what you are read as.",
    ],
  },
  {
    index: "03",
    title: "The culture",
    body: [
      "The label sits where music, art and street culture overlap — the places where personal style is built rather than bought.",
      "THARROS is not trying to speak for a scene. It is trying to make clothing good enough that people already building something choose to wear it.",
    ],
  },
  {
    index: "04",
    title: "The clothing",
    body: [
      "Heavy fabrics, square cuts, one palette. Graphics are set at scale or left off entirely — there is no middle register.",
      "Pieces are designed to be worn together and worn hard. Nothing in the collection is decorative for the sake of it.",
    ],
  },
  {
    index: "05",
    title: "The future",
    body: [
      "Collections release in numbered drops. Each one is designed as a complete set rather than a catalogue refresh.",
      "What comes next is announced to the mailing list first.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <div
        className="page-frame"
        style={{ paddingTop: "calc(var(--header-h) + 3.5rem)" }}
      >
        <div className="border-t border-ink pt-4">
          <p className="eyebrow">
            <span className="num">01</span>
            <span>Why Tharros exists</span>
          </p>
        </div>

        <h1 className="type-display-1 mt-10 max-w-[12ch]">
          Refuse to blend in.
        </h1>

        <p className="type-lead mt-8 max-w-2xl">
          THARROS exists for people who refuse to disappear into the crowd. {BRAND_LINE}
        </p>
      </div>

      <Reveal className="mt-16">
        <ImageSlot
          image={{
            code: "ABT-01",
            alt: "THARROS campaign image — Collection 01 shot on location",
            kind: "lifestyle",
            ratio: "wide",
          }}
          sizes="100vw"
        />
      </Reveal>

      <div className="page-frame rhythm-default">
        <div className="grid gap-x-12 gap-y-20 lg:grid-cols-12">
          {CHAPTERS.map((chapter) => (
            <Reveal
              key={chapter.index}
              className="lg:col-span-8 lg:col-start-4 lg:even:col-start-2 lg:even:col-span-8"
            >
              <div className="border-t border-ink pt-4">
                <p className="eyebrow">
                  <span className="num">{chapter.index}</span>
                  <span>{chapter.title}</span>
                </p>
              </div>
              <div className="mt-8 space-y-5">
                {chapter.body.map((paragraph) => (
                  <p key={paragraph} className="type-lead text-ink">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <section className="on-dark rhythm-breath">
        <div className="page-frame">
          <p className="type-display-2 max-w-[16ch]">Noise / Silence.</p>
          <p className="type-body mt-8 max-w-lg text-ink-on-dark-muted">
            Two halves of the same idea: say something, or say nothing — but mean it
            either way.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/shop" className="btn btn-inverse">
              Shop the collection
            </Link>
            <Link href="/journal" className="btn btn-outline-on-dark">
              Read the journal
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
