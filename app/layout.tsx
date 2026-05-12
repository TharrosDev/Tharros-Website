import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import PageTransition from "@/components/PageTransition";

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
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tharros.ca"),
  title: {
    default: "Tharros — Custom AI Agents for Ottawa Small Businesses",
    template: "%s | Tharros AI Studio",
  },
  description:
    "Tharros builds high-performance AI agents tailored for Ottawa small businesses. We automate lead capture, customer service, and admin tasks so you can focus on growth. Local expertise, industrial-grade results.",
  keywords: [
    "AI Agents Ottawa",
    "Ottawa Small Business Automation",
    "Lead Capture AI Ontario",
    "Customer Support AI Agents",
    "Ottawa Tech Studio",
    "Practical AI Solutions for Business",
    "Automated Customer Service Ottawa",
    "HVAC AI Agent Ottawa",
    "Lawyer Lead Automation Canada",
    "Contractor AI Chatbot",
    "Dental Clinic AI Receptionist",
    "Property Management AI Assistant",
    "After-hours lead capture Ottawa",
    "Local AI Automation Studio",
    "Kanata AI Business Solutions",
    "Nepean AI Automation",
    "Glebe Small Business Tech",
  ],
  authors: [{ name: "Magnus Abdelnour" }],
  creator: "Tharros",
  publisher: "Tharros",
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
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
    title: "Tharros — Custom AI Agents for Ottawa Small Businesses",
    description:
      "Recover your time and capture every lead with practical AI agents built for local trades, professional services, and small businesses in Ottawa. No corporate fluff, just performance.",
    url: "https://tharros.ca",
    siteName: "Tharros AI Studio",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharros AI Agent Studio Ottawa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharros — AI Agents for Ottawa Small Businesses",
    description: "High-performance AI agents that work for your local business. 24/7 lead capture and admin automation with Ottawa-specific context.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tharros AI",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Tharros",
    "image": "https://tharros.ca/og-image.jpg",
    "@id": "https://tharros.ca",
    "url": "https://tharros.ca",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ottawa",
      "addressRegion": "ON",
      "addressCountry": "CA"
    },
    "description": "Tailored AI agents for Ottawa small businesses. We automate lead capture, customer service, and admin tasks.",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  };

  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}

