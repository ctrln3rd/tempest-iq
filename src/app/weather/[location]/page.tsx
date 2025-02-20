import Weather from "@/component/Weather";
import { Metadata } from "next";

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const locationName = decodeURIComponent(params?.location || "Nairobi");

    return {
        title: `Weather in ${locationName}`,
        description: `Get the latest weather updates for ${locationName}`,
        openGraph: {
            title: `Weather in ${locationName}`,
            description: `Get the latest weather updates for ${locationName}`,
            url: `https://weatherrush.netlify.app/weather/${encodeURIComponent(locationName)}`,
            images: [`/api/og-image?location=${locationName}`],
        },
    };
}

export default function WeatherPage() {
    return <Weather />;
}

