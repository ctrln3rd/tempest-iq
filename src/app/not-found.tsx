import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'not found in weather rush',
    description: 'page does not exist but weather rush provides you with quick detailed and easily interprateble weather data for any location in the world',
    openGraph: {
       title:'not found in weather rush',
       images: ['opengraph.jpg'],
       description: 'page does not exist but weather rush provides you with quick detailed and easily interprateble weather data for any location in the world'
    }
 }

export default function NotFound(){
    return(
        <div className="flex flex-col items-start gap-5 absolute left-[50%] top-[50%] transform translate-[-50%]">
            <h2>welcome to weather rush</h2>
            <p>we couldn't find the page but click on the buttton below to get you favorite weather data.</p>
            <button><Link href='/'>get data</Link></button>
        </div>
    )
}