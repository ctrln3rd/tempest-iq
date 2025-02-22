import Weather from "@/component/Weather";
import { Metadata } from "next";

type PageProps = {
    params: {
        location: string;
    };
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const locationName = decodeURIComponent(params?.location || "Nairobi");
    

    return {
        title: `Weather in ${locationName}`,
        description: `Get the latest weather updates for ${locationName.toLocaleUpperCase()}, summerized, easy to read and interprate`,
        openGraph: {
            title: `Weather in ${locationName}`,
            description: `Get the latest weather updates for ${locationName.toLocaleUpperCase()}, summerized, easy to read and interprate`,
            url: `https://weatherrush.netlify.app/weather/${encodeURIComponent(locationName)}`,
            images: [`https://weatherrush.netlify.app/weather/${params.location}/opengraph-image`],
        },
    };
}

export default function WeatherPage() {
    return <Weather />;
}

