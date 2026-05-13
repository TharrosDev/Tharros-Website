import IntakeForm from "@/components/IntakeForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Intake & Strategic Briefing",
  description: "Formalize your project requirements. Submit your strategic briefing to design a high-performance agent profile tailored to your specific lead capture objectives.",
  alternates: {
    canonical: "/intake",
  },
  openGraph: {
    title: "Strategic Briefing | Tharros Intake Portal",
    description: "Submit your business needs. We'll use this data to design your custom AI automation strategy.",
    url: "https://tharros.ca/intake",
  }
};

export default function IntakePage() {
  return <IntakeForm />;
}
