import IntakeForm from "@/components/IntakeForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coaching Briefing | Tharros AI Consulting",
  description: "Book your free coaching briefing. Tell us about your business and we'll map the highest-leverage AI agent we can coach you to build, tailored to your Ottawa small business.",
  alternates: {
    canonical: "https://tharros.ca/intake",
  },
  openGraph: {
    title: "Coaching Briefing | Tharros AI Consulting",
    description: "Share your business context. We use this to scope a coaching engagement that leaves you with an AI agent you actually own. Built for Ottawa small businesses.",
    url: "https://tharros.ca/intake",
    type: "website",
  }
};

export default function IntakePage() {
  return <IntakeForm />;
}
