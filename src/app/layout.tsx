'use client';
import Header from "@/component/Header";
import  { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './ui/global.css';
import type { Metadata } from "next";

export const metadata: Metadata = {
   other: {
    "google-site-verification": "LUkKqWSPj-9G4-wQcv2ohaT20kb7pKJqAv9eM24m2H8"
   }
}

export default function RootLayouts({ children }: { children: React.ReactNode }){
  return(
    <html lang="en">
      <body>
        <Header/>
        {children}
        <ToastContainer 
        position="bottom-right"
        toastClassName={()=> `bg-white text-black flex flex-row items-center gap-1 max-w-[50vw] min-w-[20vw] w-auto 
          px-3 py-3 rounded-bl-4xl rounded-tl-lg max-sm:max-w-[65vw] max-sm:min-w-[40vw] mx-3 my-1 mb-10`} 
        hideProgressBar={true} closeButton={false}/>
      </body>
    </html>
  )
}