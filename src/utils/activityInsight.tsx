import { ForecastType } from "@/types/weatherTypes";

function generateActivityInsight(forecast: Pick<ForecastType, "precipitationHours" |'precipitationProbabilityMax' | "maxTemperature" |'minTemperature' | "uvIndexMax" | "days" | 'currentDate'>,
    formatDay: (day: string, current: string) => string,
  ) {
    const { precipitationHours, precipitationProbabilityMax, minTemperature, maxTemperature, uvIndexMax, days, currentDate} = forecast
    if (!days.length) return <span>No activity suggestions.</span>;
  
    const INDOOR_THRESHOLD_HOURS = 10; // More than 5 hours of rain → indoors
    const HEAT_THRESHOLD = 35; // Over 38°C → avoid outdoor
    const UV_DANGER_THRESHOLD = 9; // UV index over 9 → avoid sun
    const COOL_WEATHER = 25; // Ideal for outdoor activities
  
    let activityMessage = null;
  
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
    const goodDays = days.filter((_, i) => maxTemperature[i] <= COOL_WEATHER  && minTemperature[i] > 19 && precipitationProbabilityMax[i] < 10);
  
    if (goodDays.length) {
      activityMessage = (
        <>
          {activityMessage} Also, <span>great days for a vacation, </span>{goodDays.length <5 ? <>{goodDays.map((i)=>formatDay(i, currentDate)).join(", ")}</> : 'this week'}.
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
  
  
  

export {generateActivityTitle, generateActivityInsight}