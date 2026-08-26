import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import InfoFooter from "@/components/layout/InfoFooter";
import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import { informationIndex, SITE_URL } from "@/lib/site";
import { breadcrumbList, jsonLd } from "@/lib/jsonld";
import { RETURN_WINDOW } from "@/lib/commerce/returns";
import { SHIPPING_OPTIONS } from "@/lib/commerce/shipping";
import { NEXT_DROP } from "@/lib/catalog/drops";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about THARROS drops, run sizes, restocks, sizing, shipping and returns.",
  alternates: { canonical: "/faq" },
};

/**
 * Grouped by subject rather than stacked flat, and every figure is read from
 * the same source the rest of the site quotes — a delivery time or a release
 * date written out here is one that goes stale without anyone noticing.
 *
 * `more` is the page that actually owns the answer.
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
          "THARROS releases in numbered drops rather than keeping a permanent catalogue. A drop is a small set of pieces, made in a short run, and it closes when the run is gone.",
        more: { href: "/drop", label: "See the current drop" },
      },
      {
        question: "How many of each piece are made?",
        answer:
          "It varies by piece, and the number is printed on every product page along with how many are left. When a size is gone, it is gone.",
        more: { href: "/shop", label: "Browse the pieces" },
      },
      {
        question: "When is the next drop?",
        answer: NEXT_DROP
          ? `${NEXT_DROP.name} is set for ${NEXT_DROP.releasedAt ? formatDate(NEXT_DROP.releasedAt) : "a date still to be announced"}. The pieces announced for it are previewed on the drop page, and the list is emailed first.`
          : "The next release is not announced yet. The list is emailed first.",
        more: NEXT_DROP
          ? { href: "/drop", label: `Preview ${NEXT_DROP.name}` }
          : { href: "/drop", label: "See the current drop" },
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
          "Most pieces are cut boxy or oversized and are true to size as designed. Each product page lists the fit notes for that piece.",
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
        answer: `Orders are packed within two business days. ${SHIPPING_OPTIONS.map(
          (option) => `${option.name} delivery takes ${option.detail}`,
        ).join(" and ")}.`,
        more: { href: "/shipping", label: "Full shipping detail" },
      },
      {
        question: "What is the returns policy?",
        answer:
          `Unworn pieces with tags attached can be returned within ${RETURN_WINDOW} of delivery. Return shipping is paid by the customer unless the piece arrived faulty or incorrect.`,
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
