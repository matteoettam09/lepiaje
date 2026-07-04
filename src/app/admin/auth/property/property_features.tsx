export function PropertyFeatures({
  features,
  title,
}: {
  title: string;
  features: string[];
}) {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">{title || ""}</h2>
      <div className="h-[20em] overflow-scroll overflow-x-hidden scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-brand-gold">
        <ul className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <li key={index} className="flex text-gray-200 items-center">
              <svg
                className="h-5 w-5 text-green-500 mr-2"
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
    </div>
  );
}
