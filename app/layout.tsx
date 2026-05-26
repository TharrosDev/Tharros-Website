import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import PageTransition from "@/components/PageTransition";
import NavBar from "@/components/NavBar";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const SITE_URL = "https://tharros.ca";
const SITE_NAME = "Tharros";
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
  "Gatineau",
];

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#161312" },
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
    "Ottawa's website and AI agent studio. We modernize your site, embed a custom AI agent, and stay on call. Serving Ottawa, Kanata, Nepean, Barrhaven, Orleans, Stittsville, and Gatineau. Keep it Local, Keep it Canadian.",
  keywords: [
    // — Core service terms ————————————————————————
    "Ottawa Web Design",
    "Ottawa Web Development",
    "Ottawa Web Designer",
    "Ottawa Web Developer",
    "Ottawa Web Agency",
    "Ottawa Digital Agency",
    "Ottawa Website Design",
    "Ottawa Website Development",
    "Ottawa Website Builder",
    "Ottawa Website Company",
    "Website Design Ottawa",
    "Web Design Ottawa",
    "Web Development Ottawa",
    "Professional Website Ottawa",
    "Business Website Ottawa",
    "Affordable Website Ottawa",
    "Local Web Developer Ottawa",
    "Best Web Developer Ottawa",
    "Ottawa Tech Company Website",
    "Next.js Website Ottawa",

    // — Website modernization ————————————————————
    "Website Modernization Ottawa",
    "Website Redesign Ottawa",
    "Small Business Website Redesign Ottawa",
    "Ottawa Website Redesign",
    "Modernize Business Website Ottawa",
    "Outdated Website Redesign Ottawa",

    // — AI agents ————————————————————————————————
    "AI Agent Ottawa",
    "AI Agent Integration Ottawa",
    "AI Agent Build Ottawa",
    "Custom AI Agent Ottawa",
    "AI Agent for Small Business",
    "AI Agent for Small Business Ottawa",
    "AI Agent Canada",
    "AI Website Ottawa",
    "AI Automation Ottawa",
    "Conversational AI Ottawa",
    "AI for Small Business Canada",
    "Embed AI Agent on Website",
    "Add AI to Website",
    "Website with AI Chat Ottawa",
    "AI Customer Service Agent Ottawa",
    "AI Lead Capture Agent Ottawa",
    "AI After-Hours Intake Agent",
    "AI Receptionist for Small Business",
    "AI Inquiry Agent Ottawa",
    "AI Intake Automation Ottawa",
    "Ottawa AI Consulting",
    "Ottawa Local Business AI",
    "AI Chatbot for Small Business Ottawa",

    // — Packages & support ———————————————————————
    "Ottawa Small Business Website",
    "Website and AI Agent Package",
    "On-Call Web Retainer Ottawa",
    "Website Maintenance Retainer Ottawa",
    "Monthly Retainer Web Ottawa",
    "Per-Call Web Support Ottawa",
    "CRM Integration Ottawa",
    "HubSpot Integration Ottawa",
    "Discovery Call Ottawa Web",

    // — Trades & local business types ————————————
    "Ottawa Trades Website",
    "Ottawa Contractor Website",
    "Ottawa Contractor Website Design",
    "Ottawa Trades Web Design",
    "HVAC Website Ottawa",
    "Plumbing Website Ottawa",
    "Roofing Website Ottawa",
    "Electrician Website Ottawa",
    "Landscaping Website Ottawa",
    "Contractor Website Ottawa",
    "Auto Repair Website Ottawa",
    "Ottawa Restaurant Website",
    "Ottawa Medical Clinic Website",
    "Ottawa Physiotherapy Website",
    "Ottawa Dental Office Website",
    "Dental Office Website Ottawa",
    "Veterinary Clinic Website Ottawa",
    "Law Firm Website Ottawa",
    "Accountant Website Ottawa",
    "Real Estate Website Ottawa",
    "Ottawa Financial Advisor Website",
    "Ottawa Consulting Firm Website",
    "Ottawa Salon Website",
    "Ottawa Cleaning Service Website",
    "Ottawa Yoga Studio Website",
    "Ottawa Fitness Website",

    // — Service area variants ————————————————————
    "Kanata Web Design",
    "Kanata Web Developer",
    "Kanata Website Design",
    "Kanata Small Business Website",
    "Nepean Web Design",
    "Nepean Web Developer",
    "Nepean Website Design",
    "Nepean Small Business Website",
    "Barrhaven Web Design",
    "Barrhaven Web Developer",
    "Barrhaven Website Design",
    "Barrhaven Small Business Website",
    "Orleans Web Design",
    "Orleans Web Developer",
    "Orleans Website Design",
    "Orleans Small Business Website",
    "Stittsville Web Design",
    "Stittsville Small Business Website",
    "Gatineau Web Design",
    "Gatineau Web Developer",
    "National Capital Region Web Design",

    // — Brand ————————————————————————————————————
    "Tharros",
    "Tharros AI",
    "Tharros Ottawa",
    "Keep it Local",
    "Keep it Canadian",
    "Keep it Local Keep it Canadian",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
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
    alternateLocale: ["en_US"],
    type: "website",
    countryName: "Canada",
    images: [
      {
        url: "/opengraph-image/hero",
        width: 1200,
        height: 630,
        alt: "Tharros — modern websites and integrated AI agents for Ottawa businesses.",
        type: "image/png",
      },
      {
        url: "/opengraph-image/packages",
        width: 1200,
        height: 630,
        alt: "Tharros — The Refresh, The On-Call, The Integrate: three packages for Ottawa small businesses.",
        type: "image/png",
      },
      {
        url: "/opengraph-image/slogan",
        width: 1200,
        height: 630,
        alt: "Keep it Local, Keep it Canadian. — Tharros, Ottawa's website and AI agent studio.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharros — Modern Websites & AI Agents | Ottawa",
    description:
      "Modern websites. Integrated AI agents. One team, on call. Built in Ottawa for trades and small businesses. Keep it Local, Keep it Canadian.",
    images: ["/opengraph-image/hero"],
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
    "msapplication-TileColor": "#161312",
    "msapplication-config": "/browserconfig.xml",
    rating: "general",
    "revisit-after": "7 days",
    "business:contact_data:locality": "Ottawa",
    "business:contact_data:region": "ON",
    "business:contact_data:country_name": "Canada",
    "business:contact_data:email": CONTACT_EMAIL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
    },
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
    inLanguage: "en-CA",
    mainEntityOfPage: { "@id": `${SITE_URL}/#webpage` },
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/tharros-logo.svg`,
      width: 512,
      height: 512,
    },
    image: [
      `${SITE_URL}/opengraph-image/hero`,
      `${SITE_URL}/tharros-logo.svg`,
      `${SITE_URL}/icon-512.png`,
    ],
    description:
      "Ottawa-based team delivering website modernization, AI agent integration, and an On-Call retainer for small businesses and trades.",
    foundingDate: "2025",
    knowsAbout: [
      "Website Design",
      "Website Modernization",
      "Web Development",
      "Next.js",
      "React",
      "TypeScript",
      "AI Agent Integration",
      "Conversational AI",
      "Large Language Models",
      "Retrieval-Augmented Generation",
      "CRM Integration",
      "Lead Capture Automation",
      "After-Hours Intake Automation",
      "Customer Inquiry Automation",
      "HubSpot Integration",
      "Small Business Operations",
      "Ottawa Local Business",
      "Trades Business Websites",
      "Local SEO",
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
    image: `${SITE_URL}/opengraph-image/hero`,
    logo: `${SITE_URL}/tharros-logo.svg`,
    inLanguage: "en-CA",
    url: SITE_URL,
    email: CONTACT_EMAIL,
    description:
      "Keep it Local, Keep it Canadian. Website modernization, AI agent integration, and an On-Call retainer for Ottawa trades and small businesses.",
    slogan: "Keep it Local, Keep it Canadian.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ottawa",
      addressRegion: "ON",
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
    makesOffer: [
      {
        "@type": "Offer",
        name: "The Refresh",
        description:
          "Project-based website modernization for Ottawa small businesses, site only. Per-call support after launch. Starting from $1,000 CAD. Launch pricing from $250 through August 31, 2026.",
        priceCurrency: "CAD",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "CAD",
          minPrice: 1000,
          description: "Starting price; final scope quoted after a free discovery call.",
        },
        availability: "https://schema.org/InStock",
        category: "Website Modernization",
      },
      {
        "@type": "Offer",
        name: "The On-Call",
        description:
          "Website modernization plus a flat monthly retainer for unlimited site fixes and edits. No embedded agent. Starting from $1,500 CAD plus $150/month. Launch pricing from $500 through August 31, 2026.",
        priceCurrency: "CAD",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "CAD",
          minPrice: 1500,
          description: "Starting build price plus a $150/month retainer; final scope quoted after a free discovery call.",
        },
        availability: "https://schema.org/InStock",
        category: "Website + Monthly Retainer",
      },
      {
        "@type": "Offer",
        name: "The Integrate",
        description:
          "Website modernization plus a custom AI agent embedded into the site, plus a monthly retainer covering fixes, agent upkeep, and unlimited new agents. Starting from $3,000 CAD plus $300/month.",
        priceCurrency: "CAD",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "CAD",
          minPrice: 3000,
          description: "Starting build price plus a $300/month retainer; final scope quoted after a free discovery call.",
        },
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
    serviceOutput:
      "A modernized website, optional embedded AI agent integrated with the client's CRM and intake tools, and ongoing per-call or monthly retainer support.",
    termsOfService: `${SITE_URL}/brief`,
    inLanguage: "en-CA",
    mainEntityOfPage: { "@id": `${SITE_URL}/#webpage` },
    category: "Web Development & AI Integration",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Website and AI Agent Build Packages",
      itemListElement: [
        {
          "@type": "Offer",
          position: 1,
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "CAD",
            minPrice: 1000,
            description: "Starting price; launch pricing from $250 through August 31, 2026.",
          },
          itemOffered: {
            "@type": "Service",
            name: "The Refresh",
            description:
              "Project-based website modernization for Ottawa small businesses, site only. We update the design, copy, and structure so your front door reflects the operation behind it. Fixes and changes after launch are billed per call. Starting from $1,000 CAD (launch pricing from $250 through August 31, 2026).",
            serviceType: "Website Modernization",
            provider: { "@id": `${SITE_URL}/#localbusiness` },
          },
        },
        {
          "@type": "Offer",
          position: 2,
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "CAD",
            minPrice: 1500,
            description: "Starting build price plus $150/month retainer; launch pricing from $500 through August 31, 2026.",
          },
          itemOffered: {
            "@type": "Service",
            name: "The On-Call",
            description:
              "Website modernization plus a flat monthly retainer that rolls in unlimited site fixes and edits. No embedded AI agent in this tier. Starting from $1,500 CAD plus $150/month (launch pricing from $500 through August 31, 2026).",
            serviceType: "Website + Monthly Retainer",
            provider: { "@id": `${SITE_URL}/#localbusiness` },
          },
        },
        {
          "@type": "Offer",
          position: 3,
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "CAD",
            minPrice: 3000,
            description: "Starting build price plus $300/month retainer.",
          },
          itemOffered: {
            "@type": "Service",
            name: "The Integrate",
            description:
              "Website modernization plus a custom AI agent built and embedded directly into the site, covering customer inquiry, lead capture, or after-hours intake, followed by a monthly retainer for fixes, agent upkeep, and unlimited new agent builds. Starting from $3,000 CAD plus $300/month.",
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
    "@id": `${SITE_URL}/#breadcrumbs`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
    ],
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: "Tharros — Modern Websites & AI Agents for Ottawa Businesses",
    description:
      "Modern websites. Integrated AI agents. One team, on call. For Ottawa trades and small businesses. Keep it Local, Keep it Canadian.",
    inLanguage: "en-CA",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#localbusiness` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/opengraph-image/hero`,
      width: 1200,
      height: 630,
    },
    breadcrumb: { "@id": `${SITE_URL}/#breadcrumbs` },
    datePublished: "2025-09-01",
    dateModified: new Date().toISOString().slice(0, 10),
    mainContentOfPage: { "@id": `${SITE_URL}/#service` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".type-display-2", ".type-lead"],
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    inLanguage: "en-CA",
    mainEntityOfPage: { "@id": `${SITE_URL}/#webpage` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[itemprop='name']", "[itemprop='acceptedAnswer']"],
    },
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does a Tharros build cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Each build has a starting price: The Refresh (site only) from $1,000, The On-Call (site plus a monthly retainer for fixes and edits) from $1,500 plus $150/month, and The Integrate (site plus an embedded AI agent plus a retainer) from $3,000 plus $300/month. After a free discovery call we send a firm, no-obligation proposal scoped to your business. A launch discount is on now: The Refresh from $250 and The On-Call from $500 through August 31, 2026.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a launch discount right now?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. For our first three months we're cutting build fees on two packages: The Refresh drops from $1,000 to $250, and The On-Call build drops from $1,500 to $500 (the $150/month retainer is unchanged). The offer runs through August 31, 2026. The Integrate stays at its standard $3,000 plus $300/month.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between pay-per-call and a monthly retainer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "With The Refresh, fixes after launch are billed one job at a time, the way you'd call a plumber. The On-Call and The Integrate put support on a flat monthly retainer instead. The On-Call retainer ($150/month) covers unlimited site fixes and edits; The Integrate retainer ($300/month) adds the embedded AI agent, agent upkeep, and unlimited new agent builds.",
        },
      },
      {
        "@type": "Question",
        name: "Do you only work with Ottawa businesses?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tharros focuses on the Ottawa area: Kanata, Nepean, Barrhaven, Orleans, and Stittsville included. The advantage is local context. We know the trades and small business landscape in this city.",
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
          text: "Yes. The site, the content, and the agent run on infrastructure you control. A monthly retainer (The On-Call or The Integrate) keeps Tharros on the line for changes; per-call works if you'd rather call us when something needs doing.",
        },
      },
      {
        "@type": "Question",
        name: "What if I just want a new website, no AI agent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "That's The Refresh, our project-based website modernization package, from $1,000 (launch pricing from $250 through August 31, 2026). No agent required. After launch, fixes are billed per call, or step up to The On-Call for a monthly retainer that covers fixes and edits.",
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
          text: "Book a free discovery call from the homepage or fill out the brief at tharros.ca/brief. We'll listen to your operation, scope the build, and walk you through per-call support versus a monthly retainer with no obligation.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between an AI agent and a chatbot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A chatbot follows a decision tree and gives canned responses to expected inputs. An AI agent reads your actual business content (your services, pricing, policies, hours) and answers questions the way a knowledgeable employee would. Tharros builds AI agents trained on your operation, not chatbot scripts.",
        },
      },
      {
        "@type": "Question",
        name: "What types of businesses does Tharros build for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Trades and local service businesses are the core: HVAC, plumbing, roofing, electrical, landscaping, contracting, dental, veterinary, physiotherapy, legal, accounting, real estate, auto repair, restaurants, salons, fitness studios, and more. If you serve Ottawa-area customers and need a modern website that works while you're on the job, we're the right team.",
        },
      },
      {
        "@type": "Question",
        name: "Do you work in Gatineau and the National Capital Region?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We serve the broader Ottawa–Gatineau National Capital Region, including Kanata, Nepean, Barrhaven, Orleans, Stittsville, and Gatineau, QC. Local context is part of what we bring to every build.",
        },
      },
      {
        "@type": "Question",
        name: "What is website modernization?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Website modernization means replacing an outdated, slow, or visually tired site with a fast, mobile-first site that reflects your current business. We don't restyle; we rebuild with modern tooling so the result is fast, accessible, easy to update, and ready to have an AI agent embedded into it when the time comes.",
        },
      },
      {
        "@type": "Question",
        name: "Can I add an AI agent later if I start with The Refresh?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The packages are designed to be stepped. Start with The Refresh to modernize your site, add The On-Call if you want a monthly retainer for fixes, and move to The Integrate when you're ready to embed an AI agent. Upgrading doesn't require rebuilding from scratch.",
        },
      },
      {
        "@type": "Question",
        name: "What does the free discovery call cover?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We listen to your operation: what you do, how you get customers, what's broken or missing on your current site, and what you'd want an AI agent to handle. From that call we scope the build and send a firm, no-obligation proposal. It usually runs 30–45 minutes.",
        },
      },
    ],
  };

  const siteNavigation = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: [
      "Home",
      "Product",
      "Pricing",
      "Clients",
      "Book a Discovery Call",
    ],
    url: [
      SITE_URL,
      `${SITE_URL}/product`,
      `${SITE_URL}/pricing`,
      `${SITE_URL}/clients`,
      `${SITE_URL}/brief`,
    ],
  };

  const jsonLd = [
    organization,
    localBusiness,
    service,
    website,
    webpage,
    breadcrumbs,
    faqPage,
    siteNavigation,
  ];

  return (
    <html lang="en-CA" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
        <ScrollProgress />
        <NavBar />
        <PageTransition>{children}</PageTransition>
        <BackToTop />
        <Analytics />
        <footer className="bg-[color:var(--surface-dark)] border-t-[3px] border-[color:var(--red)]">
          <div className="page-frame py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="num text-[11px] text-[color:var(--ink-on-dark-muted)]">
              © {new Date().getFullYear()} THARROS · OTTAWA · ALL RIGHTS RESERVED
            </span>
            <Link
              href="/privacy"
              className="num text-[11px] text-[color:var(--ink-on-dark-muted)] hover:text-[color:var(--ink-on-dark)] transition-colors"
            >
              PRIVACY
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
