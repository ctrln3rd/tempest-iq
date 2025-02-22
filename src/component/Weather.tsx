'use client';
import React, { useState, useEffect } from "react";
import Forecast from "./Forecast";

import { useRouter } from "next/navigation";

import { useSelectedLocationStore } from "@/stores/useLocation";
import { useLocalStorageStore } from "@/stores/useLocalStorage";
import { useDateConfigStore } from "@/stores/useDate";
import { useSettingsStore } from "@/stores/useSettings";
import { useWeatherConfigStore } from "@/stores/useWeather";
import axios from "axios";
import { toast } from "react-toastify";
import { CurrentWeather, DailyForecast } from "@/types/weatherTypes";
import { LargeIcon } from "./Images";

// Define TypeScript interfaces



interface WeatherData {
    current: CurrentWeather;
    daily: DailyForecast;
}

export default function Weather(){
    const {selectedLocation} = useSelectedLocationStore();
    const router = useRouter();
    
    const [current, setCurrent] = useState<CurrentWeather | null>(null);
    const [dailyforecast, setDailyForecast] = useState<DailyForecast | null>(null);
    const [iserror, setError] = useState(false);
    const [isday, setIsDay] = useState(false);

    //configs
    const {temperatureUnit, temperatureUnitChart, speedUnit, distanceUnit , getAutoAge}= useSettingsStore();
    const {checkWeatherDiffExpired} = useDateConfigStore();
    const {weatherData, saveWeatherData, saveShortWeatherData} = useLocalStorageStore();
    const {getCodeBackground, getCodeCondition, formatWind, formatVisibility, formatWindDirection, uvHealth} = useWeatherConfigStore();

    useEffect(() => {
        if (!selectedLocation) {
            console.error("Cannot fetch weather data for invalid location:");
            router.push('/');
            toast.error('you must add to your locations',{
                autoClose: 5000
            })
            return;
        }

        const fetchWeather = async() => {
            const cachedWeather = weatherData[String(selectedLocation?.id)];

            if (cachedWeather) {
                feedData(cachedWeather.data);

                if(checkWeatherDiffExpired(cachedWeather.timestamp, getAutoAge())) {
                    const toastId = toast.loading('Updating...');
                    const response =await fetchWeatherData();
                    response ? toast.update(toastId,{
                        render: 'updated',
                        isLoading: false,
                        autoClose: 3000,
                    }) : toast.update(toastId,{
                        render: 'error updating',
                        isLoading: false,
                        autoClose: 3000,
                    })
                }
            } else {
                const toastId = toast.loading('fetching data')
                const response = await fetchWeatherData();
                response ? toast.update(toastId,{
                    render: 'updated',
                    isLoading: false,
                    autoClose: 3000,
                }) : toast.update(toastId, {
                    render: 'error fetching',
                    isLoading: false,
                    autoClose: 3000
                })
                if(!response) router.push('/');  
            }
            return;
        };


        fetchWeather();
    },[]);

    const feedData = (filteredData: WeatherData | null) => {
        if (filteredData) {
            setCurrent(filteredData.current);
            setDailyForecast(filteredData.daily);
        }
    };

    const fetchWeatherData = async () => {
        if (!selectedLocation) return false;

        try {
            const params = {
                ...requestInfo,
                latitude: selectedLocation?.lat,
                longitude: selectedLocation?.lon,
            };

            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                headers: { 'Content-Type': 'application/json' },
                params: params,
            });

            const weatherData: WeatherData = {
                current: response.data.current ?? {},
                daily: response.data.daily ?? {},
            };

            saveWeatherData(String(selectedLocation?.id), weatherData);
            saveShortWeatherData(String(selectedLocation?.id), String(weatherData.current.weather_code ?? 3));
            feedData(weatherData);

            return true;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError(true);
            return false;
        }
    };

    useEffect(() => {
        if (current) {
            setIsDay(Boolean(current.is_day));
            getCodeBackground(current?.weather_code, isday)
        }
    }, [current]);

    const handleRefresh = async () => {
        const toastId = toast.loading('updating...');
        const response = await fetchWeatherData();
        response ? 
        toast.update(toastId,{
            render: 'updated',
            isLoading: false,
            autoClose: 3000,
        }) : toast.update(toastId,{
            render: 'error updating',
            isLoading: false,
            autoClose: 3000,
        });
    };

    return (
        <>
            {current ? (
                <div  style={{'--image-url': `url(${getCodeBackground(current?.weather_code, isday)})`} as React.CSSProperties}
                    className={`flex flex-col items-center gap-10 absolute top-0 left-0 w-[100%] z-0 pt-20
                        bg-[image:var(--image-url)] max-sm:pt-[15vh]`}
                >
                    <div className='min-w-[40vw] min-h-[40vh] px-2 py-5 rounded-2xl backdrop-blur-lg flex flex-col items-end justify-end gap-4 max-sm:min-w-[80vw]'>
                        <div className="flex flex-col gap-2 items-end">
                            <p className=" flex flex-row items-start text-7xl">
                                {temperatureUnitChart(Number(current?.temperature_2m))}<sup className="text-2xl">°</sup>
                            </p>
                            <p className="text-lg ">{getCodeCondition(current?.weather_code)}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-row gap-2">
                                <p className="pr-2 border-r border-r-amber-50">
                                    Feels like <span>{temperatureUnit(Number(current?.apparent_temperature))}</span>
                                </p>
                                <p style={{ color: `${uvHealth(current?.uv_index)}` }} className="pr-2 border-r border-r-amber-50">
                                    UV Index <span>{Math.round(Number(current?.uv_index))}</span>
                                </p>
                                <p >
                                    Humidity <span>{Math.floor(Number(current?.relative_humidity_2m))}</span>
                                </p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="pr-2 border-r border-r-amber-50">
                                    {formatWindDirection(current?.wind_direction_10m)} {formatWind(current?.wind_speed_10m)}
                                    <span>{speedUnit(Number(current?.wind_speed_10m))}</span>
                                </p>
                                <p>
                                    Visibility <span>{distanceUnit(current?.visibility)}</span>
                                    {formatVisibility(Number(current.visibility) / 1000)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {dailyforecast && (
                        <Forecast 
                            dailyforecast={dailyforecast}  
                            currenttime={current?.time || ''} 
                            isDay={isday} 
                            handleRefresh={handleRefresh}
                        />
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center absolute top-[50%] left-[50%] transform translate-[-50%]">
                    <LargeIcon src='/images/cool.png' alt="weather" />
                    {!selectedLocation ? 'no coordiates provided for the location to get the data ' :'weather data will show here'}
                </div>
            )}
        </>
    );
}

const requestInfo = {
    longitude: 0,
    latitude: 0,
    current: [
        'temperature_2m', 'apparent_temperature', 'is_day', 'precipitation', 'weather_code', 
        'visibility', 'wind_speed_10m', 'wind_direction_10m', 'uv_index', 'relative_humidity_2m'
    ],
    daily: [
        'weather_code', 'temperature_2m_max', 'temperature_2m_min', 'sunrise', 'sunset',  
        'precipitation_sum', 'precipitation_probability_max', 'uv_index_max'
    ],
    timezone: 'auto'
};
//style={{ backgroundImage: `url(${getcodebackground(current?.weather_code, isday)})` }}