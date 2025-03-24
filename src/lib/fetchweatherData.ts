import { ForecastType, CurrentWeatherType } from "@/types/weatherTypes";
import axios from "axios";

interface WeatherData {
    current: CurrentWeatherType;
    forecast: ForecastType;
}


const requestInfo = {
    longitude: 0,
    latitude: 0,
    current: [
        'temperature_2m', 'apparent_temperature', 'is_day', 'precipitation', 'weather_code', 
        'visibility', 'wind_speed_10m', 'wind_direction_10m', 'uv_index', 'relative_humidity_2m',
    ],
    daily: [
        'weather_code', 'temperature_2m_max', 'temperature_2m_min', 'sunrise', 'sunset',  
        'precipitation_sum', 'precipitation_probability_max', 'uv_index_max', 'precipitation_hours',
    ],
    hourly: [
        'temperature_2m', 'precipitation_probability', 'weather_code', 'precipitation',
    ],
    forecast_hours: 24,  // ✅ Limits hourly forecast to the next 24 hours
    timezone: 'auto'
};


const fetchWeatherData = async (lat?: number, lon?: number) => {
        try {
            if(!lon || !lat) return null;
            const params = {
                ...requestInfo,
                latitude: lat,
                longitude: lon,
            };

            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                headers: { 'Content-Type': 'application/json' },
                params: params,
            });
            if(!response.data) return false
            const currentData = response.data.current ?? {};
            const hourlyData = response.data.hourly ?? {};
            const dailyData = response.data.daily ?? {};
            const weatherData: WeatherData = {
                current: {
                    time: currentData.time ?? '2025-01-01T06:00:00',
                    temperature: currentData.temperature_2m ?? 0,
                    code: currentData.weather_code ?? 0,
                    temperatureApparent: currentData.apparent_temperature ?? 0,
                    isDay: currentData.is_day ?? true,
                    precipitation: currentData.precipitation ?? 0,
                    visibility: currentData.visibility ?? 0,
                    windSpeed: currentData.wind_speed_10m ?? 0,
                    windDirection: currentData.wind_direction_10m ?? 90,
                    humidity: currentData.relative_humidity_2m ?? 0,
                    uv: currentData.uv_index ?? 0

                },
                forecast: {
                    days : dailyData.time ?? [],
                    code: dailyData.weather_code ?? [],
                    minTemperature: dailyData.temperature_2m_min ?? [],
                    maxTemperature: dailyData.temperature_2m_max ?? [],
                    precipitationSum: dailyData.precipitation_sum ?? [],
                    precipitationProbabilityMax: dailyData.precipitation_probability_max ?? [],
                    precipitationHours: dailyData.precipitation_hours ?? [],
                    uvIndexMax: dailyData.uv_index_max ?? [],
                    hours: hourlyData.time ?? [],
                    temperature: hourlyData.temperature_2m ?? [],
                    weatherCode: hourlyData.weather_code ?? [],
                    precipitation: hourlyData.precipitation ?? [],
                    precipitationProbability: hourlyData.precipitation_probability ?? [],
                    currentDate: currentData.time ?? '2025-01-01T06:00:00',
                    sunrise: dailyData.sunrise ?? "2025-01-01T06:00:00",
                    sunset: dailyData.sunset ?? "2025-01-01T18:00:00",
                    isDay: currentData.is_day ?? true
                },
            };
           return weatherData;

        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    };

    export {fetchWeatherData};


