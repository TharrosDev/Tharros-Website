import IntakeForm from "@/components/IntakeForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training & Setup Briefing | Tharros AI Consulting",
  description: "Keep it Local, Keep it Canadian. Book your free training and setup briefing. Tell us about your business and we'll map the highest-leverage AI agent to train you on, tailored to your Ottawa small business.",
  alternates: {
    canonical: "https://tharros.ca/intake",
  },
  openGraph: {
    title: "Training & Setup Briefing | Tharros AI Consulting",
    description: "Share your business context. We use this to scope a training and setup engagement that leaves you with an AI agent you actually own. Built for Ottawa small businesses.",
    url: "https://tharros.ca/intake",
    type: "website",
  }
};

export default function IntakePage() {
  return <IntakeForm />;
}
