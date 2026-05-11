import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tharros.io"),
  title: {
    default: "Tharros — AI Agents for Ottawa Small Businesses",
    template: "%s | Tharros",
  },
  description:
    "Tharros builds lightweight AI agents that handle customer inquiries, capture leads, and answer questions automatically. Ottawa-based studio for practical AI solutions.",
  keywords: [
    "AI Agents Ottawa",
    "Small Business Automation",
    "Lead Capture AI",
    "Customer Support AI",
    "Ottawa Tech Studio",
    "Practical AI Solutions",
    "Automated Customer Service",
  ],
  authors: [{ name: "Magnus Abdelnour" }],
  creator: "Tharros",
  publisher: "Tharros",
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
    title: "Tharros — AI Agents for Ottawa Small Businesses",
    description:
      "Practical AI agents for local trades, services, and professional offices. No code. No corporate fluff. Just something that works.",
    url: "https://tharros.io",
    siteName: "Tharros",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharros AI Agent Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharros — AI Agents for Ottawa Small Businesses",
    description: "Practical AI agents that work for your small business. 24/7 automation with local Ottawa context.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
