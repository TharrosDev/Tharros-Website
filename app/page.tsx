import dynamic from "next/dynamic";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import WhatWeBuildsSection from "@/components/WhatWeBuildsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import WhyTharrosSection from "@/components/WhyTharrosSection";
import PricingSection from "@/components/PricingSection";
import FooterSection from "@/components/FooterSection";

const ChatDemoSection = dynamic(() => import("@/components/ChatDemoSection"), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-slate-50 animate-pulse rounded-3xl" />
});

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <div className="content-visibility-auto"><ProblemSection /></div>
        <div className="content-visibility-auto"><ChatDemoSection /></div>
        <div className="content-visibility-auto"><WhatWeBuildsSection /></div>
        <div className="content-visibility-auto"><HowItWorksSection /></div>
        <div className="content-visibility-auto"><WhyTharrosSection /></div>
        <div className="content-visibility-auto"><PricingSection /></div>
        <FooterSection />
      </main>
    </>
  );
}
