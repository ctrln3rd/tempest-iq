"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useLocalStorageStore } from "@/stores/useLocalStorage";
import { useIsCurrentCheckedStore } from "@/stores/isCurrent";
import { useWeatherConfigStore } from "@/stores/useWeather";
import { useDateConfigStore } from "@/stores/useDate";
import { useSettingsStore } from "@/stores/useSettings";
import { useSelectedLocationStore } from "@/stores/useLocation";
import { LargeIcon } from "./Images";
interface Location {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  current?: boolean;
  display_name: string;
}
interface Coords {
  latitude: number;
  longitude: number;
}
interface SelectedLocation{
  name: string;
  lat: number;
  lon: number;
  id: number;
  country: string;
  current: boolean;
}


export default function Home() {
  const router = useRouter();
  const { locations, saveLocation, removeLocation,  shortWeatherData, clearLocations } = useLocalStorageStore();
  const {isCurrentChecked, setIsCurrentChecked} = useIsCurrentCheckedStore();
  const {getCodeCondition, getCodeIcon} = useWeatherConfigStore()
  const { getTimeDifference } = useDateConfigStore()
  const { getThreshold } = useSettingsStore();
  const {setSelectedLocation} = useSelectedLocationStore();
  
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [searchResponse, setSearchResponse] = useState<string | null>(null);
  const [radiusT, setRadiusT] = useState<number>(4000);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
    setRadiusT(getThreshold());

 const checkLocation = async () => {
     const lastcurrent = locations.find(loc => loc.current === true);
           const geo_location: any = await getgeolocation();
           if(geo_location){
           if(!lastcurrent || calculateDistance(lastcurrent.lat, lastcurrent.lon, geo_location.latitude, geo_location.longitude)){
             const response = await  updatecurrentlocation(geo_location.latitude, geo_location.longitude)
             if(response === true){
             toast.update('locationchanged',{
                render: 'location changed',
                isLoading: false,
                autoClose: 3000,
            })
             }
         }
       }
       setIsCurrentChecked(true)
   }
     if(!isCurrentChecked){
     checkLocation();
     }
 },[])

 const getgeolocation =  async ()=>{
    try{
    const position = await new Promise((resolve, reject)=>{navigator.geolocation.getCurrentPosition(
     (position) =>
       resolve(position.coords),
     (error) => reject(error)
    )}); return position
     }catch(error: any){
     console.error('Geolocation error:', error)
     if(error.code === 1) toast.info('geolocation denied allow',{
      autoClose: 30000,
      closeOnClick: true,
      draggable:true,
     });
       return null
    }

 }


