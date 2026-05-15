import IntakeForm from "@/components/IntakeForm";
import { Metadata } from "next";
import Script from "next/script";

const SITE_URL = "https://tharros.ca";
const PAGE_URL = `${SITE_URL}/intake`;

export const metadata: Metadata = {
  title: "Discovery Briefing — Book a Free Call",
  description:
    "Book a free Tharros discovery call. Tell us about your Ottawa business and we'll scope a build — The Refresh, The Integrate, or The On-Call. Keep it Local, Keep it Canadian.",
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
    title: "Discovery Briefing — Book a Free Call | Tharros",
    description:
      "Share your business context and we'll scope a build that fits your operation — The Refresh, The Integrate, or The On-Call. Keep it Local, Keep it Canadian.",
    url: PAGE_URL,
    siteName: "Tharros",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Discovery Briefing — book a free call with Tharros.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discovery Briefing — Book a Free Call | Tharros",
    description:
      "Book a free discovery call. We'll scope a website and AI agent build for your Ottawa business. Keep it Local, Keep it Canadian.",
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
      name: "Discovery Briefing — Book a Free Call | Tharros",
      description:
        "Book a free discovery call with Tharros. Share your business context and we'll scope a website modernization or AI agent integration build for your Ottawa operation.",
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
