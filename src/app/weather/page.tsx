import Weather from "@/component/Weather";
import { Metadata } from "next";

interface WeatherProps {
  searchParams: Promise<{ id?: string; name?: string }>;
}

export async function generateMetadata({ searchParams }: WeatherProps): Promise<Metadata> {
  const search = await searchParams; // Await searchParams before using it

  const locationId = search?.id || "";
  const locationName = search?.name || "Nairobi";
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

export default async function WeatherPage({ searchParams }: WeatherProps) {
  const search = await searchParams; // Await searchParams before using it

  const locationId = search?.id || "";
  const locationName = search?.name || "Nairobi";

  return <Weather locationId={locationId} locationName={decodeURIComponent(locationName)} />;
}

