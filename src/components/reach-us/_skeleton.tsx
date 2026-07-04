import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PlaceInfoProps {
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
}

export default function PlaceInfoSkeleton({
  phone,
  email,
  website,
}: Partial<PlaceInfoProps>) {
  return (
    <Card className="w-full h-full overflow-auto">
      <CardHeader>
        <div className="h-7 bg-brand-sand rounded w-3/4 animate-pulse mb-2"></div>
        <div className="h-4 bg-brand-sand rounded w-full animate-pulse"></div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-4 bg-brand-sand rounded w-full animate-pulse"></div>
        {phone && (
          <div className="h-4 bg-brand-sand rounded w-3/4 animate-pulse"></div>
        )}
        {email && (
          <div className="h-4 bg-brand-sand rounded w-5/6 animate-pulse"></div>
        )}
        {website && (
          <div className="h-4 bg-brand-sand rounded w-full animate-pulse"></div>
        )}
      </CardContent>
    </Card>
  );
}
