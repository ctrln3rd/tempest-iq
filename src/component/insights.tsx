'use client';
import { useEffect, useState, ReactNode } from "react";
import { useDateConfigStore } from "@/stores/useDate";
import { ForecastType } from "@/types/weatherTypes";
import { useSettingsStore } from "@/stores/useSettings";
import { HelperIcon } from "./icons";
import { generatePrecipitationInsight } from "@/utils/precipitationInsight";
import { generateTemperatureInsight } from "@/utils/temperatureInsight";
import { generateCautionInsight } from "@/utils/cautionInsight";
import { generateActivityInsight } from "@/utils/activityInsight";



export function WeatherInsight({ weatherForecast }: { weatherForecast: ForecastType }) {
  if (!weatherForecast) return null;
  const { formatHour, formatDay, dayTime } = useDateConfigStore();
  const { temperatureUnit } = useSettingsStore();
 
  const [precipitationTitle, setPrecipitationTitle] = useState<string>('Dry days ahead')
  const [temperatureTitle, setTemperatureTitle] = useState<string>('Temperature')
  const [precipitationInsight, setPrecipitationInsight] = useState<ReactNode | null>(null);
  const [temperatureInsight, setTemperatureInsight] = useState<ReactNode | null>(null);
  useEffect(() => {
    if(weatherForecast){
      const [newPrecipitationTitle, newPrecipitation] = generatePrecipitationInsight(weatherForecast, formatHour, formatDay, dayTime)
      const [newTemperatureTitle, newTemperature] = generateTemperatureInsight(weatherForecast, formatHour, formatDay, temperatureUnit, dayTime)
      setPrecipitationTitle(newPrecipitationTitle)
      setPrecipitationInsight(newPrecipitation)
      setTemperatureTitle(newTemperatureTitle)
      setTemperatureInsight(newTemperature)
    }
    
  }, [weatherForecast]);

  return (
    <>
      <div className="flex flex-col items-start gap-2.5 precipitation-insight w-full">
        <div className="flex gap-2.5 items-center justify-center w-full bg-white/3 backdrop-blur-md border border-white/15 rounded-md px-2 py-2.5">
          <HelperIcon icon="precipitation"/>
          <h3 className="opacity-80">{precipitationTitle}</h3>
        </div>
         {precipitationInsight && <>{precipitationInsight}</>}
      </div>
      <div className="flex flex-col items-start gap-2.5 temperature-insight w-full">
        <div className="flex gap-2.5 items-center justify-center w-full bg-white/3 backdrop-blur-md border border-white/15 rounded-md px-2 py-2.5">
          <HelperIcon icon="temperature"/>
          <h3 className="opacity-80">{temperatureTitle}</h3>
        </div>
        {temperatureInsight && <>{temperatureInsight}</>}
      </div>
    </>
  );
}

export function CautionAndActivities({ weatherForecast}:{weatherForecast: ForecastType}) {
  const { formatDay } = useDateConfigStore();
  const [cautionTitle, setCautionTitle] = useState<string>('Caution')
  const [cautionInsight, setCautionInsight] = useState<ReactNode | null>(null);
  const [activityTitle, setActivityTitle] = useState<string>('Activity recommendations')
  const [activityInsight, setActivityInsight] = useState<ReactNode | null>(null);

  useEffect(()=>{
      if(weatherForecast){
          const [newcautionTitle, newcaution] = generateCautionInsight(weatherForecast, formatDay)
          const [newactivityTitle, newactivity] = generateActivityInsight(weatherForecast, formatDay)
          setCautionTitle(newcautionTitle)
          setActivityTitle(newactivityTitle)
          setCautionInsight(newcaution)
          setActivityInsight(newactivity)
      }

  }, [weatherForecast])
 
   return (
     <>
       {cautionInsight && (
         <div className="flex flex-col gap-2.5 items-start caution-insight w-full">
       <div className="flex items-center gap-2.5 w-full justify-center bg-white/3 backdrop-blur-md border border-white/15 rounded-md px-2 py-2.5">
         <HelperIcon icon="warning2"/>
         <h3 className="opacity-80">{cautionTitle}</h3>
       </div>
           {cautionInsight}
         </div>
       )}
       {activityTitle && (<div className="flex flex-col gap-2.5 items-start actvity-insight w-full">
       <div className="flex items-center gap-2.5  w-full justify-center bg-white/3 backdrop-blur-md border border-white/15 rounded-md px-2 py-2.5">
         <HelperIcon icon="activity"/>
         <h3 className="opacity-80">{activityTitle}</h3>
       </div>
        {activityInsight}
     </div>)}
     </>
   );
 }
 
