import { ForecastType } from "@/types/weatherTypes";
import React from "react";


function generateTemperatureInsight( forecast: Pick<ForecastType, 'temperature'| 'hours' | 'days' |'minTemperature' | 'maxTemperature' | 'currentDate'>,
    formatHour: (hour: string, current: string) => string ,
    formatDay: (day: string, current: string) => string,
    temperatureUnit: (temp: number) => string,
    dayTime: (hour: string) => string,
  ): [string, React.ReactNode] {
    const { temperature, maxTemperature, minTemperature, hours, days, currentDate} = forecast
    // Find hottest and coldest hours
  
    let hottestHourIndex = temperature.indexOf(Math.max(...temperature));
    let coldestHourIndex = temperature.indexOf(Math.min(...temperature));
  
    let hottestHour = formatHour(hours[hottestHourIndex], currentDate);
    let coldestHour = formatHour(hours[coldestHourIndex], currentDate);
    let hottestTemp = temperatureUnit(temperature[hottestHourIndex]);
    let coldestTemp = temperatureUnit(temperature[coldestHourIndex]);
    let hottestTime = dayTime(hours[hottestHourIndex])
    let coldestTime = dayTime(hours[coldestHourIndex])
  
    // Find hottest and coldest days
  
    const avgTemps = days.map((_, i)=> ((minTemperature[i] + maxTemperature[i]) / 2))
    const hottestIndex = avgTemps.indexOf(Math.max(...avgTemps))
    const coldestIndex = avgTemps.indexOf(Math.min(...avgTemps))
    let hottestDay = formatDay(days[hottestIndex], currentDate);
    let coldestDay = formatDay(days[coldestIndex], currentDate);
    let hottestDayTemp = temperatureUnit(avgTemps[hottestIndex]);
    let coldestDayTemp = temperatureUnit(avgTemps[coldestIndex]);
    let todayavg = temperatureUnit(avgTemps[0])

    const weeklyAvgTemp = avgTemps.reduce((sum, temp) => sum + temp, 0) / avgTemps.length;

    let temperatureTitle = "Moderate Day";
    if(avgTemps[0] >= 30){
       temperatureTitle = "Hot Day"
    }else if(avgTemps[0] <= 10){
      temperatureTitle = "Cold Day"
    }else if(weeklyAvgTemp >= 30){
      temperatureTitle = "Hot Week"
    }else if(weeklyAvgTemp <= 10){
      temperatureTitle = "Cold Week"
    }
  
    return [ temperatureTitle,
      <p>
        Today average temperature is <span>{todayavg}</span> and hottest time will be in the <span>{hottestTime} hours</span> at <span>{hottestHour} with ({hottestTemp})</span>
        , while the coldest time will be in the <span>{coldestTime} hours </span>
        at <span>{coldestHour} with ({coldestTemp})</span>. <br/> The hottest day will be <span>{hottestDay}</span> with an 
        average of <span>({hottestDayTemp})</span>, and the coldest will be <span>{coldestDay}</span> with an 
        average of <span>({coldestDayTemp})</span>.
      </p>
    ];
  }
  

export {generateTemperatureInsight}