import { OurMission } from "@/components/about/our_mission";
import { OurTeam } from "@/components/about/our_team";
import { OurValues } from "@/components/about/our_values";
import { OurHistory } from "@/components/about/our_history";
import { AboutBookCTAs } from "@/components/about/about_book_ctas";
import { getImages } from "@/utils/get_images_on_folder";

export default async function AboutPage() {
  const teamImages = await getImages("who_we_are");

  return (
    <div className="min-h-screen h-full w-full bg-brand-linen">
      <OurMission />
      <OurTeam imageUrls={teamImages} />
      <OurValues />
      <OurHistory />
      <AboutBookCTAs />
    </div>
  );
}
