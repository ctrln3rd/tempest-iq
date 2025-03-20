'use client';
import { useEffect, useState } from "react";
import { useDateConfigStore } from "@/stores/useDate";
import { ForecastType } from "@/types/weatherTypes";
import { SmallIcon } from "./Images";
import { useSettingsStore } from "@/stores/useSettings";

export function WeatherInsight({ weatherForecast }: {weatherForecast: ForecastType} ) {
  if(!weatherForecast) return;
  const {precipitationProbability, precipitation, precipitationSum, temperature, maxTemperature, minTemperature,
    hours,
    days,
    currentDate} = weatherForecast

   const {formatHour, formatDay} = useDateConfigStore();
   const {temperatureUnit} = useSettingsStore()
   const getSurely = (prob: number) =>{
    if(prob > 80){
        return 'expected'
    }else if(prob > 50 && prob < 80){
        return 'possible'
    }
    return 'low chance'
   }
   const [todayinsight, setTodayInsight] = useState<string | null>(null)
   const [todayTempinsight, setTempinsight] = useState<string | null>(null)
   const [weeklyinsight, setweeklyInsight] = useState<string | null>(null)
   const [weeklytempinsight, setweeklytempInsight] = useState<string | null>(null)

   useEffect(()=>{
   let todayInsight = '';
   let weeklyInsight = 'dry days ahead';
   let todaysTempInsight = '';
   let weeklyTempInsight = '';

    const isRainingNow = precipitation[0] > 0 && precipitationProbability[0] > 50;
    let rainEndHour = 0

    if(isRainingNow){
        rainEndHour = 0
        while (rainEndHour < hours.length - 1 && precipitation[rainEndHour +1] > 0){
            rainEndHour++;
        }
        const rainEndTime = formatHour(hours[rainEndHour], currentDate)
        todayInsight = `To continue untill ${rainEndTime}`
    }else {
        let nextRainHour = precipitation.findIndex((amt)=> amt > 0)
        if(nextRainHour !== -1) {
            const prob = precipitationProbability[nextRainHour]
            const time = formatHour(hours[nextRainHour], currentDate)
            
            rainEndHour = nextRainHour
            while (rainEndHour < hours.length - 1 && precipitation[rainEndHour +1] > 0){
                rainEndHour++;
            }
            const duration = rainEndHour - nextRainHour
           
            todayInsight = `${getSurely(prob)} around ${time} ${duration > 1 ? `for ${duration} hours` : ""}`;
        }
    }

    let maxTemp = Math.max(...temperature);
    let minTemp = Math.min(... temperature);
    console.log('max temperature', maxTemp)
    let hottestHour = formatHour(hours[temperature.indexOf(maxTemp)], currentDate)
    let coldesHour = formatHour (hours[temperature.indexOf(minTemp)], currentDate)
     
    todaysTempInsight = `Hottest hour at ${hottestHour} (${temperatureUnit(maxTemp)}) and coldest hour at ${coldesHour} (${temperatureUnit(minTemp)})`
    
     /*weeklyInsight*/
    const upComingRainyDays = days.filter((_, i)=> precipitationSum[i] > 1)
    let hottestDay = formatDay(days[maxTemperature.indexOf(Math.max(...maxTemperature))], currentDate)
    let coldestDay = formatDay(days[minTemperature.indexOf(Math.min(...minTemperature))], currentDate)
    if(upComingRainyDays.length > 0){
        if(isRainingNow && upComingRainyDays.length > 2){
            weeklyInsight = `also for next ${upComingRainyDays.length} days}`
        }else if(upComingRainyDays.length > 2) {
            weeklyInsight = `Wet days ahaed from ${formatDay(upComingRainyDays[0], currentDate)}`
        }
        weeklyInsight = `possible ${formatDay(upComingRainyDays[0], currentDate)}`
        weeklyTempInsight = `Hottest day is ${hottestDay} (${temperatureUnit(Math.max(...maxTemperature))}) and coldest day is ${coldestDay} (${temperatureUnit(Math.min(...minTemperature))})`
    }
    setTodayInsight(todayInsight)
    setweeklyInsight(weeklyInsight)
    setTempinsight(todaysTempInsight)
    setweeklytempInsight(weeklyTempInsight)
  }, [])
    return (<>
      <div className="flex flex-col items-start gap-1">
        <div className="flex gap-1 items-center opacity-70">
          <SmallIcon src='/images/umbrella.png' alt="ico"/>
          <h4>Precipition</h4>
        </div>
        {todayinsight && <span>&#8594; {todayinsight}</span>}
        {weeklyinsight && <span> &#8594; {weeklyinsight}</span>}
      </div>
      <div className="bg-white/50 w-[1px] h-full max-sm:w-full max-sm:h-[1px]"/>
      <div className="flex flex-col items-start gap-1">
      <div className="flex gap-1 items-center opacity-70">
          <SmallIcon src='/images/umbrella.png' alt="ico"/>
          <h4>Temperature</h4>
        </div>
        {todayTempinsight && <span>&#8594; {todayTempinsight}</span>}
        {weeklytempinsight && <span>&#8594; {weeklytempinsight}</span>}
      </div>
  
    </>)
}


export function CautionAndActivities({ weatherForecast}:{weatherForecast: ForecastType}) {
   const {precipitationHours,
    precipitationSum,
    uvIndexMax,
    maxTemperature,
    minTemperature,
    days,
    currentDate,} = weatherForecast;

    const {formatHour, formatDay} = useDateConfigStore();
    const [todaycaution, setTodaycaution] = useState<string[] | null>(null)
    const [weeklycaution, setweeklycaution] = useState<string[] | null>(null)
    const [activitymessages, setActivitymessages] = useState<string[] | null>(null)
    useEffect(()=>{
    let todayCaution: string[] = [];
    let weeklyCaution: string[] = [];
    let activityMessages: string[] = [];
  
    // ⚠️ Today's Weather Cautions
    if (maxTemperature[0] >= 40) todayCaution.push(`Extreme heat today! Stay hydrated.`);
    if (minTemperature[0] <= -5) todayCaution.push(`Freezing temperatures! Dress warmly.`);
    if (precipitationSum[0] > 50) todayCaution.push(`Heavy rainfall alert! Possible flooding.`);
    if (uvIndexMax[0] > 9) todayCaution.push(`High UV today! Wear sunscreen or stay indoors.`);
  
    // ⚠️ Weekly Weather Cautions (Checking only if different from today)
    let showWeeklyCaution = false;
    days.forEach((day, index) => {
      if (
        (maxTemperature[index] >= 40 && maxTemperature[index] !== maxTemperature[0]) ||
        (minTemperature[index] <= -5 && minTemperature[index] !== minTemperature[0]) ||
        (precipitationSum[index] > 50 && precipitationSum[index] !== precipitationSum[0]) ||
        (uvIndexMax[index] > 9 && uvIndexMax[index] !== uvIndexMax[0])
      ) {
        showWeeklyCaution = true;
        if (maxTemperature[index] >= 40) weeklyCaution.push(`Extreme heat expected on ${formatDay(day, currentDate)}.`);
        if (minTemperature[index] <= -5) weeklyCaution.push(`Freezing conditions on ${formatDay(day, currentDate)}.`);
        if (precipitationSum[index] > 50) weeklyCaution.push(`Heavy rainfall expected on ${formatDay(day, currentDate)}, possible flooding.`);
        if (uvIndexMax[index] > 9) weeklyCaution.push(`High UV alert on ${formatDay(day, currentDate)}, wear sun protection.`);
      }
    });
  
    // 🏃 Activity Recommendations for Today
    if (precipitationHours[0] > 5) {
      activityMessages.push("Best to stay indoors today. Try reading, gaming, or movies.");
    } else if (maxTemperature[0] > 38) {
      activityMessages.push("Too hot for outdoor activities! Try swimming or staying in shade.");
    } else if (uvIndexMax[0] > 9) {
      activityMessages.push("High UV today! Wear sunscreen or avoid prolonged exposure.");
    } else {
      activityMessages.push("Great weather for outdoor activities like jogging or hiking!");
    }
    setTodaycaution(todayCaution)
    setweeklycaution(weeklyCaution)
    setActivitymessages(activityMessages)
  }, [])
  
    return (
      <>
        {(todaycaution && todaycaution.length > 0) && <div>
        <div className="flex items-center gap-1 opacity-70">
          <SmallIcon src='/images/caution.png' alt="ico"/>
         <h3>Today's Alert</h3>
        </div>
          <ul>
            {todaycaution.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>}
  
        {(weeklycaution && weeklycaution.length > 0) && (
          <div>
        <div className="flex items-center gap-1 opacity-70">
          <SmallIcon src='/images/caution.png' alt="ico"/>
          <h3>This week alert</h3>
        </div>
            <ul>
              {weeklycaution.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
  
        <div className="flex items-center gap-1 opacity-70">
          <SmallIcon src='/images/activity.png' alt="ico"/>
          <h3>Activity Recommendation</h3>
        </div>

        {activitymessages ? (<ul>
          {activitymessages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
        ): (<p>No activity to recommend</p>)
      }
      </>
    );
  }
  