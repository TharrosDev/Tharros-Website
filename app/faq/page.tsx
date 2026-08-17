import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import InfoFooter from "@/components/layout/InfoFooter";
import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import { informationIndex, SITE_URL } from "@/lib/site";
import { breadcrumbList, jsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about THARROS drops, run sizes, restocks, sizing, shipping and returns.",
  alternates: { canonical: "/faq" },
};

/**
 * Grouped. Seven questions covering four subjects rendered as one flat stack of
 * seven `h2`s under a single `h1` — an outline with no shape, on the page whose
 * whole job is letting someone find one answer.
 *
 * `more` is the page that actually owns the answer. Three of these restated
 * /shipping and /returns verbatim and linked neither of them.
 */
type FaqGroup = {
  index: string;
  label: string;
  questions: {
    question: string;
    answer: string;
    /** The page that actually owns the answer, where one exists. */
    more: { href: string; label: string } | null;
  }[];
};

const GROUPS: FaqGroup[] = [
  {
    index: "01",
    label: "Drops and runs",
    questions: [
      {
        question: "Why are there so few pieces?",
        answer:
          "THARROS releases in drops rather than keeping a permanent catalogue. Each drop is a small number of pieces made in short runs — that is the actual production capacity, not a marketing tactic.",
        more: { href: "/drop", label: "See the current drop" },
      },
      {
        question: "How many of each piece are made?",
        answer:
          "It varies by piece and it is printed on every product page, along with how many are still available. When a size is gone, it is gone.",
        more: { href: "/shop", label: "Browse the pieces" },
      },
      {
        question: "When is the next drop?",
        answer:
          "There is no published date. A drop goes out when the fit is right; pieces far enough along to show appear on the current drop page while they are still in development.",
        more: { href: "/drop", label: "What is in development" },
      },
    ],
  },
  {
    index: "02",
    label: "Restocks",
    questions: [
      {
        question: "Will sold-out pieces come back?",
        answer:
          "Sometimes, and never automatically. Some runs are marked as final on the product page and will not be remade. Others may return in a later drop, usually changed rather than reprinted.",
        more: null,
      },
    ],
  },
  {
    index: "03",
    label: "Fit",
    questions: [
      {
        question: "How do THARROS pieces fit?",
        answer:
          "Most pieces are cut boxy or oversized and are true to size as designed. Each product page lists its fit notes, and garment measurements are published in the size guide.",
        more: { href: "/size-guide", label: "Open the size guide" },
      },
    ],
  },
  {
    index: "04",
    label: "Shipping and returns",
    questions: [
      {
        question: "How long does shipping take?",
        answer:
          "Orders are packed within two business days. Standard delivery takes 5–8 business days and express 2–3 business days.",
        more: { href: "/shipping", label: "Full shipping detail" },
      },
      {
        question: "What is the returns policy?",
        answer:
          "Unworn pieces with tags attached can be returned within 30 days of delivery. Return shipping is paid by the customer unless the piece arrived faulty or incorrect.",
        more: { href: "/returns", label: "How to return something" },
      },
    ],
  },
];

const ALL = GROUPS.flatMap((group) => group.questions);

export default function FaqPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/faq#faq`,
        mainEntity: ALL.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      breadcrumbList(SITE_URL, [
        { name: "Home", path: "/" },
        { name: "FAQ", path: "/faq" },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />

      <PageIntro
        index={informationIndex("/faq")}
        label="Information"
        title="FAQ"
        lead="The questions that actually come in, grouped by what they are about."
        crumbs={[{ name: "Home", href: "/" }]}
      />

      <div className="page-frame rhythm-tight space-y-16">
        {GROUPS.map((group) => (
          <section key={group.index} className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
            <SectionHeading
              index={group.index}
              label="Topic"
              title={group.label}
              titleClass="type-display-4"
              className="lg:col-span-3"
            />
            <div className="lg:col-span-8 lg:col-start-5">
              {group.questions.map((faq) => (
                <Accordion key={faq.question} title={faq.question} level={3}>
                  <p className="type-body text-ink-muted">{faq.answer}</p>
                  {faq.more ? (
                    <p className="mt-5">
                      <Link
                        href={faq.more.href}
                        className="link-rule link-rule-reveal"
                      >
                        {faq.more.label}
                      </Link>
                    </p>
                  ) : null}
                </Accordion>
              ))}
            </div>
          </section>
        ))}

        <p className="type-body text-ink-muted">
          Still stuck?{" "}
          <Link href="/contact" className="link-rule">
            Get in touch
          </Link>
          .
        </p>
      </div>

      <InfoFooter current="/faq" />
    </>
  );
}
