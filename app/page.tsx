import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import WhatWeBuildsSection from "@/components/WhatWeBuildsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import WhyTharrosSection from "@/components/WhyTharrosSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <ProblemSection />
        <WhatWeBuildsSection />
        <HowItWorksSection />
        <WhyTharrosSection />
        <FooterSection />
      </main>
    </>
  );
}
