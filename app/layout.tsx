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

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tharros.ca"),
  title: {
    default: "Tharros | Keep it Local, Keep it Canadian | AI Agent Training & Setup for Ottawa Small Businesses",
    template: "%s | Tharros AI Consulting",
  },
  description:
    "Keep it Local, Keep it Canadian. AI agent and AI tool training, live setup, and website modernization with embedded agents for Ottawa trades and small business owners. We train you, set it up with you, and integrate it into your site.",
  keywords: [
    "AI Agent Training Ottawa",
    "AI Agent Setup Ottawa",
    "AI Training for Small Business",
    "AI Setup Service Ottawa",
    "AI Agent Consulting Ottawa",
    "Learn to Set Up AI Agents",
    "No-Code AI Training",
    "AI Workshops for Small Business",
    "Hands-on AI Training",
    "Live AI Agent Setup",
    "Ottawa AI Consulting",
    "AI Implementation Training",
    "AI Agent Setup Help",
    "Small Business AI Training",
    "Fractional AI Lead",
    "AI Advisory Retainer",
    "AI Skills Training Ottawa",
    "Custom AI Agent Training",
    "LLM Training for Business Owners",
    "GPT Training for Trades",
    "Anthropic Claude Training",
    "AI Customer Service Setup",
    "AI Intake Setup Training",
    "AI Appointment Setting Training",
    "Smart AI Receptionist Setup",
    "AI Training for SMB",
    "Tharros AI Consulting",
    "AI Strategy for Trades",
    "Contractor AI Training",
    "Legal AI Training",
    "Medical AI Training Ottawa",
    "Real Estate AI Training",
    "AI SDR Training",
    "AI Office Admin Training",
    "Kanata AI Training",
    "Nepean AI Training",
    "Stittsville AI Training",
    "Orleans AI Training",
    "Barrhaven AI Training",
    "Ottawa Tech Training",
    "HVAC AI Training",
    "Plumbing AI Setup",
    "Roofing AI Training",
    "Dental Office AI Training",
    "Veterinary AI Setup",
    "Auto Repair AI Training",
    "Knowledge Management Training",
    "AI Skill Transfer Ottawa",
    "Website Modernization Ottawa",
    "Small Business Website Redesign Ottawa",
    "AI Agent Website Integration",
    "Embed AI Agent on Website",
    "AI Tool Training for Small Business",
    "Ottawa Web Development with AI",
    "Keep it Local",
    "Keep it Canadian",
    "Keep it Local Keep it Canadian",
    "Tharros Slogan",
  ],
  authors: [{ name: "Magnus Abdelnour" }],
  creator: "Tharros",
  publisher: "Tharros",
  category: "technology",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Tharros | Keep it Local, Keep it Canadian | AI Training, Setup & Website Modernization for Ottawa",
    description:
      "Keep it Local, Keep it Canadian. AI agent and AI tool training, live setup, and website modernization with embedded agents for Ottawa trades and small businesses. We train you, set it up with you, and integrate it into your site.",
    url: "https://tharros.ca",
    siteName: "Tharros AI Consulting",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharros AI Consulting Ottawa - Training & Setup for Small Business Owners | Keep it Local, Keep it Canadian",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharros | Keep it Local, Keep it Canadian",
    description: "Keep it Local, Keep it Canadian. AI agent training, setup, and website modernization for Ottawa small businesses. We train you to set up the agents, not sell them to you.",
    images: ["/og-image.jpg"],
    creator: "@TharrosAI",
  },
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tharros AI Consulting",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Tharros",
      "alternateName": "Tharros AI Consulting",
      "slogan": "Keep it Local, Keep it Canadian.",
      "url": "https://tharros.ca",
      "logo": "https://tharros.ca/tharros-logo.svg",
      "sameAs": [
        "https://linkedin.com/company/tharros-ai"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "",
        "contactType": "customer service",
        "email": "tharrosdev@gmail.com",
        "areaServed": "CA",
        "availableLanguage": "en"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Tharros",
      "image": "https://tharros.ca/og-image.jpg",
      "@id": "https://tharros.ca",
      "url": "https://tharros.ca",
      "telephone": "",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Kanata",
        "addressLocality": "Ottawa",
        "addressRegion": "ON",
        "postalCode": "K2K",
        "addressCountry": "CA"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 45.3483,
        "longitude": -75.9103
      },
      "description": "Keep it Local, Keep it Canadian. AI agent and AI tool training, live setup, and website modernization with embedded agents for Ottawa trades and small businesses. We train owners and operators, set agents up with them, and integrate them into their site.",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      },
      "priceRange": "$$"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "AI Agent Training, Setup, and Website Modernization Consulting",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tharros"
      },
      "areaServed": {
        "@type": "City",
        "name": "Ottawa"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "AI Training and Setup Engagements",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Setup Sprint",
              "description": "A 1-3 day hands-on training and live setup engagement that walks an Ottawa owner through standing up their first AI agent."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Operator Program",
              "description": "A one-week team training program covering agents and AI tools, including website modernization and direct agent embedding. Leaves the team with an internal setup playbook."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Fractional AI Lead",
              "description": "A 1-2 week intensive of agent and AI tool training and live build, including a full website modernization with the agent integrated across the site, followed by an ongoing retainer for new agent setups, tuning, and roadmap reviews."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Website Modernization with AI Agent Integration",
              "description": "Modernize the marketing website of an Ottawa small business and embed an AI agent directly into the site. Included with the Operator Program and Fractional AI Lead packages."
            }
          }
        ]
      }
    }
  ];

  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://api-bc654b.stack.relevance.ai" />
        <link rel="dns-prefetch" href="https://api-bc654b.stack.relevance.ai" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <Script
          id="json-ld"
          type="application/ld+json"
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

