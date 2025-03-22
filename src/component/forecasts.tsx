import { useEffect, useState } from "react";
import React from "react";
import { ForecastType } from "@/types/weatherTypes";
import { useDateConfigStore } from "@/stores/useDate";
import { useSettingsStore } from "@/stores/useSettings";
import { useWeatherConfigStore } from "@/stores/useWeather";
import { LargeIcon, MediumIcon, SmallIcon } from "./Images";

export default function FullForecast({forecastData}: {forecastData: ForecastType}){
    const {formatHour, formatDay} = useDateConfigStore()
    const {temperatureUnit} = useSettingsStore()
    const {getCodeIcon, getCodeCondition} = useWeatherConfigStore()
  const [forecast, setForecast] = useState<ForecastType | null>(null)
  useEffect(()=>{
    setForecast(forecastData)
  }, [])
  const scrollHourly = (direction: string)=>{
    const chartcontainer = document.getElementById('hourly-list');
    if(chartcontainer){
     const scrolldistance = window.innerWidth / 5
     const scrollamount = direction === 'right' ? scrolldistance: -scrolldistance;
     chartcontainer.scrollBy({left: scrollamount, behavior: 'smooth'})
    }
 }
return(
    <div className="flex flex-col items-center gap-10 w-full">
        <div className="flex flex-col gap-3 items-start w-full">
            <h3>hourly</h3>
            <div className="flex flex-row gap-4 w-full">
               <button onClick={()=>scrollHourly('left')} className="no-global-style text-4xl cursor-pointer">{'<'}</button>
               <div className="flex gap-1 w-full overflow-x-auto scrollbar-hidden hide-scrollbar" id="hourly-list">
                {forecast?.hours.map((hour, index)=>(
                    <div key={index} 
                    className="bg-white/3 backdrop-blur-md border border-white/30 rounded-md px-2 py-1 flex flex-col items-center gap-2">
                      <h5 className="text-nowrap">{formatHour(hour, forecast.currentDate)}</h5>
                       {/*<p>{getCodeCondition(forecast.weatherCode[index])}</p>*/}
                       <LargeIcon src={getCodeIcon(forecast.weatherCode[index], true)}
                        alt={getCodeCondition(forecast.weatherCode[index])} />
                       <p>{temperatureUnit(forecast.temperature[index])}</p>
                    </div>
                ))}
               </div>
               <button onClick={()=>scrollHourly('right')} className="no-global-style text-4xl cursor-pointer">{'>'}</button>
            </div>
        </div>
        <div className="flex flex-col items-start gap-3">
            <h3>daily</h3>
            <div className="flex flex-col gap-2 w-full">
                {forecast?.days.map((day, index)=>(
                    <div key={day} className="flex gap-10 bg-white/3 backdrop-blur-md border border-white/30 rounded-md px-2 py-1 max-sm:gap-3 ">
                    <h5>{formatDay(day, forecast.currentDate)}</h5>
                    <p>{temperatureUnit(forecast.maxTemperature[index])}/ {temperatureUnit(forecast.minTemperature[index])}</p>
                    <p className="flex flex-col items-center gap-0.5">
                        <div className="flex gap-1 items-center"><SmallIcon src="/images/drop.png" alt="prep"/>
                            {forecast.precipitationProbabilityMax[index]}% / {forecast.precipitationSum[index]}mm
                            </div>
                        <span className="opacity-80">{forecast.precipitationHours[index]} hours</span>
                    </p>
                    <p className="flex gap-1 items-center"><LargeIcon src={getCodeIcon(forecast.code[index], true)}
                        alt={getCodeCondition(forecast.code[index])} />
                        {getCodeCondition(forecast.code[index])}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
)
}