import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlaceInfoProps {
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
}

export default function PlaceInfo({
  name,
  description,
  address,
  phone,
  email,
  website,
}: PlaceInfoProps) {
  return (
    <Card className="w-full h-full overflow-auto">
      <CardHeader>
        <CardTitle className="text-brand-ink">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-brand-muted">
        <p className="mb-2">
          <strong>Address:</strong> {address}
        </p>
        {phone && (
          <p className="mb-2">
            <strong>Phone:</strong> {phone}
          </p>
        )}
        {email && (
          <p className="mb-2">
            <strong>Email:</strong> {email}
          </p>
        )}
        {website && (
          <p className="mb-2">
            <strong>Website:</strong>{" "}
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-terracotta hover:underline"
            >
              {website}
            </a>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
