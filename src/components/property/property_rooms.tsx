export function PropertyRooms({
  features,
  title,
}: {
  title: string;
  features: string[] | undefined;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-brand-ink">{title || ""}</h2>
      <ul className="grid grid-cols-2 gap-4">
        {features?.map((feature, index) => (
          <li key={index} className="flex text-brand-ink items-center">
            <svg
              className="h-5 w-5 text-brand-terracotta mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
