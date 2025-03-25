'use client';
import { useEffect, useState, ReactNode } from "react";
import { useDateConfigStore } from "@/stores/useDate";
import { ForecastType } from "@/types/weatherTypes";
import { useSettingsStore } from "@/stores/useSettings";
import { HelperIcon } from "./icons";
import { generatePrecipitationTitle, generatePrecipitationInsight } from "@/utils/precipitationInsight";
import { generateTemperatureTitle, generateTemperatureInsight } from "@/utils/temperatureInsight";
import { generateCautionTitle, generateCautionInsight } from "@/utils/cautionInsight";
import { generateActivityTitle, generateActivityInsight } from "@/utils/activityInsight";



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
      setPrecipitationTitle(generatePrecipitationTitle(weatherForecast))
      setPrecipitationInsight(generatePrecipitationInsight(weatherForecast, formatHour, formatDay, dayTime))
      setTemperatureTitle(generateTemperatureTitle(weatherForecast))
      setTemperatureInsight(generateTemperatureInsight(weatherForecast, formatHour, formatDay, temperatureUnit, dayTime))
    }
    
  }, [weatherForecast]);

  return (
    <>
      <div className="flex flex-col items-start gap-1 precipitation-insight">
        <div className="flex gap-1 items-center opacity-70">
          <HelperIcon icon="precipitation"/>
          <h4>{precipitationTitle}</h4>
        </div>
         {precipitationInsight && <>{precipitationInsight}</>}
      </div>
      <div className="flex flex-col items-start gap-1 temperature-insight">
        <div className="flex gap-1 items-center opacity-70">
          <HelperIcon icon="temperature"/>
          <h4>{temperatureTitle}</h4>
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
          setCautionTitle(generateCautionTitle(weatherForecast))
          setActivityTitle(generateActivityTitle(weatherForecast))
          setCautionInsight(generateCautionInsight(weatherForecast, formatDay))
          setActivityInsight(generateActivityInsight(weatherForecast, formatDay))
      }

  }, [weatherForecast])
 
   return (
     <>
       {cautionInsight && (
         <div className="flex flex-col gap-1 items-start caution-insight">
       <div className="flex items-center gap-1 opacity-70">
         <HelperIcon icon="warning2"/>
         <h3>{cautionTitle}</h3>
       </div>
           {cautionInsight}
         </div>
       )}
       {activityTitle && (<div className="flex flex-col gap-1 items-start actvity-insight">
       <div className="flex items-center gap-1 opacity-70">
         <HelperIcon icon="activity"/>
         <h3>{activityTitle}</h3>
       </div>
        {activityInsight}
     </div>)}
     </>
   );
 }
 
