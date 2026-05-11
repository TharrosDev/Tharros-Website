import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tharros — AI Agents for Ottawa Small Businesses",
  description:
    "Tharros builds lightweight AI agents that handle customer inquiries, capture leads, and answer questions automatically — no code required. Ottawa-based, fast turnaround.",
  openGraph: {
    title: "Tharros — AI Agents for Ottawa Small Businesses",
    description:
      "Practical AI agents for local trades, services, and professional offices. No code. No corporate fluff. Just something that works.",
    siteName: "Tharros",
    locale: "en_CA",
    type: "website",
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
