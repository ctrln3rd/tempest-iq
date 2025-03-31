import { ForecastType } from "@/types/weatherTypes";
import React from "react";

function generateCautionInsight(forecast: Pick<ForecastType, "uvIndexMax" | "precipitationSum" | "maxTemperature" | "minTemperature" | "days" | 'currentDate'>,
    formatDay: (day: string, current: string) => string,
):[string, React.ReactNode]{
    const { uvIndexMax, precipitationSum, maxTemperature, minTemperature, days,currentDate } = forecast
  
    const UV_THRESHOLD = 7;
    const RAIN_THRESHOLD = 25;
    const HOT_TEMP_THRESHOLD = 35;
    const COLD_TEMP_THRESHOLD = 5;

    let cautionTitle = "Any Caution"; 
  
    const highUvDays = days.filter((_, i) => uvIndexMax[i] >= UV_THRESHOLD);
    const highRainDays = days.filter((_, i) => precipitationSum[i] >= RAIN_THRESHOLD);
    const hotDays = days.filter((_, i) => maxTemperature[i] >= HOT_TEMP_THRESHOLD);
    const coldDays = days.filter((_, i) => minTemperature[i] <= COLD_TEMP_THRESHOLD);
  
    
    const rainPart = highRainDays.length ? (
      <>
        <span>heavy rainfall</span> expected {highRainDays.length < 5 ?<span> {highRainDays.map((i)=>formatDay(i, currentDate)).join(", ")}</span> : ' almost everyday this week'}
      </>
    )  : null;
  
    const hotPart = hotDays.length ? (
      <>
        {(rainPart) ? " and " : ""}
        <span>very hot temperatures</span> expected {hotDays.length < 3  ? <span>{hotDays.map((i)=>formatDay(i, currentDate)).join(", ")}</span> : ' this week'}
      </>
    ) : null;
  
    const coldPart = coldDays.length ? (
      <>
        {(rainPart || hotPart) ? " and " : ""}
        <span>cold conditions</span> expected {coldDays.length < 3 ? <span>{coldDays.map((i)=>formatDay(i, currentDate)).join(", ")}</span> : ' this week'}
      </>
    ) : null;
    const uvPart = highUvDays.length ? (
      <>
        {(rainPart || hotPart || coldPart) ? " and " : ""}
        <span>high UV radiation</span> expected {highUvDays.length < 3 ? <span> ,{highUvDays.map((i)=>formatDay(i, currentDate)).join(", ")}</span> : ' this week'}
      </>
    ) : null;

    if(rainPart){
      cautionTitle = "Heavy Rainfall"
    }else if (hotPart){
      cautionTitle = "Too Hot"
    }else if(coldPart){
      cautionTitle = "Too Cold"
    }else if(uvPart){
      cautionTitle = "High radiation"
    }
  
  
    return [cautionTitle, 
      <p className="caution-insight">
        {rainPart}
        {hotPart}
        {coldPart}
        {uvPart}
        {!uvPart && !rainPart && !hotPart && !coldPart && "No extreme weather expected."}
      </p>
    ];
  }

  
  
export {generateCautionInsight}