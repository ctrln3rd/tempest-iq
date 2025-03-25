import { ForecastType } from "@/types/weatherTypes";


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
  formatDay: (day: string, current: string) => string,
  dayTime: (hour: string) => string,
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
    <p> {getSurely(precipitationProbability[0])} <span>{getPrecipitationType(temperature[0])}</span> likely to continue {rainEndHour < 18 ?
      <>untill {rainEndHour > 3 && <> in the <span>{dayTime(hours[rainEndHour])}</span> at</>} <span>{rainEndTime}</span></> : 'almost all day'
    }, {upcomingRainDays.length > 1  && <>and also possible to continue in the coming days {upcomingRainDays.length < 4 && <span> 
          ,{upcomingRainDays.join(", ")}</span>}</>}</p>
  );
  }

  if (nextRainHour !== -1) {
      return (
        <p> {getSurely(precipitation[nextRainHour])} <span>{getPrecipitationType(temperature[nextRainHour])}</span> around 
          {nextRainHour > 3 && <><span> {dayTime(hours[nextRainHour])}</span> time at</>}
          <span> {nextRainTime}</span>, {upcomingRainDays.length > 1  && <> and  also possible to continue in the coming days {upcomingRainDays.length < 4 && <span>
              ,{upcomingRainDays.join(", ")}</span>}</>} </p>
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
        Dry today, but <span>{upcomingRainDays.join(", ")}</span> ${upcomingRainDays.length > 1 ? 'are' : 'is'} the next wet ${upcomingRainDays.length > 1 ? 'days' : 'day'}.
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

export {generatePrecipitationTitle, generatePrecipitationInsight}