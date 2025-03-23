'use client';
import { useEffect, useState } from "react";
import { useDateConfigStore } from "@/stores/useDate";
import { ForecastType } from "@/types/weatherTypes";
import { useSettingsStore } from "@/stores/useSettings";
import { HelperIcon } from "./icons";



const generatePrecipitationTitle = ({hours, precipitationProbability, precipitationSum, precipitation } : 
  Pick<ForecastType, 'precipitationProbability' | 'hours' | 'precipitation' | 'precipitationSum'>) => {
  const rainNow = precipitationProbability[0] > 50 && precipitation[0] > 0; // Is it raining now?
  const rainToday = hours.some((_, i) => i < 24 && precipitation[i] > 0 && precipitationProbability[i] > 50 ); // Any rain today?
  const rainThisWeek = precipitationSum.some((sum, i) => i > 0 && sum > 1); // Rain in coming days?
  if (rainNow) return "Rain Now";
  if (rainToday) return "Rain Coming";
  if (rainThisWeek) return "Rainy Week Ahead";
  return "Dry Days Ahead";
};

const generatePrecipitationInsight = (forecast : Pick<ForecastType, 'hours' |'days' | 'precipitation' | 'precipitationSum' |'currentDate' | 'precipitationProbability' | 'temperature'>,
  formatHour: (hour: string, current: string) => string ,
  formatDay: (day: string, current: string) => string
) => {
  const { days, hours, precipitation, precipitationProbability, currentDate, precipitationSum, temperature} = forecast

  const getSurely = (prob: number) => {
    if (prob > 80) return "expect";
    if (prob > 50 && prob < 80) return "possible";
    return "low chance";
  };
  const getPrecipitationType = (temp: number) => {
    if (temp <= 0) return "snow";
    if (temp > 0 && temp < 3) return "freezing rain";
    return "rain"; // Default to rain for warmer temperatures
  };

  let nextRainHour = precipitation.findIndex((amt) => amt > 0);
  let nextRainTime = nextRainHour !== -1 ? formatHour(hours[nextRainHour], currentDate) : null;
  let upcomingRainDays = days
  .map((day, i) => ((precipitationSum[i] > 1 && i !== 0) ? formatDay(day, currentDate) : null))
  .filter(Boolean);
  let nextRainDay = upcomingRainDays.length > 0 ? upcomingRainDays[0] : null;
  let isRainingNow = precipitation[0] > 0 && precipitationProbability[0] > 50;
  let rainEndHour = 0;

  if (isRainingNow) {
    while (rainEndHour < hours.length - 1 && precipitation[rainEndHour + 1] > 0) {
      rainEndHour++;
    }
    const rainEndTime = formatHour(hours[rainEndHour], currentDate);
  return (
    <p> {getSurely(precipitationProbability[0])} <span>{getPrecipitationType(temperature[0])}</span> to continue {rainEndHour < 18 ?
      <>untill {rainEndTime}</> : 'almost all day'
    }, {upcomingRainDays.length > 1  && <>and possibly to continue in the coming days , {upcomingRainDays.length < 4 && <span> 
          {upcomingRainDays.join(", ")}</span>}</>}</p>
  );
  }

  if (nextRainHour !== -1) {
      return (
        <p> {getSurely(precipitation[nextRainHour])} <span>{getPrecipitationType(temperature[nextRainHour])}</span> around <span>
          {nextRainTime}</span>, {upcomingRainDays.length > 1  && <> and possibly to continue in the coming days on, {upcomingRainDays.length < 4 && <span>
              {upcomingRainDays.join(", ")}</span>}</>} </p>
      );
  }
    

  if (nextRainDay) {
    if(upcomingRainDays.length > 3){
      return (
        <p>
          Dry today, wet days are coming.
        </p>
      )
    }else{
    return (
      <p>
        Dry today, but <span>{upcomingRainDays.join(", ")}</span> is the next wet ${upcomingRainDays.length > 1 ? 'days' : 'day'}.
      </p>
    );
  }
  }

  return (
    <p>
      <span>Dry days ahead</span>, no precipitation expected this week.
    </p>
  );
}


