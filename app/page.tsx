import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import WhatWeBuildsSection from "@/components/WhatWeBuildsSection";
import ChatDemoSection from "@/components/ChatDemoSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import WhyTharrosSection from "@/components/WhyTharrosSection";
import PricingSection from "@/components/PricingSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <ProblemSection />
        <ChatDemoSection />
        <WhatWeBuildsSection />
        <HowItWorksSection />
        <WhyTharrosSection />
        <PricingSection />
        <FooterSection />
      </main>
    </>
  );
}
