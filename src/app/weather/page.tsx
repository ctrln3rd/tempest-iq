import Weather from "@/component/Weather";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  searchParams: Promise<{ id?: string; name?: string }>;
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Wait for searchParams to resolve (because it's now a Promise)
  const params = await searchParams;
  const locationId = params?.id || "";
  const locationName = params?.name || "Nairobi";
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

export default function WeatherPage() {
  
  return <Weather />;
}


