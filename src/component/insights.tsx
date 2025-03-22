'use client';
import { useEffect, useState } from "react";
import { useDateConfigStore } from "@/stores/useDate";
import { ForecastType } from "@/types/weatherTypes";
import { SmallIcon } from "./Images";
import { useSettingsStore } from "@/stores/useSettings";

export function WeatherInsight({ weatherForecast }: { weatherForecast: ForecastType }) {
  if (!weatherForecast) return null;
  const { precipitationProbability, precipitation, precipitationSum, temperature, maxTemperature, minTemperature, hours, days, currentDate } = weatherForecast;

  const { formatHour, formatDay } = useDateConfigStore();
  const { temperatureUnit } = useSettingsStore();

  const getSurely = (prob: number) => {
    if (prob > 80) return "expected";
    if (prob > 50 && prob < 80) return "possible";
    return "low chance";
  };

  const [todayInsight, setTodayInsight] = useState<string | null>(null);
  const [todayTempInsight, setTempInsight] = useState<string | null>(null);
  const [weeklyInsight, setWeeklyInsight] = useState<string | null>(null);
  const [weeklyTempInsight, setWeeklyTempInsight] = useState<string | null>(null);

  useEffect(() => {
    let todayInsight = "";
    let weeklyInsight = "Dry days ahead";
    let todaysTempInsight = "";
    let weeklyTempInsight = "";

    /** Today's Rain Insights **/
    const isRainingNow = precipitation[0] > 0 && precipitationProbability[0] > 50;
    let rainEndHour = 0;

    if (isRainingNow) {
      while (rainEndHour < hours.length - 1 && precipitation[rainEndHour + 1] > 0) {
        rainEndHour++;
      }
      const rainEndTime = formatHour(hours[rainEndHour], currentDate);
      todayInsight = `Rain expected until ${rainEndTime}`;
    } else {
      let nextRainHour = precipitation.findIndex((amt) => amt > 0);
      if (nextRainHour !== -1) {
        const prob = precipitationProbability[nextRainHour];
        const time = formatHour(hours[nextRainHour], currentDate);
        rainEndHour = nextRainHour;
        while (rainEndHour < hours.length - 1 && precipitation[rainEndHour + 1] > 0) {
          rainEndHour++;
        }
        const duration = rainEndHour - nextRainHour;
        todayInsight = `${getSurely(prob)} rain around ${time} ${duration > 1 ? `for ${duration} hours` : ""}`;
      }
    }

    /** Today's Temperature Insights **/
    let maxTemp = Math.max(...temperature);
    let minTemp = Math.min(...temperature);
    let hottestHour = formatHour(hours[temperature.indexOf(maxTemp)], currentDate);
    let coldestHour = formatHour(hours[temperature.indexOf(minTemp)], currentDate);

    todaysTempInsight = `Hottest at ${hottestHour} (${temperatureUnit(maxTemp)}), coldest at ${coldestHour} (${temperatureUnit(minTemp)})`;

    /** Weekly Insights **/
    const upComingRainyDays = days.filter((_, i) => precipitationSum[i] > 1);
    
    // Calculate average daily temperature
    const avgTemperatures = days.map((_, i) => (maxTemperature[i] + minTemperature[i]) / 2);
    let hottestDay = formatDay(days[avgTemperatures.indexOf(Math.max(...avgTemperatures))], currentDate);
    let coldestDay = formatDay(days[avgTemperatures.indexOf(Math.min(...avgTemperatures))], currentDate);

    if (upComingRainyDays.length > 0) {
      weeklyInsight = upComingRainyDays.length > 2
        ? `Wet days ahead from ${formatDay(upComingRainyDays[0], currentDate)}`
        : `Possible rain on ${formatDay(upComingRainyDays[0], currentDate)}`;
    }

    weeklyTempInsight = `Hottest day: ${hottestDay} (${temperatureUnit(Math.max(...avgTemperatures))}), Coldest day: ${coldestDay} (${temperatureUnit(Math.min(...avgTemperatures))})`;

    setTodayInsight(todayInsight);
    setWeeklyInsight(weeklyInsight);
    setTempInsight(todaysTempInsight);
    setWeeklyTempInsight(weeklyTempInsight);
  }, []);

  return (
    <>
      <div className="flex flex-col items-start gap-1">
        <div className="flex gap-1 items-center opacity-70">
          <SmallIcon src='/images/umbrella.png' alt="ico"/>
          <h4>Precipitation</h4>
        </div>
        {todayInsight && <span>&#8594; {todayInsight}</span>}
        {weeklyInsight && <span>&#8594; {weeklyInsight}</span>}
      </div>
      <div className="bg-white/50 w-[1px] h-full max-sm:w-full max-sm:h-[1px]" />
      <div className="flex flex-col items-start gap-1">
        <div className="flex gap-1 items-center opacity-70">
          <SmallIcon src='/images/umbrella.png' alt="ico"/>
          <h4>Temperature</h4>
        </div>
        {todayTempInsight && <span>&#8594; {todayTempInsight}</span>}
        {weeklyTempInsight && <span>&#8594; {weeklyTempInsight}</span>}
      </div>
    </>
  );
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
    let weeklyCaution: Record<string, string[]> = {};
    let activityMessages: string[] = [];
  
    // ⚠️ Today's Weather Cautions
    if (maxTemperature[0] >= 40) todayCaution.push(`Extreme heat today! Stay hydrated.`);
    if (minTemperature[0] <= -5) todayCaution.push(`Freezing temperatures! Dress warmly.`);
    if (precipitationSum[0] > 50) todayCaution.push(`Heavy rainfall alert! Possible flooding.`);
    if (uvIndexMax[0] > 9) todayCaution.push(`High UV today! Wear sunscreen or stay indoors.`);
  
    // ⚠️ Weekly Weather Cautions (Checking only if different from today)
    days.forEach((day, index) => {
      if (index === 0) return; // Skip today (already handled above)
  
      if (maxTemperature[index] >= 40) {
        weeklyCaution["Extreme heat"] ||= [];
        weeklyCaution["Extreme heat"].push(formatDay(day, currentDate));
      }
      if (minTemperature[index] <= -5) {
        weeklyCaution["Freezing conditions"] ||= [];
        weeklyCaution["Freezing conditions"].push(formatDay(day, currentDate));
      }
      if (precipitationSum[index] > 50) {
        weeklyCaution["Heavy rainfall"] ||= [];
        weeklyCaution["Heavy rainfall"].push(formatDay(day, currentDate));
      }
      if (uvIndexMax[index] > 9) {
        weeklyCaution["High UV"] ||= [];
        weeklyCaution["High UV"].push(formatDay(day, currentDate));
      }
    });

    let weeklyCautionMessages = Object.entries(weeklyCaution).map(
      ([type, days]) => `${type} expected on ${days.join(", ")}.`
    );
  
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
    setweeklycaution(weeklyCautionMessages)
    setActivitymessages(activityMessages)
  }, [])
  
    return (
      <>
        {(todaycaution && todaycaution.length > 0) && 
        <div className="flex flex-col gap-1 items-start">
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
          <div className="flex flex-col gap-1 items-start">
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
        <div className="flex flex-col gap-1 items-start">
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
      </div>
      </>
    );
  }
  