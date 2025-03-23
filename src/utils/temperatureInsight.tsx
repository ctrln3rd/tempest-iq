import { ForecastType } from "@/types/weatherTypes";

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

export {generateTemperatureTitle, generateTemperatureInsight}