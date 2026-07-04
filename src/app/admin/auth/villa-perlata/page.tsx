import PropertyPage from "../rental";

export const dynamic = "force-dynamic";

export default async function VillaPerlata() {
  return (
    <div className="w-screen flex justify-center">
      <PropertyPage isLaVillaPerlata={true} />
    </div>
  );
}
