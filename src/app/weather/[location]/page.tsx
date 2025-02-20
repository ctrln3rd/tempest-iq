import Weather from "@/component/Weather";
import { Metadata } from "next";

interface PageParams {
    params: {location: string};
}


export async function generateMetadata({ params }: PageParams): Promise<Metadata>{
    const locationName = decodeURIComponent(params.location)
   return{
    title: `weather in ${location || 'Nairobi'}`,
    description: `get the latest weather updates for ${location || 'Nairobi'}`,
    openGraph: {
        title: `weather in ${location || 'Nairobi'}`,
        description: `get the latest weather updates for ${location || 'Nairobi'}`,
        url: `https://weatherrush.netlify.app/weather/${encodeURIComponent(locationName)}`,
        images: [`/api/og-image?location=${locationName}`]
    }
   }
}


export default function WeatherPage(){
    return (
    <Weather/>
    );
}