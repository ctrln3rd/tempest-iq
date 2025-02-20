export interface CurrentWeather {
    temperature_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation?: number;
    weather_code: number;
    visibility: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    uv_index: number;
    relative_humidity_2m: number;
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
    uv_index_max: number[];
}

export interface DailyChartData {
  day: string;
  temp: number;
  icon: number;
  prep: number;
}