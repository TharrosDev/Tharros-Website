import NavBar from "@/components/NavBar";
import ClientsSection from "@/components/ClientsSection";
import FooterSection from "@/components/FooterSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portfolio | AI Agent Success Stories",
  description: "Explore how Ottawa businesses are recovering time and capturing more revenue with Tharros Autonomous AI Agents. Case studies in local trades and professional services.",
  alternates: {
    canonical: "/clients",
  },
  openGraph: {
    title: "Client Portfolio | Tharros AI Success Stories",
    description: "Real-world impact of autonomous AI agents for Ottawa businesses.",
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
