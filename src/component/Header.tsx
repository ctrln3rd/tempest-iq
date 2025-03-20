'use client';
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { HeaderIcon, MediumIcon } from "./Images";
import { useSettingsStore } from "@/stores/useSettings";
import { useLocalStorageStore } from "@/stores/useLocalStorage";
import { useHomeStore } from "@/stores/isHome";
import { toast } from "react-toastify";

function HeaderComponent() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    let title = "Weather Rush";
    const locationName = searchParams.get("name");
    
    if (locationName) {
        title = decodeURIComponent(locationName);
    } else if (pathname === "/settings") {
        title = "Settings";
    }
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
        <header className={`flex flex-row justify-between relative px-10 pb-1 mx-4 max-sm:mx-2 max-sm:px-2 z-30 
        ${pathname === '/' && 'border-b-1 border-b-white/70'}`}>
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

export default function Header(){
    <Suspense>
        <HeaderComponent/>
    </Suspense>
}