import NavBar from "@/components/NavBar";
import ClientsSection from "@/components/ClientsSection";
import FooterSection from "@/components/FooterSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients | Build & Integration Success Stories | Tharros",
  description: "Keep it Local, Keep it Canadian. Ottawa businesses with modernized websites and integrated AI agents built by Tharros. Real-world results for trades, professional services, and small operator-led teams.",
  alternates: {
    canonical: "/clients",
  },
  openGraph: {
    title: "Clients | Tharros Build & Integration Success Stories",
    description: "Real-world results from Tharros website modernization and AI agent integration builds with Ottawa small businesses.",
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
