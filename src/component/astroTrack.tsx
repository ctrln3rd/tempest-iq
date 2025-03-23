'use client';
import { useState, useEffect } from "react";
import { ForecastType } from "@/types/weatherTypes";
import { useDateConfigStore } from "@/stores/useDate";
import { HelperIcon } from "./icons";

interface AstroData{
    first: string;
    last: string;
    pos: number;
}

export default function AstroTrack({forecast}: {forecast : ForecastType}){
    if(!forecast) return;

    const { calculateAstro } = useDateConfigStore();
    const [astrodata, setastrodata] = useState<AstroData>({ first: '0', last: '0' , pos: 0})
    const {sunrise, sunset, currentDate, isDay} = forecast;

    useEffect(()=>{
                const calculateastro = ()=>{
                const astroData = calculateAstro(sunrise[0], sunset[0], currentDate, 
                sunrise[1],Boolean(isDay));
                    setastrodata({first: astroData.first, last: astroData.last, pos: astroData.progress})
                }
                if(forecast){
                    calculateastro();
                }
            },[forecast])
    return(
        <div className="flex flex-col items-center w-full self-stretch gap-5">
               <div className="flex flex-row items-center gap-1 self-start">
                  <HelperIcon icon="astro"/>
                  <h4>astro track | <span className="opacity-70">{isDay ? 'day-time': 'night-time'}</span></h4>
                  </div>
                    <div className="flex flex-row gap-5  justify-center relative max-sm:gap-2 w-full">
                    <p id='sunrise'  className="flex flex-col items-center gap-1"><span className="opacity-70">{isDay ? 'sunrise': 'sunset'}</span>{astrodata.first}</p>
                    <div className="w-[70%] relative items-center justify-center max-sm:w-[60%]" >
                        <div className={`w-full h-1 ${isDay ? 'bg-white/30':'bg-indigo-950/50'}  rounded absolute top-[50%] left-[50%] tranform translate-[-50%] `}></div>
                        <div className={`absolute top-1/2 -translate-y-1/2 w-1 h-5
                         ${isDay ? 'bg-sky-600/50': 'bg-white/50'}`} style={{left: `${astrodata.pos}%`}}/>
                    </div>
                    <p id='sunset' className="flex flex-col items-center gap-1"><span className="opacity-70">{isDay ? 'sunset': 'sunrise'}</span> {astrodata.last}</p>
                    </div>
                </div>
    )
}