import type { Metadata } from "next";
import { OnboardingApp } from "@/components/onboarding/OnboardingApp";

export const metadata: Metadata = {
  title: "Project Brief · Tharros",
  description:
    "Tell us about your operation. A short brief so we can scope your site before our discovery call.",
  robots: { index: false, follow: false },
};

export default function BriefPage() {
  return <OnboardingApp />;
}
