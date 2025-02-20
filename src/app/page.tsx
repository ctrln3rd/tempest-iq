'use client';
import Home from "@/component/Home";
import type { Metadata } from "next";

export const metadata: Metadata = {
   title: 'weather rush',
   description: 'weather rush provides you with quick detailed and easily interprateble weather data for any location in the world',
   openGraph: {
      title:'weather rush',
      images: ['/images/opengraph.jpg'],
      description: 'weather rush provides you with quick detailed and easily interprateble weather data for any location in the world'
   }
}


export default function Page(){
   return (
      <Home />
   )
  
}