'use client';
import React, { useState, useEffect, Suspense } from "react";
import { WeatherInsight, CautionAndActivities } from "./insights";
import Animations from "./animations";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocalStorageStore } from "@/stores/useLocalStorage";
import { useDateConfigStore } from "@/stores/useDate";
import { useSettingsStore } from "@/stores/useSettings";
import { useWeatherConfigStore } from "@/stores/useWeather";
import { fetchWeatherData } from "@/lib/fetchweatherData";
import { fetchLocation } from "@/lib/fetchloaction";
import { toast } from "react-toastify";
import { CurrentWeatherType, ForecastType } from "@/types/weatherTypes";
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
    current: CurrentWeatherType;
    forecast: ForecastType;
}



function WeatherComonent(){
    const router = useRouter();
    const params = useSearchParams()
    const [current, setCurrent] = useState<CurrentWeatherType | null>(null);
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

        const getLocation = async() => {
            let Location = locations.find((loc) => loc.id === locationId)
            if(Location){
                setSaved(true)
                setLocation(Location)
            }else{
                setSaved(false)
                const toastId = toast.loading('getting location...');
                try {
                    if(!navigator.onLine){
                        toast("your're still offline", {
                            autoClose: 3000
                        })
                        return;
                    }
                    const locationResponse = await fetchLocation(locationId)
                    if (locationResponse) {
                        const newdata = locationResponse[0]
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
       if(locationId){
            getLocation();
       }
    },[locationId]);

    const fetchnewWeather = async ()=>{
        const response = await  fetchWeatherData(location?.lat, location?.lon)
        if(response){
         if(isSaved){
            saveWeatherData(String(location?.id), response);
            saveShortWeatherData(String(location?.id), String(response.current.code ?? 3));
            feedData(response)
        }else{
          setAddWeather(response)
          setAdd(true)
        }
        return true
       }
       return false
    }

    useEffect(()=>{
        const getWeather = async ()=>{
            const cachedWeather = weatherData[String(location?.id)];
            if (cachedWeather) {
                feedData(cachedWeather.data)
                if(checkWeatherDiffExpired(cachedWeather.timestamp, getAutoAge())) {
                    const toastId = toast.loading('Updating...');
                    const response = await fetchnewWeather();
                    response ? toast.update(toastId,{ render: 'updated', isLoading: false, autoClose: 3000,
                    }) : toast.update(toastId,{ render: 'error updating', isLoading: false, autoClose: 3000,})
                }
            } else {
                const toastId = toast.loading('fetching data')
                const response = await fetchnewWeather();
                response ? toast.update(toastId,{ render: 'updated', isLoading: false, autoClose: 3000,
                }) : toast.update(toastId, { render: 'error fetching', isLoading: false, autoClose: 3000})
                if(!response) router.push('/');  
            }
        return;
        }
        if(location){
         getWeather();
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

    

    useEffect(() => {
        if (current) {
            setIsDay(Boolean(current.isDay));
        }
    }, [current]);
     
    const handleRefresh = async () => {
        const toastId = toast.loading('updating...');
        const response = await fetchWeatherData(location?.lat, location?.lon);
        if(response){
            saveWeatherData(String(location?.id), response);
            saveShortWeatherData(String(location?.id), String(response.current.code ?? 3));
            feedData(response)
            toast.update(toastId,{ render: 'updated', isLoading: false, autoClose: 3000,})
        }else{
            toast.update(toastId,{ render: 'error updating', isLoading: false, autoClose: 3000,});
        }
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
                <div className="flex items-center gap-7 justify-center max-md:gap-5 max-sm:flex-col max-sm:gap-2.5">
                    <div className="flex items-center justify-center gap-7 max-md:gap-5 max-sm:gap-5">
                        <p className=" flex gap-1.5 items-center">
                           <HelperIcon icon="feelslike" /> <span className="opacity-85">Feels like</span>
                           {temperatureUnit(Number(current?.temperatureApparent))}
                        </p>
                        <p className=" flex gap-1.5 items-center">
                           <HelperIcon icon="wind"/> {!(current.windSpeed <3) &&<>{formatWindDirection(current?.windDirection)}</>} 
                            <span  className="opacity-80">{formatWind(current?.windSpeed)}</span>
                            {speedUnit(Number(current?.windSpeed))}
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-7 max-md:gap-5 max-sm:gap-5">
                        <p style={{ color: `${uvHealth(current?.uv)}` }} className="flex items-center gap-1.5">
                            <HelperIcon icon="uv"/> <span className="opacity-80">uv Index</span> {Math.round(Number(current?.uv))}
                        </p>
                        <p className="flex items-center gap-1.5" >
                            <HelperIcon icon="humidity"/><span className="opacity-80">Humidity</span> {Math.floor(Number(current?.humidity))}
                        </p>
                        
                        <p className="flex gap-1.5 items-center">
                           <HelperIcon icon="visibility"/> <span className="opacity-80"> {formatVisibility(Number(current.visibility) / 1000)}</span>
                           vis {distanceUnit(current?.visibility)}
                        </p>
                    </div>
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
                    <div className="flex gap-7 flex-col items-start">
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



export default function Weather(){
    return(
        <Suspense>
            <WeatherComonent/>
        </Suspense>
    )
}
