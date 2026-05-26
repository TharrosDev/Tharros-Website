import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import WorkReel from "@/components/WorkReel";
import NextStep from "@/components/NextStep";
import SectionSkeleton from "@/components/SectionSkeleton";

const ProblemSection = dynamic(() => import("@/components/ProblemSection"), { loading: () => <SectionSkeleton /> });
const ChatDemoSectionWrapper = dynamic(() => import("@/components/ChatDemoSectionWrapper"), { loading: () => <SectionSkeleton /> });

export default function Home() {
  return (
    <main className="bg-[color:var(--surface)]">
      <HeroSection />
      <WorkReel />

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
      </div>
    </main>
  );
}