function generateTemperatureInsight( forecast: Pick<ForecastType, 'temperature'| 'hours' | 'days' |'minTemperature' | 'maxTemperature' | 'currentDate'>,
  formatHour: (hour: string, current: string) => string ,
  formatDay: (day: string, current: string) => string,
  temperatureUnit: (temp: number) => string,
) {
  const { temperature, maxTemperature, minTemperature, hours, days, currentDate} = forecast
  // Find hottest and coldest hours

  let hottestHourIndex = temperature.indexOf(Math.max(...temperature));
  let coldestHourIndex = temperature.indexOf(Math.min(...temperature));

  let hottestHour = formatHour(hours[hottestHourIndex], currentDate);
  let coldestHour = formatHour(hours[coldestHourIndex], currentDate);
  let hottestTemp = temperature[hottestHourIndex];
  let coldestTemp = temperature[coldestHourIndex];

  // Find hottest and coldest days
  let hottestDayIndex =maxTemperature.indexOf(Math.max(...maxTemperature));
  let coldestDayIndex = minTemperature.indexOf(Math.min(...minTemperature));

  let hottestDay = formatDay(days[hottestDayIndex], currentDate);
  let coldestDay = formatDay(days[coldestDayIndex], currentDate);
  let hottestDayTemp = maxTemperature[hottestDayIndex];
  let coldestDayTemp = minTemperature[coldestDayIndex];

  return (
    <p>
      The hottest hour will be <span>{hottestHour} ({temperatureUnit(hottestTemp)})</span>, while the coldest will be{" "}
      <span>{coldestHour} ({temperatureUnit(coldestTemp)})</span>. The hottest day will be <span>{hottestDay}</span> with an 
      average of <span>({temperatureUnit(hottestDayTemp)})</span>, and the coldest will be <span>{coldestDay}</span> with an 
      average of <span>({temperatureUnit(coldestDayTemp)})</span>.
    </p>
  );
}

function generateTemperatureTitle({ maxTemperature, minTemperature } : Pick<ForecastType, 'maxTemperature' | 'minTemperature'>) {
  // Calculate the daily average temperature
  const dailyAvgTemp = maxTemperature.map((max, i) => (max + minTemperature[i]) / 2);
  
  // Calculate the weekly average temperature
  const weeklyAvgTemp = dailyAvgTemp.reduce((sum, temp) => sum + temp, 0) / dailyAvgTemp.length;

  // Get today's temperature
  const todayAvgTemp = dailyAvgTemp[0];

  // Determine hot or cold thresholds (adjustable)
  const HOT_THRESHOLD = 30; // Example: 30°C and above is considered hot
  const COLD_THRESHOLD = 10; // Example: 10°C and below is considered cold

  let title = "Moderate Temperature"; // Default title

  if (todayAvgTemp >= HOT_THRESHOLD) {
    title = "Hot Day";
  } else if (todayAvgTemp <= COLD_THRESHOLD) {
    title = "Cold Day";
  }

  if (weeklyAvgTemp >= HOT_THRESHOLD) {
    title = "Hot Week";
  } else if (weeklyAvgTemp <= COLD_THRESHOLD) {
    title = "Cold Week";
  }

  return title;
}




export function WeatherInsight({ weatherForecast }: { weatherForecast: ForecastType }) {
  if (!weatherForecast) return null;
  const { formatHour, formatDay } = useDateConfigStore();
  const { temperatureUnit } = useSettingsStore();
 
  const [precipitationTitle, setPrecipitationTitle] = useState<string>('Dry days ahead')
  const [temperatureTitle, setTemperatureTitle] = useState<string>('Temperature')
  const [precipitationInsight, setPrecipitationInsight] = useState<JSX.Element | null>(null);
  const [temperatureInsight, setTemperatureInsight] = useState<JSX.Element | null>(null);
  useEffect(() => {
    if(weatherForecast){
      setPrecipitationTitle(generatePrecipitationTitle(weatherForecast))
      setPrecipitationInsight(generatePrecipitationInsight(weatherForecast, formatHour, formatDay))
      setTemperatureTitle(generateTemperatureTitle(weatherForecast))
      setTemperatureInsight(generateTemperatureInsight(weatherForecast, formatHour, formatDay, temperatureUnit))
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
