import { ForecastType } from "@/types/weatherTypes";
import React from "react";
function generateActivityInsight(forecast: Pick<ForecastType, "precipitationHours" |'precipitationProbabilityMax' | "maxTemperature" |'minTemperature' | "uvIndexMax" | "days" | 'currentDate'>,
    formatDay: (day: string, current: string) => string,
  ): [string, React.ReactNode] {
    const { precipitationHours, precipitationProbabilityMax, minTemperature, maxTemperature, uvIndexMax, days, currentDate} = forecast
    const INDOOR_THRESHOLD_HOURS = 12; // More than 5 hours of rain → indoors
    const HEAT_THRESHOLD = 35;
    const COLD_THRESHOLD = 5; // Over 38°C → avoid outdoor
    const UV_DANGER_THRESHOLD = 9; // UV index over 9 → avoid sun
    const COOL_WEATHER = 25; // Ideal for outdoor activities
  
    let activityMessage = null;
    let activityTitle =  "Suitable Activity";
  
    // **Determine the best activity insight**
    if (precipitationHours[0] > INDOOR_THRESHOLD_HOURS) {
      activityMessage = (
        <>
          <span>Best to stay indoors today</span>, try <span>reading, gaming, or movies</span>.
        </>
      );
      activityTitle = "Movies Time"
    } else if (maxTemperature[0] > HEAT_THRESHOLD) {
      activityMessage = (
        <>
          <span>Too hot for outdoor activities</span>, consider <span>swimming or staying in shade</span>.
        </>
      );
       activityTitle = "Swimmimg Time"
    }else if (minTemperature[0] < COLD_THRESHOLD) {
      activityMessage = (
        <>
          <span>Too cold for outdoor activities</span>, consider <span>keeping warm or staying by fire</span>.
        </>
      );
      activityTitle = "Duvet Time"
    } else if (uvIndexMax[0] > UV_DANGER_THRESHOLD) {
      activityMessage = (
        <>
          <span>High UV exposure today</span>, wear <span>sunscreen</span> or avoid prolonged sun.
        </>
      );
       activityTitle = "SunScreen Day"
    } else {
      activityMessage = (
        <>
          <span>Great weather for outdoor activities</span>, perfect for <span>jogging or hiking</span>.
        </>
      );
       activityTitle = "Hiking Day"
    }
  
    // **Look ahead for vacation-friendly days**
    const goodDays = days.filter((_, i) => maxTemperature[i] <= COOL_WEATHER  && minTemperature[i] > 19 && precipitationProbabilityMax[i] < 10);
  
    if (goodDays.length) {
      activityMessage = (
        <>
          {activityMessage} Also, <span>great {goodDays.length > 1 ? 'days' : 'day'} for a vacation is, </span>{goodDays.length <5 ? <>{goodDays.map((i)=>formatDay(i, currentDate)).join(", ")}</> : 'this week'}.
        </>
      );
    } 
  
    return [activityTitle, <p className="activity-insight">{activityMessage}</p>];
  }



  

export {generateActivityInsight}