import { useEffect, useState } from "react";
import React from "react";
import { ForecastType } from "@/types/weatherTypes";
import { useDateConfigStore } from "@/stores/useDate";
import { useSettingsStore } from "@/stores/useSettings";
import { useWeatherConfigStore } from "@/stores/useWeather";
import { ConditionIcon, HelperIcon } from "./icons";

export default function FullForecast({forecastData}: {forecastData: ForecastType}){
    const {formatHour, formatDay, isDayHour} = useDateConfigStore()
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
            <h3 className="flex items-center gap-1"><HelperIcon icon="hour"/>hourly</h3>
            <div className="flex flex-row gap-4 w-full max-sm:gap-2">
               <button onClick={()=>scrollHourly('left')} className="no-global-style text-4xl cursor-pointer max-sm:text-xl">{'<'}</button>
               <div className="flex gap-1 w-full overflow-x-auto scrollbar-hidden hide-scrollbar" id="hourly-list">
                {forecast?.hours.map((hour, index)=>(
                    <div key={index} 
                    className="flex-1 bg-white/3 backdrop-blur-md border border-white/30 rounded-md px-2 py-1 flex flex-col items-center justify-center gap-2">
                      <h5 className="text-nowrap opacity-80">{formatHour(hour, forecast.currentDate)}</h5>
                       {/*<p>{getCodeCondition(forecast.weatherCode[index])}</p>*/}
                       <ConditionIcon condition={getCodeIcon(forecast.weatherCode[index])} isDay={isDayHour(hour, forecast.sunrise[0], forecast.sunset[0])}/>
                       <p>{temperatureUnit(forecast.temperature[index])}</p>
                       {forecast.precipitationProbability[index] > 30 && <p className="flex gap-1.5 items-center opacity-70">
                        <HelperIcon icon="droplet"/> <span>{forecast.precipitationProbability[index]}%</span>
                        </p>}
                    </div>
                ))}
               </div>
               <button onClick={()=>scrollHourly('right')} className="no-global-style text-4xl cursor-pointer max-sm:text-xl">{'>'}</button>
            </div>
        </div>
        <div className="flex flex-col items-start gap-3 w-full">
            <h3 className="flex items-center gap-1"><HelperIcon icon="day"/>daily</h3>
            <div className="flex flex-col gap-2 w-full">
                {forecast?.days.map((day, index)=>(
                    <div key={day} className="flex gap-10 items-center justify-between bg-white/3 backdrop-blur-md border border-white/30 rounded-md px-2 py-1 max-md:gap-7 max-sm:gap-3 ">
                    <h5 className="opacity-80">{formatDay(day, forecast.currentDate)}</h5>
                    <p>{temperatureUnit(forecast.maxTemperature[index])}/ {temperatureUnit(forecast.minTemperature[index])}</p>
                    {forecast.precipitationProbabilityMax[index] > 10 && <p className="flex flex-col items-center gap-0.5">
                        <div className="flex gap-1 items-center"><HelperIcon icon="droplet"/>
                            {forecast.precipitationProbabilityMax[index]}% / {forecast.precipitationSum[index]}mm
                        </div>
                        {forecast.precipitationHours[index] > 3 && <span className="opacity-80">{forecast.precipitationHours[index]} hours</span>}
                    </p>}
                    <p className="flex gap-1 items-center max-sm:flex-col">
                        <ConditionIcon condition={getCodeIcon(forecast.code[index])} isDay={false}/>
                        {getCodeCondition(forecast.code[index])}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
)
}