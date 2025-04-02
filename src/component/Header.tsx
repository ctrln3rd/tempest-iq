'use client';
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSettingsStore } from "@/stores/useSettings";
import { useLocalStorageStore } from "@/stores/useLocalStorage";
import { useHomeStore } from "@/stores/useHome";
import { toast } from "react-toastify";
import { HeaderIcon } from "./icons";

export default function Header() {
    //const searchParams = useSearchParams();
    const {settings, resetSettings} = useSettingsStore();
    const {clearLocations} = useLocalStorageStore();
    const {setEditMode, isEditMode} =  useHomeStore();
    const pathname = usePathname();
    const router = useRouter();
    const [locationName, setLocationName] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            setLocationName(urlParams.get("name"));
        }
        if(pathname !== '/'){
            if(isEditMode){
                setEditMode(false)
            }
        }
    }, [pathname]);

    let title = locationName ? decodeURIComponent(locationName) : "tempet IQ";
    if (pathname === "/settings") title = "Settings";
    
    
    useEffect(()=>{
        const existingVersion = settings.version || null
        if(!existingVersion || existingVersion !== 'v1'){
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
                text: "Check out the latest sky over my location",
                url: weatherUrl,
            })
            .then(()=> console.log('share was successful'))
            .catch((error)=> console.error('Error sharing:', error))
    }else{
        return;
    }
   }
    
    return (
        <header className='flex flex-row justify-between items-center relative px-[3%] pt-2 z-30'>
            <h1 className="flex items-center gap-2 max-sm:gap-1.5">{title}</h1>
            <div className='flex flex-row gap-10 max-sm:gap-8'>
                {pathname === '/weather' && <button  onClick={shareWeather}
                 className="no-global-style bg-none bg-transparent p-0 cursor-pointer !important"

                >
                   <HeaderIcon icon="share"/>
                </button>}
                {pathname !== '/' && 
                <Link href={'/'}
                className="no-global-style bg-none bg-transparent p-0 cursor-pointer !important">
                    <HeaderIcon icon="locations"/></Link>}
                
                {pathname === '/' && <button className="no-global-style bg-none bg-transparent p-0 cursor-pointer !important"
                onClick={()=>setEditMode(true)}>
                <HeaderIcon icon="editlocations"/>
                </button>}
                <Link href={'/settings'}
                className="no-global-style bg-none p-0 cursor-pointer">
                    <HeaderIcon icon="settings"/></Link>
            </div>
        </header>
    );
}

