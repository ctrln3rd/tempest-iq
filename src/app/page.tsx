import Home from "@/component/Home";
import type { Metadata } from "next";

export const metadata: Metadata = {
   title: 'Tempest IQ',
   description: 'tempestIQ provides you with ai sammerized quick detailed and easily interprateble forecast data for any location in the world',
   openGraph: {
      title:'Tempest IQ',
      images: ['https://tempestiq.netlify.app/opengraph.jpg'],
      description: 'tempestIQ provides you with ai sammerized quick detailed and easily interprateble forecast data for any location in the world'
   }
}


export default function Page(){
   return (
      <Home />
   )
  
}