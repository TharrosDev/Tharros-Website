import NavBar from "@/components/NavBar";
import ClientsSection from "@/components/ClientsSection";
import FooterSection from "@/components/FooterSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Clients | AI Agent Success Stories",
  description: "Keep it Local, Keep it Canadian. Meet Ottawa businesses we've trained to set up their own AI agents. Case studies in trades, professional services, and small operator-led teams.",
  alternates: {
    canonical: "/clients",
  },
  openGraph: {
    title: "Training Clients | Tharros AI Success Stories",
    description: "Real-world impact from Tharros training and setup engagements with Ottawa small businesses.",
    url: "https://tharros.ca/clients",
  }
};

export default function ClientsPage() {
  return (
    <>
      <main>
        <ClientsSection />
        <FooterSection />
      </main>
    </>
  );
}
