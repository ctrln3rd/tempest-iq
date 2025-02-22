import Settings from "@/component/Settings";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: 'weather rush settings',
    description: 'weather rush provides you with quick detailed and easily interprateble weather data for any location in the world',
    openGraph: {
       title:'weather rush settings',
       images: ['https://weatherrush.netlify.app/opengraph-settings.jpg'],
       description: 'weather rush provides you with quick detailed and easily interprateble weather data for any location in the world'
    }
 }

export default function SettingsPage (){
    return <Settings/>;
}