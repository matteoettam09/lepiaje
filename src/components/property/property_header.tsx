export function PropertyHeader({
  name,
  location_name,
}: {
  name: string;
  location_name: string;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-ink">{name}</h1>
      <p className="text-brand-muted mt-1">{location_name}</p>
    </div>
  );
}
