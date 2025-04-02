import Settings from "@/component/Settings";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: 'tempest IQ settings',
    description: 'tempestIQ provides you with quick detailed and easily interprateble forecast data for any location in the world',
    openGraph: {
       title:'tempest IQ settings',
       images: ['https://tempestiq.netlify.app/opengraph.jpg'],
       description: 'tempestIQ provides you with quick detailed and easily interprateble forecast data for any location in the world'
    }
 }

export default function SettingsPage (){
    return <Settings/>;
}