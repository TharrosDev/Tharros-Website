import Hero from "@/components/home/Hero";
import CurrentDrop from "@/components/home/CurrentDrop";
import Statement from "@/components/home/Statement";
import ProcessSection from "@/components/home/ProcessSection";
import CampaignBlock from "@/components/home/CampaignBlock";
import DropStory from "@/components/home/DropStory";
import LookbookTeaser from "@/components/home/LookbookTeaser";
import SocialGrid from "@/components/home/SocialGrid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CurrentDrop />
      <Statement />
      <ProcessSection />
      <CampaignBlock />
      <DropStory />
      <LookbookTeaser />
      <SocialGrid />
    </>
  );
}
