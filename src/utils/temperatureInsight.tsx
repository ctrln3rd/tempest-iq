import { ForecastType } from "@/types/weatherTypes";


function generateTemperatureInsight( forecast: Pick<ForecastType, 'temperature'| 'hours' | 'days' |'minTemperature' | 'maxTemperature' | 'currentDate'>,
    formatHour: (hour: string, current: string) => string ,
    formatDay: (day: string, current: string) => string,
    temperatureUnit: (temp: number) => string,
    dayTime: (hour: string) => string,
  ) {
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
  
    return (
      <p>
        The hottest time will be in the <span>{hottestTime} hours</span> at <span>{hottestHour} with ({hottestTemp})</span>
        , while the coldest time will be in the <span>{coldestTime} hours </span>
        at <span>{coldestHour} with ({coldestTemp})</span>. <br/> The hottest day will be <span>{hottestDay}</span> with an 
        average of <span>({hottestDayTemp})</span>, and the coldest will be <span>{coldestDay}</span> with an 
        average of <span>({coldestDayTemp})</span>.
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
  
    const HOT_THRESHOLD = 30; 
    const COLD_THRESHOLD = 10;
  
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

export {generateTemperatureTitle, generateTemperatureInsight}