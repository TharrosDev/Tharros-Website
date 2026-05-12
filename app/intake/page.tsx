import dynamic from "next/dynamic";
import { Metadata } from "next";

const IntakeAgent = dynamic(() => import("@/components/IntakeAgent"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-white" />
});

export const metadata: Metadata = {
  title: "Client Intake & AI Briefing",
  description: "Start your automation journey with Tharros. Converse with our specialized intake agent to outline your business objectives, lead capture needs, and custom AI solution profile.",
  alternates: {
    canonical: "/intake",
  },
  openGraph: {
    title: "Start Your AI Journey | Tharros Client Intake",
    description: "Brief our specialized intake agent on your business needs. We'll use this data to design your custom AI automation strategy.",
    url: "https://tharros.ca/intake",
  }
};

export default function IntakePage() {
  return <IntakeAgent />;
}
