'use client';
import { useRouter, usePathname } from "next/navigation";
import { SmallIcon, MediumIcon } from "./Images";
import { useSelectedLocationStore } from "@/stores/useLocation";

export default function Header(){
    const pathname: any = usePathname();
    const router = useRouter();
    let title = 'weather rush'
    if(pathname.startsWith('/weather/')){
    title = decodeURIComponent(pathname.split('/weather/')[1])
    }else if(pathname === '/settings'){
      title = 'Settings'
    }
    return(
    <header className="flex flex-row justify-between relative px-10 max-sm:px-3 z-10">
        <h1>{title} {pathname === '/' && <MediumIcon src='/images/umbrella1.png' alt='i'/>}</h1>
        <div className='flex flex-row gap-10'>
        <button onClick={()=>router.push('/')} className="no-global-style bg-none bg-transparent p-0 !important"><SmallIcon src='/images/locations.png' alt='locations'/></button>
        <button onClick={()=>router.push('/settings')} className=" no-global-style bg-none p-0"><SmallIcon src='/images/settings.png' alt='settings'/></button>
        </div>
      </header>
    )
}