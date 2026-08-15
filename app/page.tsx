import Hero from "@/components/home/Hero";
import CurrentDrop from "@/components/home/CurrentDrop";
import Statement from "@/components/home/Statement";
import FeaturedEdit from "@/components/home/FeaturedEdit";
import CampaignBlock from "@/components/home/CampaignBlock";
import CollectionStory from "@/components/home/CollectionStory";
import LookbookTeaser from "@/components/home/LookbookTeaser";
import SocialGrid from "@/components/home/SocialGrid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CurrentDrop />
      <Statement />
      <FeaturedEdit />
      <CampaignBlock />
      <CollectionStory />
      <LookbookTeaser />
      <SocialGrid />
    </>
  );
}
