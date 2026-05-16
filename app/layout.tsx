import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import PageTransition from "@/components/PageTransition";
import NavBar from "@/components/NavBar";
import BackToTop from "@/components/BackToTop";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = "https://tharros.ca";
const SITE_NAME = "Tharros";
const FOUNDER_NAME = "Magnus Abdelnour";
const CONTACT_EMAIL = "tharrosdev@gmail.com";
const GEO_LAT = 45.4215;
const GEO_LON = -75.6972;
const SERVICE_AREAS = [
  "Ottawa",
  "Kanata",
  "Nepean",
  "Barrhaven",
  "Orleans",
  "Stittsville",
];

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  interactiveWidget: "resizes-content",
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default:
      "Tharros — Modern Websites & AI Agents for Ottawa Businesses",
    template: "%s | Tharros",
  },
  description:
    "Modern websites and integrated AI agents for Ottawa trades and small businesses. The Refresh, The Integrate, The On-Call. Keep it Local, Keep it Canadian.",
  keywords: [
    "Website Modernization Ottawa",
    "Small Business Website Redesign Ottawa",
    "AI Agent Integration Ottawa",
    "AI Agent Build Ottawa",
    "Custom AI Agent Ottawa",
    "Embed AI Agent on Website",
    "Ottawa Web Development with AI",
    "Ottawa Web Design",
    "Next.js Website Ottawa",
    "AI Customer Service Agent Ottawa",
    "AI Lead Capture Agent Ottawa",
    "AI After-Hours Intake Agent",
    "Ottawa AI Consulting",
    "AI Agent for Small Business",
    "AI Chatbot for Small Business Ottawa",
    "On-Call Web Retainer Ottawa",
    "Website Maintenance Retainer Ottawa",
    "Website and AI Agent Package",
    "Ottawa Small Business Website",
    "Ottawa Trades Website",
    "HVAC Website Ottawa",
    "Plumbing Website Ottawa",
    "Roofing Website Ottawa",
    "Electrician Website Ottawa",
    "Landscaping Website Ottawa",
    "Dental Office Website Ottawa",
    "Veterinary Clinic Website Ottawa",
    "Law Firm Website Ottawa",
    "Accountant Website Ottawa",
    "Contractor Website Ottawa",
    "Real Estate Website Ottawa",
    "Auto Repair Website Ottawa",
    "Kanata Small Business Website",
    "Nepean Small Business Website",
    "Barrhaven Small Business Website",
    "Orleans Small Business Website",
    "Stittsville Small Business Website",
    "Ottawa Local Business AI",
    "AI Receptionist for Small Business",
    "AI Inquiry Agent Ottawa",
    "AI Intake Automation Ottawa",
    "CRM Integration Ottawa",
    "HubSpot Integration Ottawa",
    "Per-Call Web Support Ottawa",
    "Monthly Retainer Web Ottawa",
    "Discovery Call Ottawa Web",
    "Tharros",
    "Tharros AI",
    "Tharros Ottawa",
    "Magnus Abdelnour",
    "Keep it Local",
    "Keep it Canadian",
    "Keep it Local Keep it Canadian",
  ],
  authors: [{ name: FOUNDER_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "business",
  classification: "Web Development & AI Agent Integration",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title:
      "Tharros — Modern Websites & AI Agents for Ottawa Businesses",
    description:
      "Modern websites. Integrated AI agents. One team, on call. Website modernization, AI agent integration, and an On-Call retainer for Ottawa trades and small businesses. Keep it Local, Keep it Canadian.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_CA",
    alternateLocale: ["en_US", "fr_CA"],
    type: "website",
    countryName: "Canada",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharros — modern websites and integrated AI agents for Ottawa businesses.",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharros — Modern Websites & AI Agents | Ottawa",
    description:
      "Modern websites. Integrated AI agents. One team, on call. Built in Ottawa for trades and small businesses. Keep it Local, Keep it Canadian.",
    images: ["/og-image.jpg"],
    creator: "@TharrosAI",
    site: "@TharrosAI",
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-CA": "/",
      "x-default": "/",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  manifest: "/manifest.json",
  referrer: "origin-when-cross-origin",
  other: {
    "geo.region": "CA-ON",
    "geo.placename": "Ottawa",
    "geo.position": `${GEO_LAT};${GEO_LON}`,
    ICBM: `${GEO_LAT}, ${GEO_LON}`,
    "msapplication-TileColor": "#0f172a",
    "msapplication-config": "/browserconfig.xml",
    rating: "general",
    "revisit-after": "7 days",
    "og:phone_number": "",
    "business:contact_data:locality": "Ottawa",
    "business:contact_data:region": "ON",
    "business:contact_data:country_name": "Canada",
    "business:contact_data:email": CONTACT_EMAIL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: ["Tharros AI", "Tharros Ottawa"],
    legalName: SITE_NAME,
    slogan: "Keep it Local, Keep it Canadian.",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/tharros-logo.svg`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/og-image.jpg`,
    description:
      "Ottawa-based team delivering website modernization, AI agent integration, and an On-Call retainer for small businesses and trades.",
    foundingDate: "2025",
    founder: {
      "@type": "Person",
      "@id": `${SITE_URL}/#founder`,
      name: FOUNDER_NAME,
      jobTitle: "Founder",
      worksFor: { "@id": `${SITE_URL}/#organization` },
    },
    knowsAbout: [
      "Website Design",
      "Website Modernization",
      "Web Development",
      "AI Agent Integration",
      "Conversational AI",
      "Large Language Models",
      "CRM Integration",
      "Lead Capture Automation",
      "Small Business Operations",
    ],
    knowsLanguage: ["en-CA", "en", "fr-CA"],
    areaServed: SERVICE_AREAS.map((name) => ({
      "@type": "City",
      name,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Ontario",
      },
    })),
    sameAs: ["https://linkedin.com/company/tharros-ai"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: CONTACT_EMAIL,
        areaServed: "CA",
        availableLanguage: ["en-CA", "en"],
        contactOption: "TollFree",
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: CONTACT_EMAIL,
        areaServed: "CA",
        availableLanguage: ["en-CA", "en"],
      },
    ],
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}/tharros-logo.svg`,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    description:
      "Keep it Local, Keep it Canadian. Website modernization, AI agent integration, and an On-Call retainer for Ottawa trades and small businesses.",
    slogan: "Keep it Local, Keep it Canadian.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ottawa",
      addressRegion: "ON",
      postalCode: "K2K",
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO_LAT,
      longitude: GEO_LON,
    },
    hasMap: `https://www.google.com/maps?q=${GEO_LAT},${GEO_LON}`,
    areaServed: SERVICE_AREAS.map((name) => ({ "@type": "City", name })),
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: GEO_LAT,
        longitude: GEO_LON,
      },
      geoRadius: 50000,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    priceRange: "$$",
    paymentAccepted: "Credit Card, Bank Transfer, e-Transfer, Invoice",
    currenciesAccepted: "CAD",
    knowsLanguage: ["en-CA", "en"],
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    founder: { "@id": `${SITE_URL}/#founder` },
    makesOffer: [
      {
        "@type": "Offer",
        name: "The Refresh",
        description:
          "Project-based website modernization for Ottawa small businesses. Per-call support after launch.",
        priceCurrency: "CAD",
        availability: "https://schema.org/InStock",
        category: "Website Modernization",
      },
      {
        "@type": "Offer",
        name: "The Integrate",
        description:
          "Website modernization plus a custom AI agent embedded directly into the site. Per-call support after launch.",
        priceCurrency: "CAD",
        availability: "https://schema.org/InStock",
        category: "Website + AI Agent",
      },
      {
        "@type": "Offer",
        name: "The On-Call",
        description:
          "Website modernization plus AI agent integration plus a monthly On-Call retainer for fixes, improvements, and unlimited new agents.",
        priceCurrency: "CAD",
        availability: "https://schema.org/InStock",
        category: "Website + AI Agent + Retainer",
      },
    ],
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#service`,
    serviceType: "Website Modernization and AI Agent Integration",
    name: "Tharros Website + AI Agent Builds",
    description:
      "End-to-end website modernization and AI agent integration for Ottawa small businesses, with per-call support or a monthly On-Call retainer.",
    provider: { "@id": `${SITE_URL}/#localbusiness` },
    areaServed: SERVICE_AREAS.map((name) => ({ "@type": "City", name })),
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Ottawa Small Businesses and Trades",
    },
    category: "Web Development & AI Integration",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Website and AI Agent Build Packages",
      itemListElement: [
        {
          "@type": "Offer",
          position: 1,
          itemOffered: {
            "@type": "Service",
            name: "The Refresh",
            description:
              "Project-based website modernization for Ottawa small businesses. We update the design, copy, and structure so your front door reflects the operation behind it. Fixes and changes after launch are billed per call.",
            serviceType: "Website Modernization",
            provider: { "@id": `${SITE_URL}/#localbusiness` },
          },
        },
        {
          "@type": "Offer",
          position: 2,
          itemOffered: {
            "@type": "Service",
            name: "The Integrate",
            description:
              "Website modernization plus a custom AI agent built and embedded directly into the site. Covers customer inquiry, lead capture, or after-hours intake. Fixes and additional agents after launch are billed per call.",
            serviceType: "Website Modernization with AI Agent Integration",
            provider: { "@id": `${SITE_URL}/#localbusiness` },
          },
        },
        {
          "@type": "Offer",
          position: 3,
          itemOffered: {
            "@type": "Service",
            name: "The On-Call",
            description:
              "Website modernization plus AI agent integration, followed by a monthly On-Call retainer. We stay on call for fixes, site improvements, and unlimited new agent builds while the retainer runs.",
            serviceType: "Website + AI Agent + Monthly Retainer",
            provider: { "@id": `${SITE_URL}/#localbusiness` },
          },
        },
      ],
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description:
      "Website modernization, AI agent integration, and an On-Call retainer for Ottawa small businesses. Keep it Local, Keep it Canadian.",
    inLanguage: "en-CA",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does a Tharros build cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pricing is custom and scoped to the build. After a free discovery call, we send a firm, no-obligation proposal mapped to the work — a website refresh only, a website plus AI agent integration, or the full On-Call retainer that includes a monthly retainer for fixes and unlimited new agents.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between pay-per-call and the On-Call retainer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pay-per-call means fixes and new agents are billed one job at a time, the way you'd call a plumber. The On-Call retainer is a flat monthly fee that rolls fixes, site improvements, and unlimited new agent builds into a single bill.",
        },
      },
      {
        "@type": "Question",
        name: "Do you only work with Ottawa businesses?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tharros focuses on the Ottawa area — Kanata, Nepean, Barrhaven, Orleans, and Stittsville included. The advantage is local context: we know the trades and small business landscape in this city.",
        },
      },
      {
        "@type": "Question",
        name: "What kinds of AI agents do you build?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three patterns fit most small business operations: a Customer Inquiry Agent that answers services, pricing, and availability questions; a Lead Capture Agent that qualifies and routes new leads; and an After-Hours Intake Agent that handles messages while you're off the clock. Each is built end-to-end and embedded into your modernized site.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a Tharros build take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Timelines are scoped during the discovery call. Most website refreshes complete in days to a few weeks. Full agent integrations depend on the depth of integration with your CRM, intake, and messaging tools.",
        },
      },
      {
        "@type": "Question",
        name: "Do I own my site and AI agent after launch?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The site, the content, and the agent run on infrastructure you control. The On-Call retainer keeps Tharros on the line for changes; pay-per-call works if you'd rather call us when something needs doing.",
        },
      },
      {
        "@type": "Question",
        name: "What if I just want a new website, no AI agent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "That's The Refresh — our project-based website modernization package. No agent required. After launch, fixes are billed per call.",
        },
      },
      {
        "@type": "Question",
        name: "Where is Tharros based?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ottawa, Ontario, Canada. Keep it Local, Keep it Canadian.",
        },
      },
      {
        "@type": "Question",
        name: "Can the AI agent integrate with my existing CRM and tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Integration depth is one of the three pricing factors. Agents can connect to your CRM, intake forms, messaging channels, and other tools you already use.",
        },
      },
      {
        "@type": "Question",
        name: "How do I get started?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Book a free discovery call from the homepage or the intake page. We'll listen to your operation, scope the build, and walk you through pay-per-call vs the On-Call retainer with no obligation.",
        },
      },
    ],
  };

  const founder = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#founder`,
    name: FOUNDER_NAME,
    jobTitle: "Founder",
    description:
      "Founder of Tharros, an Ottawa team delivering website modernization, AI agent integration, and an On-Call retainer for small businesses.",
    worksFor: { "@id": `${SITE_URL}/#organization` },
    email: CONTACT_EMAIL,
    nationality: { "@type": "Country", name: "Canada" },
    workLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ottawa",
        addressRegion: "ON",
        addressCountry: "CA",
      },
    },
  };

  const siteNavigation = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: [
      "Demo",
      "Solutions",
      "Process",
      "Why",
      "Pricing",
      "Clients",
      "Book a Discovery Call",
    ],
    url: [
      `${SITE_URL}/#demo`,
      `${SITE_URL}/#solutions`,
      `${SITE_URL}/#process`,
      `${SITE_URL}/#why`,
      `${SITE_URL}/#pricing`,
      `${SITE_URL}/clients`,
      `${SITE_URL}/intake`,
    ],
  };

  const jsonLd = [
    organization,
    localBusiness,
    service,
    website,
    breadcrumbs,
    faqPage,
    founder,
    siteNavigation,
  ];

  return (
    <html lang="en-CA" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://api-bc654b.stack.relevance.ai" />
        <link rel="dns-prefetch" href="https://api-bc654b.stack.relevance.ai" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <NavBar />
        <PageTransition>{children}</PageTransition>
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
