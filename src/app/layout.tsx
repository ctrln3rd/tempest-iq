'use client';
import Header from "@/component/Header";
import  { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './ui/global.css';

export default function RootLayouts({ children }: { children: React.ReactNode }){
  return(
    <html lang="en">
      <head>
      <meta name="google-site-verification" content="LUkKqWSPj-9G4-wQcv2ohaT20kb7pKJqAv9eM24m2H8" />
      </head>
      <body>
        <Header/>
        {children}
        <ToastContainer 
        position="bottom-right"
        toastClassName={()=> `bg-white text-black flex flex-row items-center gap-1 max-w-[50vw] min-w-[20vw] w-auto 
          px-3 py-3 rounded-3xl max-sm:max-w-[65vw] max-sm:min-w-[40vw] mx-3 my-1 mb-10`} 
        hideProgressBar={true} closeButton={false}/>
      </body>
    </html>
  )
}