import NavBar from "@/components/NavBar";
import ClientsSection from "@/components/ClientsSection";
import FooterSection from "@/components/FooterSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients | Tharros AI Agents",
  description: "Explore how Ottawa businesses are recovering time and capturing more revenue with Tharros Autonomous AI Agents.",
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
