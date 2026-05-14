import NavBar from "@/components/NavBar";
import ClientsSection from "@/components/ClientsSection";
import FooterSection from "@/components/FooterSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coaching Clients | AI Agent Success Stories",
  description: "Meet Ottawa businesses we've coached through setting up their own AI agents. Case studies in trades, professional services, and small operator-led teams.",
  alternates: {
    canonical: "/clients",
  },
  openGraph: {
    title: "Coaching Clients | Tharros AI Success Stories",
    description: "Real-world impact from Tharros coaching engagements with Ottawa small businesses.",
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
