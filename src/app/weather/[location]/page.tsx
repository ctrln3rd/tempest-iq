import Weather from "@/component/Weather";
import { Metadata } from "next";

interface PageProps {
    params: { location: string };
}

// Fix: Ensure correct type matching
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const locationName = decodeURIComponent(params.location);

    return {
        title: `Weather in ${locationName || "Nairobi"}`,
        description: `Get the latest weather updates for ${locationName || "Nairobi"}`,
        openGraph: {
            title: `Weather in ${locationName || "Nairobi"}`,
            description: `Get the latest weather updates for ${locationName || "Nairobi"}`,
            url: `https://weatherrush.netlify.app/weather/${encodeURIComponent(locationName)}`,
            images: [`/api/og-image?location=${locationName}`],
        },
    };
}

export default function WeatherPage() {
    return <Weather />;
}
