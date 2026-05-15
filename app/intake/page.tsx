import IntakeForm from "@/components/IntakeForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discovery Briefing | Tharros",
  description: "Keep it Local, Keep it Canadian. Book your free discovery call. Tell us about your business and we'll scope a tailored build — website modernization, AI agent integration, or the full On-Call retainer for your Ottawa small business.",
  alternates: {
    canonical: "https://tharros.ca/intake",
  },
  openGraph: {
    title: "Discovery Briefing | Tharros",
    description: "Share your business context. We use this to scope a build that fits your operation — website modernization, AI agent integration, or the full On-Call retainer. Built for Ottawa small businesses.",
    url: "https://tharros.ca/intake",
    type: "website",
  }
};

export default function IntakePage() {
  return <IntakeForm />;
}
