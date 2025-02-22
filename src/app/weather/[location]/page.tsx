import Weather from "@/component/Weather";
import { Metadata } from "next";

export async function generateMetadata({params}:{params : {location: string}}): Promise<Metadata> {
    const locationName = decodeURIComponent(params?.location || "Nairobi");
    

    return {
        title: `Weather in ${locationName}`,
        description: `Get the latest weather updates for ${String(locationName)?.toLocaleUpperCase()}, summerized, easy to read and interprate`,
        openGraph: {
            title: `Weather in ${locationName}`,
            description: `Get the latest weather updates for ${String(locationName).toLocaleUpperCase()}, summerized, easy to read and interprate`,
            url: `https://weatherrush.netlify.app/weather/${encodeURIComponent(String(locationName))}`,
            images: [`/weather/${params.location}/open-graph-image`],
        },
    };
}

export default function WeatherPage() {
    return <Weather />;
}

