import { OurMission } from "@/components/about/our_mission";
import { OurValues } from "@/components/about/our_values";
import { OurHistory } from "@/components/about/our_history";

export default function AboutPage() {
  return (
    <div className="min-h-screen h-full w-full bg-brand-linen">
      <OurMission />
      <OurValues />
      <OurHistory />
    </div>
  );
}
