export interface CurrentWeatherType {
    temperature: number;
    temperatureApparent: number;
    isDay: number;
    precipitation?: number;
    code: number;
    visibility: number;
    windSpeed: number;
    windDirection: number;
    uv: number;
    humidity: number;
    time?: string;
}


export interface ForecastType {
  days: string[];
  code: number[];
  maxTemperature: number[];
  minTemperature: number[];
  sunrise: string[];
  sunset: string[];
  precipitationSum: number[];
  precipitationProbabilityMax: number[];
  precipitationHours: number [];
  uvIndexMax: number[];
  hours: string[];
  temperature: number[];
  weatherCode: number[];
  precipitation: number[];
  precipitationProbability: number[];
  currentDate: string;
  isDay: number;
}