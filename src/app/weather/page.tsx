import Weather from "@/component/Weather";
import { Metadata } from "next";

interface WeatherProps {
  searchParams?: { id?: string; name?: string };
}

export function generateMetadata({ searchParams }: WeatherProps): Metadata {
  const locationId = searchParams?.id || "";
  const locationName = searchParams?.name || "Nairobi";
  const decodedLocationName = decodeURIComponent(locationName);

  return {
    title: `Weather in ${decodedLocationName}`,
    description: `Get the latest weather updates for ${decodedLocationName.toUpperCase()}, summarized, easy to read and interpret.`,
    openGraph: {
      title: `Weather in ${decodedLocationName}`,
      description: `Get the latest weather updates for ${decodedLocationName.toUpperCase()}, summarized, easy to read and interpret.`,
      url: `https://weatherrush.netlify.app/weather?locationId=${locationId}&name=${encodeURIComponent(decodedLocationName)}`,
      images: [`https://weatherrush.netlify.app/api/og?location=${encodeURIComponent(decodedLocationName)}`],
    },
  };
}

export default function WeatherPage({ searchParams }: WeatherProps) {
  const locationId = searchParams?.id || "";
  const locationName = searchParams?.name || "Nairobi";

  return <Weather locationId={locationId} locationName={decodeURIComponent(locationName)} />;
}
