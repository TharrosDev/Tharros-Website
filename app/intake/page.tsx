import IntakeForm from "@/components/IntakeForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Intake | Strategic AI Briefing",
  description: "Formalize your project requirements. Submit your strategic briefing to design a high-performance agent profile tailored to your specific lead capture objectives in the Ottawa market.",
  alternates: {
    canonical: "https://tharros.ca/intake",
  },
  openGraph: {
    title: "Strategic Briefing | Tharros Intake Portal",
    description: "Submit your business needs. We'll use this data to design your custom AI automation strategy. Tailored for Ottawa small businesses.",
    url: "https://tharros.ca/intake",
    type: "website",
  }
};

export default function IntakePage() {
  return <IntakeForm />;
}
