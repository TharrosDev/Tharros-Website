import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import FooterSection from "@/components/FooterSection";
import SectionSkeleton from "@/components/SectionSkeleton";

// Granular lazy loading for below-the-fold content
const ProblemSection = dynamic(() => import("@/components/ProblemSection"), { loading: () => <SectionSkeleton /> });
const WhatWeBuildsSection = dynamic(() => import("@/components/WhatWeBuildsSection"), { loading: () => <SectionSkeleton /> });
const HowItWorksSection = dynamic(() => import("@/components/HowItWorksSection"), { loading: () => <SectionSkeleton /> });
const WhyTharrosSection = dynamic(() => import("@/components/WhyTharrosSection"), { loading: () => <SectionSkeleton /> });
const PricingSection = dynamic(() => import("@/components/PricingSection"), { loading: () => <SectionSkeleton /> });
const ChatDemoSectionWrapper = dynamic(() => import("@/components/ChatDemoSectionWrapper"), { loading: () => <SectionSkeleton /> });
const ModelTiersSection = dynamic(() => import("@/components/ModelTiersSection"), { loading: () => <SectionSkeleton /> });

export default function Home() {
  return (
    <main className="relative">
      <HeroSection />
      
      <div className="gpu-accelerated">
        <section className="content-visibility-auto">
          <ProblemSection />
        </section>
        
        <section className="content-visibility-auto">
          <ChatDemoSectionWrapper />
        </section>
        
        <section className="content-visibility-auto">
          <ModelTiersSection />
        </section>
        
        <section className="content-visibility-auto">
          <WhatWeBuildsSection />
        </section>
        
        <section className="content-visibility-auto">
          <HowItWorksSection />
        </section>
        
        <section className="content-visibility-auto">
          <WhyTharrosSection />
        </section>
        
        <section className="content-visibility-auto">
          <PricingSection />
        </section>
        
        <FooterSection />
      </div>
    </main>
  );
}
