'use client';
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSettingsStore } from "@/stores/useSettings";
import { useLocalStorageStore } from "@/stores/useLocalStorage";
import { useHomeStore } from "@/stores/useHome";
import { toast } from "react-toastify";
import { HeaderIcon, OtherIcon } from "./icons";

export default function Header() {
    //const searchParams = useSearchParams();
    const {settings, resetSettings} = useSettingsStore();
    const {clearLocations} = useLocalStorageStore();
    const {setCurrentRefresh, setEditMode, isCurrentRefresh, isEditMode} =  useHomeStore();
    const pathname = usePathname();
    const router = useRouter();
    const [locationName, setLocationName] = useState<string | null>(null);

    // ✅ Use useEffect to access search params safely
    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            setLocationName(urlParams.get("name"));
        }
        if(pathname !== '/'){
            if(isCurrentRefresh){
                setCurrentRefresh(false)
            }else if(isEditMode){
                setEditMode(false)
            }
        }
    }, [pathname]);

    let title = locationName ? decodeURIComponent(locationName) : "weather-rush";
    if (pathname === "/settings") title = "Settings";
    
    
    useEffect(()=>{
        const existingVersion = settings.version || null
        if(!existingVersion || existingVersion !== 'v2'){
            resetSettings()
            clearLocations()
            toast('new different version: ', {autoClose: 3000})
            toast('locations cleared', {autoClose: 5000})
            router.push('/')
        }
        if(!navigator.onLine){
            toast("your're offline. Using saved data", {
                autoClose: 5000
            })
        }
   }, [])

   const shareWeather = ()=>{
    if( typeof window !== 'undefined'){
        const weatherUrl= window.location.href;
            navigator.share({
                title: 'Weather update Alert',
                text: "Check out the latest weather update for my location",
                url: weatherUrl,
            })
            .then(()=> console.log('share was successful'))
            .catch((error)=> console.error('Error sharing:', error))
    }else{
        return;
    }
   }
    
    return (
        <header className='flex flex-row justify-between relative px-10 pt-2 mx-4 max-sm:mx-2 max-sm:px-2 z-30'>
            <h1 className="flex items-center gap-2 max-sm:gap-1.5">{title} {pathname === "/" && <OtherIcon icon="weather"/>}</h1>
            <div className='flex flex-row gap-10 max-sm:gap-8'>
                {pathname === '/weather' && <button  onClick={shareWeather}
                 className="no-global-style bg-none bg-transparent p-0 cursor-pointer !important"

                >
                   <HeaderIcon icon="share"/>
                </button>}
                {pathname !== '/' && 
                <button onClick={() => router.push('/')} 
                className="no-global-style bg-none bg-transparent p-0 cursor-pointer !important">
                    <HeaderIcon icon="locations"/></button>}
                
                {pathname === '/' && <button className="no-global-style bg-none bg-transparent p-0 cursor-pointer !important"
                onClick={()=>setEditMode(true)}>
                <HeaderIcon icon="editlocations"/>
                </button>}
                {pathname === '/' && <button  onClick={()=>setCurrentRefresh(true)}
                 className="no-global-style bg-none bg-transparent p-0 cursor-pointer !important"

                >
                   <HeaderIcon icon="updatelocation"/>
                </button>}
                <button onClick={() => router.push('/settings')} 
                className="no-global-style bg-none p-0 cursor-pointer">
                    <HeaderIcon icon="settings"/></button>
            </div>
        </header>
    );
}

