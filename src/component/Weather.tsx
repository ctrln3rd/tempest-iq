'use client';
import React, { useState, useEffect, Suspense } from "react";
import { WeatherInsight, CautionAndActivities } from "./insights";
import Animations from "./animations";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocalStorageStore } from "@/stores/useLocalStorage";
import { useDateConfigStore } from "@/stores/useDate";
import { useSettingsStore } from "@/stores/useSettings";
import { useWeatherConfigStore } from "@/stores/useWeather";
import axios from "axios";
import { toast } from "react-toastify";
import { CurrentWeather, ForecastType } from "@/types/weatherTypes";
import FullForecast from "./forecasts";
import AstroTrack from "./astroTrack";
import { HelperIcon, ThemeIcon } from "./icons";

// Define TypeScript interfaces

interface Location {
    id: string;
    name: string;
    country: string;
    lat: number;
    lon: number;
    current: boolean;
  }

interface WeatherData {
    current: CurrentWeather;
    forecast: ForecastType;
}



function WeatherComonent(){
    const router = useRouter();
    const params = useSearchParams()
    const [current, setCurrent] = useState<CurrentWeather | null>(null);
    const [forecast, setforecast] = useState<ForecastType | null>(null);
    const [location, setLocation] = useState<Location | null>(null)
    const [isSaved, setSaved] = useState(true);
    const [isAdd, setAdd] = useState(false);
    const [isAddWeather, setAddWeather]= useState<WeatherData | null>(null);
    const [isday, setIsDay] = useState(false);
    const [isFull, setFull] = useState(false);
    const locationId = params.get('id') || ''
    const locationName = params.get('name') || 'Nairobi'
    //configs
    const {temperatureUnit, temperatureUnitChart, speedUnit, distanceUnit , getAutoAge}= useSettingsStore();
    const {checkWeatherDiffExpired, formatLocalDate} = useDateConfigStore();
    const {locations, weatherData, saveWeatherData, saveShortWeatherData, saveLocation} = useLocalStorageStore();
    const {getCodeBackground,getCodeCondition, formatWind, formatVisibility, formatWindDirection, uvHealth} = useWeatherConfigStore();
    useEffect(() => {
        if (!locationId) {
            console.error("Cannot fetch weather data for invalid location:");
            router.push('/');
            toast('no location id provided',{
                autoClose: 5000
            })
            return;
        }

        const fetchLocation = async() => {
            let Location = locations.find((loc) => loc.id === locationId)
            if(Location){
                setSaved(true)
                setLocation(Location)
            }else{
                setSaved(false)
                const toastId = toast.loading('getting location...');
                try {
                    const locationResponse = await axios.get(
                        `https://nominatim.openstreetmap.org/lookup?osm_ids=${locationId}&format=json`
                    );
                    if (locationResponse.data) {
                        const newdata = locationResponse.data[0]
                        setLocation({
                            id: locationId,
                            name: newdata.name || locationName,
                            lat: parseFloat(newdata.lat),
                            lon: parseFloat(newdata.lon),
                            country: newdata.type || "Unknown",
                            current: false
                        });
                        toast.update(toastId,{ render: 'location gotten', isLoading: false, autoClose: 3000,})
                    }
                } catch (error) {
                    console.error("Error fetching location details:", error);
                    toast.update(toastId,{ render: 'error getting location', isLoading: false, autoClose: 3000,})
                }
            }

        return;
        };
       


        fetchLocation();
    },[locationId]);

    useEffect(()=>{
        const fetchWeather = async()=>{
            const cachedWeather = weatherData[String(location?.id)];
            if (cachedWeather) {
                feedData(cachedWeather.data)
                if(checkWeatherDiffExpired(cachedWeather.timestamp, getAutoAge())) {
                    const toastId = toast.loading('Updating...');
                    const response =await fetchWeatherData();
                    response ? toast.update(toastId,{ render: 'updated', isLoading: false, autoClose: 3000,
                    }) : toast.update(toastId,{ render: 'error updating', isLoading: false, autoClose: 3000,})
                }
            } else {
                const toastId = toast.loading('fetching data')
                const response = await fetchWeatherData();
                response ? toast.update(toastId,{ render: 'updated', isLoading: false, autoClose: 3000,
                }) : toast.update(toastId, { render: 'error fetching', isLoading: false, autoClose: 3000})
                if(!response) router.push('/');  
            }
        return;
        }
        if(location){
         fetchWeather();
        }

    },[location])

    const feedData = (filteredData: WeatherData ) => {
        setCurrent(filteredData.current);
        setforecast(filteredData.forecast);
    };

    const saveNewLocation =()=>{
        saveLocation(location, false, true)
        saveWeatherData(String(location?.id), isAddWeather)
        saveShortWeatherData(String(location?.id), String(isAddWeather?.current.code ?? 3))
        setAdd(false)
        setAddWeather(null)
    }

    const fetchWeatherData = async () => {
        try {
            if(!location?.lat || !location.lon) return false;
            const params = {
                ...requestInfo,
                latitude: location?.lat,
                longitude: location?.lon,
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
            feedData(weatherData);
            if(isSaved){
                saveWeatherData(String(location?.id), weatherData);
                saveShortWeatherData(String(location?.id), String(weatherData.current.code ?? 3));
            }else{
              setAddWeather(weatherData)
              setAdd(true)
            }
            return true;

        } catch (error) {
            console.error('Error fetching weather data:', error);
            return false;
        }
    };

    useEffect(() => {
        if (current) {
            setIsDay(Boolean(current.isDay));
        }
    }, [current]);
     
    const handleRefresh = async () => {
        const toastId = toast.loading('updating...');
        const response = await fetchWeatherData();
        response ? toast.update(toastId,{ render: 'updated', isLoading: false, autoClose: 3000,
        }) : toast.update(toastId,{ render: 'error updating', isLoading: false, autoClose: 3000,});
    };
    return (
        <>
            {current ? (
                <div
                className={`absolute inset-0 w-full h-full flex flex-col items-center gap-10 pt-20`}
            >
                <div className="fixed inset-0 z-0 w-full h-full">
                <div className={`w-full h-full ${getCodeBackground(current.code, isday)}`} />
                hello
               </div>

               {/* Weather Animations */}
                 <Animations weatherCode={current.code} isDay={isday} />

            <div className='px-4 py-5  z-5 flex flex-col items-center justify-end gap-4 mt-[15dvh] max-sm:mt-[20dvh] max-sm:px-[5%]'>
                    <h2 className=" flex flex-row items-start text-7xl justify-center">
                        {temperatureUnitChart(Number(current?.temperature))}<span className="text-2xl justify-self-start">°</span>
                    </h2>
                    <p className="text-xl font-light">{getCodeCondition(current?.code)}</p>
                <div className="flex items-center flex-wrap gap-2 justify-center">
                        <p className="pr-2 border-r border-r-amber-50">
                            Feels like <span className="opacity-80">{temperatureUnit(Number(current?.temperatureApparent))}</span>
                        </p>
                        <p style={{ color: `${uvHealth(current?.uv)}` }} className="pr-2 border-r border-r-amber-50">
                            UV Index <span className="opacity-80">{Math.round(Number(current?.uv))}</span>
                        </p>
                        <p className="pr-2 border-r border-r-amber-50" >
                            Humidity <span className="opacity-80">{Math.floor(Number(current?.humidity))}</span>
                        </p>
                        <p className=" flex gap-1 items-center pr-2 border-r border-r-amber-50">
                            {formatWindDirection(current?.windDirection)} <span>{formatWind(current?.windSpeed)}</span>
                            <span className="opacity-80">{speedUnit(Number(current?.windSpeed))}</span>
                        </p>
                        <p className="flex gap-1 items-center">
                            Visibility <span className="opacity-80">{distanceUnit(current?.visibility)}</span>
                            <span> {formatVisibility(Number(current.visibility) / 1000)}</span>
                        </p>
                </div>
            </div>
        {/*forecast container*/}
        {forecast && <div 
        className={`flex flex-col gap-5 items-start z-5
         ${isday ? 'bg-white/10': 'bg-gray-800/5'} backdrop-blur-md 
         border border-white/20 shadow-lg px-5 py-4 w-[60%] rounded-2xl pb-7 max-sm:px-2.5 max-sm:w-[93%]`}>
            <div className="flex justify-between items-center w-full pb-2 border-b-1  border-b-white/70">
                <div className="flex gap-2 items-center">
                <HelperIcon icon="forecast"/>
                <h3>Forecast next 7-days |</h3> 
                <span className="opacity-80">{formatLocalDate(String(current.time))}</span>
                </div>
                <button onClick={handleRefresh}> update</button>
                </div>
            {!isFull && <div className="flex flex-col items-start gap-7">
                <h3>AI summaries and insights</h3>
                <div className="flex flex-col items-start gap-6">
                    <div className="flex gap-5 items-center w-full max-sm:flex-col max-sm:gap-5 max-sm:justify-center max-sm:items-start">
                    <WeatherInsight weatherForecast={forecast}/>
                    </div>
                    <div className="w-full h-0.5 bg-white/30"/>
                    <div className="flex flex-col items-start gap-6">
                        <CautionAndActivities weatherForecast={forecast}/>
                    </div>
                </div>
                    
            </div>}
            <button onClick={()=>setFull(!isFull)} >{isFull ? 'exit full data': 'view full data'}</button>
            {isFull && <FullForecast forecastData={forecast}/>}
            <AstroTrack forecast={forecast}/>
        </div>}


        {isAdd && <div className="fixed left-1/2 top-1/2 -translate-1/2 flex flex-col items-center gap-2 z-30 px-3 py-6 bg-gray-800/90 backdrop-blur-md rounded-lg">
        <p>Add to your saved locations list?</p>
        <div className="w-full flex justify-between items-center">
        <button onClick={saveNewLocation}>Add</button>
        <button onClick={()=>{setAdd(false) ; setAddWeather(null)}} className="self-end">cancel</button>
        </div>
        </div>}
        </div>
            ) : (
                <div className="flex flex-col items-center absolute top-[50%] left-[50%] transform translate-[-50%]">
                    <ThemeIcon icon="waitingsmile"/>
                    weather data will show here
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

/*<div  style={{'--image-url': `url(${getCodeBackground(current?.code, isday)})`} as React.CSSProperties}
className={`flex flex-col items-center gap-10 absolute top-0 left-0 w-[100%] z-0 pt-20
    bg-[image:var(--image-url)] max-sm:pt-[15vh]`}
>*/
export default function Weather(){
    return(
        <Suspense>
            <WeatherComonent/>
        </Suspense>
    )
}
