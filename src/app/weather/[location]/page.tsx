import Weather from "@/component/Weather";
import { Metadata } from "next";

interface PageProps {
    params: { location: string };
}

// Fix: Pass props instead of destructuring directly
export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { location } = props.params;
    const locationName = decodeURIComponent(location);

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
