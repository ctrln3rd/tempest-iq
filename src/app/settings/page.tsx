import Settings from "@/component/Settings";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: 'tempet iq settings',
    description: 'tempet iq provides you with quick detailed and easily interprateble forecast data for any location in the world',
    openGraph: {
       title:'tempet iq settings',
       images: ['https://tempetiq.netlify.app/opengraph.jpg'],
       description: 'tempet iq provides you with quick detailed and easily interprateble forecast data for any location in the world'
    }
 }

export default function SettingsPage (){
    return <Settings/>;
}