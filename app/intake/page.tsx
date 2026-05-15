import IntakeForm from "@/components/IntakeForm";
import { Metadata } from "next";
import Script from "next/script";

const SITE_URL = "https://tharros.ca";
const PAGE_URL = `${SITE_URL}/intake`;

export const metadata: Metadata = {
  title: "Discovery Briefing | Book a Free Discovery Call",
  description:
    "Keep it Local, Keep it Canadian. Book your free Tharros discovery call. Tell us about your Ottawa small business and we'll scope a tailored build — website modernization, AI agent integration, or the full On-Call retainer.",
  keywords: [
    "Tharros Discovery Call",
    "Book Discovery Call Ottawa",
    "Ottawa Web Development Quote",
    "AI Agent Integration Quote Ottawa",
    "Website Modernization Quote Ottawa",
    "Ottawa Small Business Website Intake",
    "Free Discovery Call Ottawa AI",
    "AI Agent Scoping Ottawa",
    "Website Build Briefing Ottawa",
    "On-Call Retainer Quote Ottawa",
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "en-CA": PAGE_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: "Discovery Briefing | Tharros",
    description:
      "Share your business context. We use it to scope a build that fits your operation — website modernization, AI agent integration, or the full On-Call retainer. Built for Ottawa small businesses.",
    url: PAGE_URL,
    siteName: "Tharros",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Book a free discovery call with Tharros — Ottawa website modernization and AI agent integration.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discovery Briefing | Tharros",
    description:
      "Book a free discovery call. Tharros scopes a tailored website and AI agent build for your Ottawa small business.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function IntakePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": `${PAGE_URL}#contactpage`,
      url: PAGE_URL,
      name: "Discovery Briefing | Tharros",
      description:
        "Book a free discovery call with Tharros. Share your business context and we'll scope a tailored website modernization or AI agent integration build.",
      inLanguage: "en-CA",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#localbusiness` },
      mainEntity: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "tharrosdev@gmail.com",
        areaServed: "CA",
        availableLanguage: ["en-CA", "en"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Discovery Briefing",
          item: PAGE_URL,
        },
      ],
    },
  ];

  return (
    <>
      <Script
        id="intake-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IntakeForm />
    </>
  );
}