const updatecurrentlocation = async (latitude: number, longitude: number)=>{
 try {
   const response = await axios.get(
     `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
   );
   const location: any = saveLocation(response.data, true)
   if(location){
      setSelectedLocation(location)
      router.push(`/weather/${encodeURIComponent(location.name)}`) 
   }
   return true

 } catch (error) {
   console.error('Error fetching current location:', error);
   return false
 }
}


  const handleSaveClick = (loc: Location) => {
    const location: any = saveLocation(loc, false);
    setIsSearch(false);
    if(location){
    setSelectedLocation(location)
    router.push(`/weather/${encodeURIComponent(location.name)}`)
    }
  };



  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): Boolean=>{
    const toRadians = (deg: number) => deg * (Math.PI / 180);
    const R = 6371000
    const lat1R = toRadians(lat1)
    const lat2R = toRadians(lat2)
    const lon1R = toRadians(lon1)
    const lon2R = toRadians(lon2);

    const dLat = lat2R -lat1R;
    const dLon = lon2R -lon1R;
    const a = Math.sin(dLat / 2) **2 + Math.cos(lat1R) * Math.cos(lat2R) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c
    return distance > radiusT
}

  const searchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSearchResponse(". . .");
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`
      );
      const data: Location[] = response.data;
      console.log(response.data)
      setSearchResults(data.length > 0 ? data : []);
      setSearchResponse(data.length > 0 ? "Select one from the list" : "No locations found");
    } catch (err) {
      console.error("Error with location search:", err);
      setSearchResponse("Can't find location");
    }
  }
  const handleLocationSelect = (location: SelectedLocation )=>{
    setSelectedLocation(location)
    router.push(`/weather/${encodeURIComponent(location.name)}`)
  }

  const handleremove = (loc: any)=>{
    const response: any =  removeLocation(loc);
    if(response){
      toast.update('handleremove',{
        render: 'success',
        isLoading: false,
        type: 'success',
        autoClose: 3000,
      })
    }else{
      toast.update('handleremove',{
        render: 'error',
        isLoading: false,
        type: 'error',
        autoClose: 3000,
    })
    }
  }
  const handleRefreshClick = async()=>{
     const toastId = toast.loading('updating...')
     const geolocation: any = await getgeolocation();
     if(geolocation){
      const response = await updatecurrentlocation(geolocation.latitude, geolocation.longitude);
      if(response){
        toast.update(toastId,{
          render: 'success',
          isLoading: false,
          type: 'success',
          autoClose: 3000,
      })
      }else{
        toast.update(toastId,{
          render: 'error',
          isLoading: false,
          type: 'error',
          autoClose: 3000,
      })
      }
     }else{
      toast.update(toastId,{
        render: 'location error',
        isLoading: false,
        type: 'error',
        autoClose: 3000,
    })
     }
  }

  useEffect(()=>{
    if(isSearch && inputRef.current){
      inputRef.current.focus()
    }
  },[isSearch])
  return (
    <div className="px-5  pt-10 flex-col max-sm:px-1">
      <div className="locations-container">
        <div className="flex flex-row justify-between pb-2 border-b border-amber-50 px-5 max-sm:px-2">
          <h2 className="text-2xl font-medium ">{locations.length} {locations.length > 1 ? "locations" : "location"}</h2>
          <div className="flex flex-row items-end justify-center gap-3">
          {locations.length < 31 && <button onClick={() => setIsSearch(true)} className="no-global-style border-r border-amber-50 pr-2 cursor-pointer">add</button>}
          <button className="no-global-style border-r border-amber-50 pr-2 hover:text-blue-600 cursor-progress" onClick={handleRefreshClick}>refresh</button>
          {locations.length > 3 && <button className="no-global-style hover:text-red-500 cursor-pointer" onClick={clearLocations}>clear</button>}
          </div>
        </div>
        <div className="flex flex-col items-start gap-3  max-sm:items-stretch">
          {locations.map((loc: any) => (
            <div key={loc.id} className="flex flex-row gap-2  items-center justify-between min-w-[40vw] rounded-lg shadow-md shadow-gray-900 py-3 px-1">
              <div className="flex flex-col items-start gap-1">
              <h4 className="text-lg font-medium self-start">{loc.name} {loc.current && "(Current)"}</h4>
              <button className="no-global-style opacity-70 hover:text-sky-600 cursor-pointer" 
              onClick={() => handleLocationSelect(loc)}> {shortWeatherData[loc.id] ? 'full data':'get weather data'}</button>
              </div>
              <div className="flex flex-row  items-center gap-4 max-sm:flex-col max-sm:items-start max-sm:gap-2">
                {shortWeatherData[loc.id] ? (
                  <div className="flex flex-col items-end">
                    <div className="flex flex-row items-center">
                      <LargeIcon src={getCodeIcon(Number(shortWeatherData[loc.id].code), false)} alt="icon" />
                      {getCodeCondition(Number(shortWeatherData[loc.id].code))}
                    </div>
                    <p className="opacity-70 font-light text-sm">{getTimeDifference(shortWeatherData[loc.id].timestamp)}</p>
                  </div>
                ) : (
                  <p>Location added</p>
                )}
               <button onClick={() => handleremove(loc)} className="text-sm justify-self-end max-sm:self-end" >Remove</button>
              </div>
             
            </div>
          ))}
        </div>
      </div>

      {isSearch && (
        <div ref={searchRef} className="absolute left-[50%] top-[7vh] transform translate-x-[-50%] bg-gray-900 w-[40%] h-[70%]
        px-3 py-3 flex flex-col items-stretch gap-4 max-md:w-[70%] max-sm:w-[98%]">
            <form onSubmit={searchLocation} className="pb-2 border-b border-white w-[100%]">
              <input
                type="search"
                placeholder="City..."
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                ref={inputRef}
                maxLength={50}
                required
                className="border-none outline-none w-[100%]"
              />
            </form>
          <div className="flex flex-col items-start gap-3">
            <p>{searchResponse || "Locations will appear here to choose from"}</p>
            <ul className="flex flex-col items-stretch  gap-3">
              {searchResults.map((result) => (
                <li key={result.id} onClick={() => handleSaveClick(result)} className="text-sm opacity-80 border-b border-white px-2">
                  {result.display_name}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => setIsSearch(false)} className=" absolute bottom-2.5 self-end justify-self-end">Cancel</button>
        </div>
      )}
    </div>
  )
}
