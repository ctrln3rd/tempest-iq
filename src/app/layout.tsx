'use client';
import { useEffect } from "react";
import Header from "@/component/Header";
import  { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './ui/global.css';
import { Inter } from "next/font/google";
import PWAInstallPrompt from "@/component/installPrompt";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
import { useSettingsStore } from "@/stores/useSettings";

export default function RootLayouts({ children }: { children: React.ReactNode }){
  const {settings} = useSettingsStore();
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((err) => console.log("Service Worker Registration Failed:", err));
    }
  }, []);
  return(
    <html lang="en" className={`${inter.variable}`}>
      <head>
      <meta name="google-site-verification" content="LUkKqWSPj-9G4-wQcv2ohaT20kb7pKJqAv9eM24m2H8" />
      </head>
      <body className={`${settings.fontsize === 'detailed' ? 'text-lg max-sm:text-base' : 'text-base max-sm:text-sm'}`}>
        <Header/>
        {children}
        <ToastContainer 
        position="bottom-right"
        toastClassName={()=> `bg-white/15 text-white backdrop-blur-md border border-white/30 text-black flex flex-row items-center justify-center gap-1 max-w-[50vw] min-w-[15vw] w-auto 
          px-3 py-3 rounded max-sm:max-w-[65vw] max-sm:min-w-[40vw] mx-3 my-1 mb-10`} 
        hideProgressBar={true} closeButton={false}/>
        <PWAInstallPrompt/>
      </body>
    </html>
  )
}