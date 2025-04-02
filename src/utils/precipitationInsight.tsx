import { ForecastType } from "@/types/weatherTypes";
import React from "react";

function generatePrecipitationInsight (forecast : Pick<ForecastType, 'hours' |'days' | 'precipitation' | 'precipitationSum' |'currentDate' | 'precipitationProbability' | 'temperature'>,
  formatHour: (hour: string, current: string) => string ,
  formatDay: (day: string, current: string) => string,
  dayTime: (hour: string) => string,
):[string, React.ReactNode] {
  const { days, hours, precipitation, precipitationProbability, currentDate, precipitationSum, temperature} = forecast

  const getSurely = (prob: number) => {
    if (prob > 80) return "expect";
    if (prob > 50 && prob < 80) return "possible";
    if(prob > 30 && prob < 50) return "low chance";
    return "very low chance";
  };
  const getPrecipitationType = (temp: number) => {
    if (temp <= 0) return "Snow";
    if (temp > 0 && temp < 3) return "Freezing Rain";
    return "Rain"; // Default to rain for warmer temperatures
  };

  let nextRainHour = precipitation.findIndex((amt, i) => amt > 0 && precipitationProbability[i] > 10); 
  let nextRainTime = nextRainHour !== -1 ? formatHour(hours[nextRainHour], currentDate) : null;
  let upcomingRainDays = days
  .map((day, i) => ((precipitationSum[i] > 1 && i !== 0) ? formatDay(day, currentDate) : null))
  .filter(Boolean);
  let nextRainDay = upcomingRainDays.length > 0 ? upcomingRainDays[0] : null;
  let isRainingNow = precipitation[0] > 0 && precipitationProbability[0] > 70;
  let rainEndHour = 0;

  let precipitationResponse = null
  let precipitationTitle = ""

  if (isRainingNow) {
     precipitationTitle = `${getPrecipitationType(temperature[0])} Now`
    while (rainEndHour < hours.length - 1 && precipitation[rainEndHour + 1] > 0) {
      rainEndHour++;
    }
    const rainEndTime = formatHour(hours[rainEndHour], currentDate);
    precipitationResponse = <> <span>{getPrecipitationType(temperature[0])}</span> {rainEndHour > 1 ? <>likely to continue  {rainEndHour < 18 ?
      <>untill {rainEndHour > 3 && <> in the <span>{dayTime(hours[rainEndHour])}</span> at</>} <span>{rainEndTime}</span></> : 'almost all day'
    }</>: 'likely to stop this hour'}. {upcomingRainDays.length > 1  && <> Also expected in the coming days {upcomingRainDays.length < 4 && <span> 
          ,{upcomingRainDays.join(", ")}</span>}</>}</>
  
  }else if (nextRainHour !== -1) { 
    precipitationTitle =  `${getPrecipitationType(temperature[nextRainHour])} Coming`
    precipitationResponse = <> {getSurely(precipitationProbability[nextRainHour])} <span>{getPrecipitationType(temperature[nextRainHour])}</span> around 
      {nextRainHour > 3 && <><span> {dayTime(hours[nextRainHour])}</span> time at</>}
      <span> {nextRainTime}</span>. {upcomingRainDays.length > 1  && <> Also expected in the coming days {upcomingRainDays.length < 4 && <span>
          ,{upcomingRainDays.join(", ")}</span>}</>} </>
    ;
  } else if (nextRainDay) {
    if(upcomingRainDays.length > 3){
      precipitationTitle = "Wet Days Coming"
      precipitationResponse =  <>Dry now, but Wet days are coming this week.</>
      
    }else{
      precipitationTitle = "Wet Day Coming"
      precipitationResponse = <>
        Dry now, but <span>{upcomingRainDays.join(", ")}</span> {upcomingRainDays.length > 1 ? 'are' : 'is'} the next wet {upcomingRainDays.length > 1 ? 'days' : 'day'}.
      </>
  }
  }else{
    precipitationTitle = "Dry Days Ahead"
    precipitationResponse = <>No precipitation expected this week</>
  }

  return [precipitationTitle, <p>{precipitationResponse}</p>];
}

export {generatePrecipitationInsight}