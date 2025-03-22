'use client';
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HeaderIcon, MediumIcon } from "./Images";
import { useSettingsStore } from "@/stores/useSettings";
import { useLocalStorageStore } from "@/stores/useLocalStorage";
import { useHomeStore } from "@/stores/isHome";
import { toast } from "react-toastify";

export default function Header() {
    //const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [locationName, setLocationName] = useState<string | null>(null);

    // ✅ Use useEffect to access search params safely
    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            setLocationName(urlParams.get("name"));
        }
    }, [pathname]);

    let title = locationName ? decodeURIComponent(locationName) : "Weather Rush";
    if (pathname === "/settings") title = "Settings";
    
    const {settings, resetSettings} = useSettingsStore();
    const {clearLocations} = useLocalStorageStore();
    const {setCurrentRefresh, setEditMode} =  useHomeStore();
    useEffect(()=>{
        const existingVersion = settings.version || null
        if(!existingVersion || existingVersion !== 'v1'){
            resetSettings()
            clearLocations()
            toast('new different version: ', {autoClose: 3000})
            toast('locations cleared', {autoClose: 5000})
            router.push('/')
        }
   }, [])
    
    return (
        <header className='flex flex-row justify-between relative px-10 pb-1 mx-4 max-sm:mx-2 max-sm:px-2 z-30'>
            <h1>{title} {pathname === "/" && <MediumIcon src='/images/umbrella1.png' alt='i'/>}</h1>
            <div className='flex flex-row gap-10 max-sm:gap-8'>
                {pathname !== '/' && 
                <button onClick={() => router.push('/')} 
                className="no-global-style bg-none bg-transparent p-0 cursor-pointer !important">
                    <HeaderIcon src='/images/locations.png' alt='locations'/></button>}
                
                {pathname === '/' && <button className="no-global-style bg-none bg-transparent p-0 cursor-pointer !important"
                onClick={()=>setEditMode(true)}>
                <HeaderIcon src='/images/edit.png' alt='locations'/>
                </button>}
                {pathname === '/' && <button  onClick={()=>setCurrentRefresh(true)}
                 className="no-global-style bg-none bg-transparent p-0 cursor-pointer !important"

                >
                   <HeaderIcon src='/images/refresh.png' alt='locations'/>
                </button>}
                <button onClick={() => router.push('/settings')} 
                className="no-global-style bg-none p-0 cursor-pointer">
                    <HeaderIcon src='/images/settings.png' alt='settings'/></button>
            </div>
        </header>
    );
}

