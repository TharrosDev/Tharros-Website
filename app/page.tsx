import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import FooterSection from "@/components/FooterSection";
import NextStep from "@/components/NextStep";
import SectionSkeleton from "@/components/SectionSkeleton";

const ProblemSection = dynamic(() => import("@/components/ProblemSection"), { loading: () => <SectionSkeleton /> });
const ChatDemoSectionWrapper = dynamic(() => import("@/components/ChatDemoSectionWrapper"), { loading: () => <SectionSkeleton /> });

export default function Home() {
  return (
    <main className="bg-slate-950">
      <HeroSection />

      <div className="flex flex-col">
        <ProblemSection />
        <ChatDemoSectionWrapper />
        <NextStep
          numeral="§ 03"
          eyebrow="Keep going"
          heading="See what we build, and what it costs."
          links={[
            { label: "Explore the product", href: "/product", primary: true },
            { label: "View pricing", href: "/pricing" },
          ]}
        />
        <FooterSection />
      </div>
    </main>
  );
}
