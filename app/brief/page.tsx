// app/brief/page.tsx — Public route for the onboarding wizard.
//
// Mounts the client-side OnboardingApp. This file is a server component by
// default; OnboardingApp is `"use client"` so React hydrates it on the client.

import type { Metadata } from "next";
import { OnboardingApp } from "@/components/onboarding/OnboardingApp";

export const metadata: Metadata = {
  title: "Project Brief · Tharros",
  description:
    "Tell us about your operation. A short brief so we can scope your site before our discovery call.",
  robots: { index: false, follow: false },
  // Don't expose this page to crawlers — it's a private intake form.
};

export default function BriefPage() {
  return <OnboardingApp />;
}
