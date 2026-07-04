import Image from "next/image";

export function PropertyMap() {
  return (
    <div>
      <h2 className="text-brand-ink text-2xl font-bold mb-4">Location</h2>
      <div className="relative h-[400px]">
        <Image
          src="/placeholder.svg?height=400&width=800&text=Map"
          alt="Property location map"
          fill
          sizes="100%"
          className="object-cover rounded-lg"
        />
      </div>
    </div>
  );
}
