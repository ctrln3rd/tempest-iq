export interface CurrentWeather {
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



export interface DailyForecast {
    weather_code: number[];
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    precipitation_hours: number [];
    uv_index_max: number[];
}

export interface DailyChartData {
  day: string;
  temp: number;
  icon: number;
  prep: number;
}

export interface HourlyForecast {
  weather_code: number[];
  time: string[];
  temperature_2m: number[];
  precipitation: number[];
  precipitation_probability: number[];

}

export interface ForecastType {
  days: string[];
  code: number[];
  maxTemperature: number[];
  minTemperature: number[];
  sunrise?: string[];
  sunset?: string[];
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
}