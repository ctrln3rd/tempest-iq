'use client';
import { useEffect, useState } from "react";
import { useDateConfigStore } from "@/stores/useDate";
import { ForecastType } from "@/types/weatherTypes";
import { HelperIcon } from "./icons";

function generateCautionInsight(forecast: Pick<ForecastType, "uvIndexMax" | "precipitationSum" | "maxTemperature" | "minTemperature" | "days" | 'currentDate'>,
    formatDay: (day: string, current: string) => string,
) {
    const { uvIndexMax, precipitationSum, maxTemperature, minTemperature, days,currentDate } = forecast
    if (!days.length) return <span>No caution alerts.</span>;
  
    const UV_THRESHOLD = 7;
    const RAIN_THRESHOLD = 10;
    const HOT_TEMP_THRESHOLD = 35;
    const COLD_TEMP_THRESHOLD = 5;
  
    const highUvDays = days.filter((_, i) => uvIndexMax[i] >= UV_THRESHOLD);
    const highRainDays = days.filter((_, i) => precipitationSum[i] >= RAIN_THRESHOLD);
    const hotDays = days.filter((_, i) => maxTemperature[i] >= HOT_TEMP_THRESHOLD);
    const coldDays = days.filter((_, i) => minTemperature[i] <= COLD_TEMP_THRESHOLD);
  
    const uvPart = highUvDays.length ? (
      <>
        <span>high UV radiation</span> expected{highUvDays.length < 3 ? <span> ,{highUvDays.map((i)=>formatDay(i, currentDate)).join(", ")}</span> : ' this week'}
      </>
    ) : null;
  
    const rainPart = highRainDays.length ? (
      <>
        {uvPart ? " and " : ""}
        <span>heavy rainfall</span> expected{highRainDays.length < 5 ?<span> ,{highRainDays.map((i)=>formatDay(i, currentDate)).join(", ")}</span> : ' almost everyday this week'}
      </>
    ) : null;
  
    const hotPart = hotDays.length ? (
      <>
        {(uvPart || rainPart) ? " and " : ""}
        <span>very hot temperatures</span> expected{hotDays.length < 3  ? <span> ,{hotDays.map((i)=>formatDay(i, currentDate)).join(", ")}</span> : ' this week'}
      </>
    ) : null;
  
    const coldPart = coldDays.length ? (
      <>
        {(uvPart || rainPart || hotPart) ? " and " : ""}
        <span>cold conditions</span> expected{coldDays.length < 3 ? <span> ,{coldDays.map((i)=>formatDay(i, currentDate)).join(", ")}</span> : ' this week'}
      </>
    ) : null;
  
    return (
      <div className="caution-insight">
        {uvPart}
        {rainPart}
        {hotPart}
        {coldPart}
        {!uvPart && !rainPart && !hotPart && !coldPart && "No extreme weather expected."}
      </div>
    );
  }

  function generateCautionTitle({ precipitationSum, precipitationProbabilityMax, maxTemperature, uvIndexMax, days,}: 
    Pick<ForecastType,"precipitationSum" | "precipitationProbabilityMax" | "maxTemperature" | "uvIndexMax" | "days">,
  ){
    if (!days.length) return 'Caution';
  
    // **Thresholds**
    const FLOOD_RISK = 50; // mm of rain
    const HIGH_PRECIP_PROB = 80; // % chance of rain
    const HIGH_UV = 7;
    const HEAT_WAVE = 35;
    const COLD_WAVE = 5;
  
    // **Priority-Based Title Selection**
    let title = "Good Week"; // Default title
    if (precipitationSum[0] > FLOOD_RISK) {
      title = "Floods";
    } else if (maxTemperature[0] > HEAT_WAVE) {
      title = "Too Hot";
    } else if (precipitationProbabilityMax[0] > HIGH_PRECIP_PROB) {
      title = "Heavy Rain";
    } else if (uvIndexMax[0] > HIGH_UV) {
      title = "High UV";
    } else if (maxTemperature[0] < COLD_WAVE) {
      title = "Freezing";
    }
  
    return title;
  }
  

  function generateActivityInsight(forecast: Pick<ForecastType, "precipitationHours" | "maxTemperature" | "uvIndexMax" | "days" | 'currentDate'>,
    formatDay: (day: string, current: string) => string,
  ) {
    const { precipitationHours, maxTemperature, uvIndexMax, days, currentDate} = forecast
    if (!days.length) return <span>No activity suggestions.</span>;
  
    const INDOOR_THRESHOLD_HOURS = 10; // More than 5 hours of rain → indoors
    const HEAT_THRESHOLD = 35; // Over 38°C → avoid outdoor
    const UV_DANGER_THRESHOLD = 9; // UV index over 9 → avoid sun
    const COOL_WEATHER = 20; // Ideal for outdoor activities
    const VACATION_DAYS = 2; // Next 2 days for vacation
  
    let activityMessage: JSX.Element | null = null;
  
    // **Determine the best activity insight**
    if (precipitationHours[0] > INDOOR_THRESHOLD_HOURS) {
      activityMessage = (
        <>
          <span>Best to stay indoors today</span>, try <span>reading, gaming, or movies</span>.
        </>
      );
    } else if (maxTemperature[0] > HEAT_THRESHOLD) {
      activityMessage = (
        <>
          <span>Too hot for outdoor activities</span>, consider <span>swimming or staying in shade</span>.
        </>
      );
    } else if (uvIndexMax[0] > UV_DANGER_THRESHOLD) {
      activityMessage = (
        <>
          <span>High UV exposure today</span>, wear <span>sunscreen</span> or avoid prolonged sun.
        </>
      );
    } else {
      activityMessage = (
        <>
          <span>Great weather for outdoor activities</span>, perfect for <span>jogging or hiking</span>.
        </>
      );
    }
  
    // **Look ahead for vacation-friendly days**
    const goodDays = days.filter((_, i) => maxTemperature[i] <= COOL_WEATHER);
    const vacationDays = days.slice(1, VACATION_DAYS + 1);
  
    if (vacationDays.length) {
      activityMessage = (
        <>
          {activityMessage} Also, <span>great days for a vacation, </span>{vacationDays.length <5 ? <>{vacationDays.map((i)=>formatDay(i, currentDate)).join(", ")}</> : 'this week'}.
        </>
      );
    } else if (goodDays.length) {
      activityMessage = (
        <>
          {activityMessage} Plus, <span>outdoor-friendly days, </span>{goodDays.length < 5 ? <>{goodDays.map((i)=>formatDay(i, currentDate)).join(", ")}</> : 'this week'}
        </>
      );
    }
  
    return <p className="activity-insight">{activityMessage}</p>;
  }


  function generateActivityTitle({
    precipitationHours,
    maxTemperature,
    uvIndexMax,
    days,
  }: Pick<ForecastType, "precipitationHours" | "maxTemperature" | "uvIndexMax" | "days">) {
    if (!days.length) return 'activity recommendations';
  
    // **Thresholds**
    const INDOOR_RAIN_HOURS = 10; // More than 5 hours of rain = stay indoors
    const EXTREME_HEAT = 35; // Too hot for outdoor activities
    const HIGH_UV = 9; // Dangerous UV levels
    const PERFECT_TEMP = [20, 30]; // Ideal for vacations
    const CHILLY_TEMP = 10; // Cold but not freezing
  
    // **Priority-Based Title Selection**
    let title = "Suitable Activity"; // Default title
    if (precipitationHours[0] > INDOOR_RAIN_HOURS) {
      title = "Movies time"; // Too rainy = indoor fun
    } else if (maxTemperature[0] > EXTREME_HEAT) {
      title = "swimmimg"; // Heatwave = avoid sun
    } else if (uvIndexMax[0] > HIGH_UV) {
      title = "Sun screen"; // UV warning
    } else if (maxTemperature[0] >= PERFECT_TEMP[0] && maxTemperature[0] <= PERFECT_TEMP[1]) {
      title = "Vacation Week"; // Perfect temperatures
    } else if (maxTemperature[0] < CHILLY_TEMP) {
      title = "Cozy Indoors"; // Too chilly for outside
    }
  
    return title;
  }
  
  
  

export function CautionAndActivities({ weatherForecast}:{weatherForecast: ForecastType}) {
    const { formatDay } = useDateConfigStore();
    const [cautionTitle, setCautionTitle] = useState<string>('Caution')
    const [cautionInsight, setCautionInsight] = useState<JSX.Element | null>(null);
    const [activityTitle, setActivityTitle] = useState<string>('Activity recommendations')
    const [activityInsight, setActivityInsight] = useState<JSX.Element | null>(null);

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
   