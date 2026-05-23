import type { Metadata } from "next";
import Script from "next/script";
import { OnboardingApp } from "@/components/onboarding/OnboardingApp";

const SITE_URL = "https://tharros.ca";
const PAGE_URL = `${SITE_URL}/brief`;
const SITE_NAME = "Tharros";

export const metadata: Metadata = {
  title: "Project Brief — Scope Your Build",
  description:
    "Tell us about your operation in a short brief. We'll scope your website and AI agent build before the free discovery call. Ottawa trades and small businesses welcome.",
  keywords: [
    "Tharros Discovery Call",
    "Ottawa Website Brief",
    "AI Agent Build Brief Ottawa",
    "Ottawa Web Development Quote",
    "Custom AI Agent Quote Ottawa",
    "Tharros Project Brief",
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "en-CA": PAGE_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: "Project Brief — Scope Your Build | Tharros",
    description:
      "Share a short brief on your operation. We scope the website and AI agent build before the free discovery call. Keep it Local, Keep it Canadian.",
    url: PAGE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/opengraph-image/hero",
        width: 1200,
        height: 630,
        alt: "Tharros project brief, scope your Ottawa website and AI agent build.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Brief — Scope Your Build | Tharros",
    description:
      "Share a short brief on your operation. We scope the build before the free discovery call.",
    images: ["/opengraph-image/hero"],
  },
  robots: { index: true, follow: true },
};

export default function BriefPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": `${PAGE_URL}#contactpage`,
      url: PAGE_URL,
      name: "Tharros Project Brief",
      description:
        "Pre-discovery brief form. Share your operation, goals, and scope so Tharros can prepare a firm, no-obligation proposal.",
      inLanguage: "en-CA",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#localbusiness` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/opengraph-image/hero`,
        width: 1200,
        height: 630,
      },
      mainEntity: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "tharrosdev@gmail.com",
        areaServed: "CA",
        availableLanguage: ["en-CA", "en"],
      },
      potentialAction: {
        "@type": "CommunicateAction",
        name: "Submit project brief",
        target: PAGE_URL,
        result: {
          "@type": "Reservation",
          name: "Free discovery call",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Brief", item: PAGE_URL },
      ],
    },
  ];

  return (
    <>
      <Script
        id="brief-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OnboardingApp />
    </>
  );
}
