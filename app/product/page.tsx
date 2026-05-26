import dynamic from "next/dynamic";
import NextStep from "@/components/NextStep";
import SectionSkeleton from "@/components/SectionSkeleton";
import { Metadata } from "next";
import Script from "next/script";

const WhatWeBuildsSection = dynamic(() => import("@/components/WhatWeBuildsSection"), { loading: () => <SectionSkeleton /> });
const HowItWorksSection = dynamic(() => import("@/components/HowItWorksSection"), { loading: () => <SectionSkeleton /> });
const WhyTharrosSection = dynamic(() => import("@/components/WhyTharrosSection"), { loading: () => <SectionSkeleton /> });

const SITE_URL = "https://tharros.ca";
const PAGE_URL = `${SITE_URL}/product`;

export const metadata: Metadata = {
  title: "Product — Modern Websites & AI Agents We Build",
  description:
    "What we build for Ottawa businesses: a modern website with an embedded AI agent, whether Customer Inquiry, Lead Capture, or After-Hours Intake. See our process and why we work as one team. Keep it Local, Keep it Canadian.",
  keywords: [
    "AI Agent Build Ottawa",
    "Customer Inquiry Agent",
    "Lead Capture Agent",
    "After-Hours Intake Agent",
    "Website Modernization Ottawa",
    "Embed AI Agent on Website",
    "Ottawa Web Development with AI",
    "AI Agent for Small Business",
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "en-CA": PAGE_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: "Product — Modern Websites & AI Agents We Build | Tharros",
    description:
      "A modern website with an embedded AI agent, built and supported by one Ottawa team. Customer Inquiry, Lead Capture, and After-Hours Intake agents.",
    url: PAGE_URL,
    siteName: "Tharros",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharros product — modern websites with integrated AI agents.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product — Modern Websites & AI Agents | Tharros",
    description:
      "A modern website with an embedded AI agent, built and supported by one Ottawa team. Keep it Local, Keep it Canadian.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProductPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "Product — Modern Websites & AI Agents We Build | Tharros",
      description:
        "What Tharros builds: a modern website with an embedded AI agent, the build process, and why we work as one team for Ottawa small businesses.",
      inLanguage: "en-CA",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#service` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
      },
      breadcrumb: { "@id": `${PAGE_URL}#breadcrumbs` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Product", item: PAGE_URL },
      ],
    },
  ];

  return (
    <>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <h1 className="sr-only">Modern websites and AI agents we build for Ottawa businesses</h1>
        <WhatWeBuildsSection />
        <HowItWorksSection />
        <WhyTharrosSection />
        <NextStep
          numeral="§ 04"
          eyebrow="Next"
          heading="See how the three builds are priced."
          links={[
            { label: "View pricing", href: "/pricing", primary: true },
            { label: "Book a discovery call", href: "/brief" },
          ]}
        />
      </main>
    </>
  );
}
