import { ForecastType } from "@/types/weatherTypes";

function generateCautionInsight(forecast: Pick<ForecastType, "uvIndexMax" | "precipitationSum" | "maxTemperature" | "minTemperature" | "days" | 'currentDate'>,
    formatDay: (day: string, current: string) => string,
) {
    const { uvIndexMax, precipitationSum, maxTemperature, minTemperature, days,currentDate } = forecast
    if (!days.length) return <span>No caution alerts.</span>;
  
    const UV_THRESHOLD = 7;
    const RAIN_THRESHOLD = 25;
    const HOT_TEMP_THRESHOLD = 35;
    const COLD_TEMP_THRESHOLD = 5;
  
    const highUvDays = days.filter((_, i) => uvIndexMax[i] >= UV_THRESHOLD);
    const highRainDays = days.filter((_, i) => precipitationSum[i] >= RAIN_THRESHOLD);
    const hotDays = days.filter((_, i) => maxTemperature[i] >= HOT_TEMP_THRESHOLD);
    const coldDays = days.filter((_, i) => minTemperature[i] <= COLD_TEMP_THRESHOLD);
  
    
    const rainPart = highRainDays.length ? (
      <>
        <span>heavy rainfall</span> expected {highRainDays.length < 5 ?<span> {highRainDays.map((i)=>formatDay(i, currentDate)).join(", ")}</span> : ' almost everyday this week'}
      </>
    ) : null;
  
    const hotPart = hotDays.length ? (
      <>
        {(rainPart) ? " and " : ""}
        <span>very hot temperatures</span> expected {hotDays.length < 3  ? <span>{hotDays.map((i)=>formatDay(i, currentDate)).join(", ")}</span> : ' this week'}
      </>
    ) : null;
  
    const coldPart = coldDays.length ? (
      <>
        {(rainPart || hotPart) ? " and " : ""}
        <span>cold conditions</span> expected {coldDays.length < 3 ? <span>{coldDays.map((i)=>formatDay(i, currentDate)).join(", ")}</span> : ' this week'}
      </>
    ) : null;
    const uvPart = highUvDays.length ? (
      <>
        {(rainPart || hotPart || coldPart) ? " and " : ""}
        <span>high UV radiation</span> expected {highUvDays.length < 3 ? <span> ,{highUvDays.map((i)=>formatDay(i, currentDate)).join(", ")}</span> : ' this week'}
      </>
    ) : null;
  
  
    return (
      <div className="caution-insight">
        {rainPart}
        {hotPart}
        {coldPart}
        {uvPart}
        {!uvPart && !rainPart && !hotPart && !coldPart && "No extreme weather expected."}
      </div>
    );
  }

  function generateCautionTitle({ precipitationSum, maxTemperature, uvIndexMax, days,}: 
    Pick<ForecastType,"precipitationSum" | "precipitationProbabilityMax" | "maxTemperature" | "uvIndexMax" | "days">,
  ){
    if (!days.length) return 'Caution';
  
    // **Thresholds**
    const FLOOD_RISK = 50; 
    const HIGH_PRECIP_PROB = 25; 
    const HIGH_UV = 7;
    const HEAT_WAVE = 35;
    const COLD_WAVE = 5;
  

    let title = "Any Caution"; 
    if (precipitationSum[0] > FLOOD_RISK) {
      title = "Possible Floods";
    }else if (precipitationSum[0] >= HIGH_PRECIP_PROB) {
      title = "Heavy Rain";
    } else if (maxTemperature[0] > HEAT_WAVE) {
      title = "Too Hot";
    } else if (maxTemperature[0] < COLD_WAVE) {
      title = "Freezing";
    }else if (uvIndexMax[0] > HIGH_UV) {
      title = "High UV";
    } 
  
    return title;
  }
  
export {generateCautionTitle, generateCautionInsight}