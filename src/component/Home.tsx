"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useLocalStorageStore } from "@/stores/useLocalStorage";
import { useHomeStore } from "@/stores/useHome";
import { useWeatherConfigStore } from "@/stores/useWeather";
import { useDateConfigStore } from "@/stores/useDate";
import { useSettingsStore } from "@/stores/useSettings";
import { getgeolocation, updatecurrentlocation, fetchLocations } from "@/lib/fetchloaction";
import { ConditionIcon } from "./icons";

interface Location {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  current?: boolean;
  display_name: string;
}

export default function Home() {
  const router = useRouter();
  const { locations, saveLocation, removeLocation,  shortWeatherData, clearLocations } = useLocalStorageStore();
  const {isCurrentChecked, setIsCurrentChecked, isEditMode, setEditMode} = useHomeStore();
  const {getCodeCondition, getCodeIcon} = useWeatherConfigStore()
  const { getTimeDifference } = useDateConfigStore()
  const { getThreshold } = useSettingsStore();
  
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [searchResponse, setSearchResponse] = useState<string | null>(null);
  const [radiusT, setRadiusT] = useState<number>(4000);
  const [isInfo, setInfo] = useState<string[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
    setRadiusT(getThreshold());

 const checkLocation = async () => {
     if(locations.length >= 29) setInfo(prev=> [...prev, 'locations list is full clear locations or remove some'])
     const lastcurrent = locations.find(loc => loc.current === true);
           const geo_location: any = await getgeolocation();
           if(geo_location === 'notallowed'){
            setInfo(prev =>[...prev,'geolocation not allowed allow for weather rush or on device for current location update'])
           }
          else if(geo_location){
          if(!lastcurrent || calculateDistance(lastcurrent.lat, lastcurrent.lon, geo_location.latitude, geo_location.longitude)){
            const response = await  updatecurrentlocation(geo_location.latitude, geo_location.longitude)
            if(response){
                const location: any = saveLocation(response.data, true, false)
                router.push(`/weather?id=${location.id}&name=${encodeURIComponent(location.name)}`) 
                toast('location updated',{
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

 


  const handleSaveClick = (loc: Location) => {
    const location: any = saveLocation(loc, false, false);
    setIsSearch(false);
    if(location){
    router.push(`/weather?id=${location.id}&name=${encodeURIComponent(location.name)}`)
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
    if(!navigator.onLine){
      setSearchResponse('you are still offline')
      return;
  }
    try {
      setSearchResponse("searching....");
      const query = searchQuery
      const response = await fetchLocations(query)
      if(response){
      const data: Location[] = response;
      setSearchResults(data.length > 0 ? data : []);
      setSearchResponse(data.length > 0 ? "Select one from the list" : "No locations found");
      }
    } catch (err) {
      console.error("Error with location search:", err);
      setSearchResponse("Can't find location");
    }
  }
  
  const handleremove = (id: string)=>{
    const response: any =  removeLocation(id);
    if(response){
      toast.update('handleremove',{
        render: 'removed',
        isLoading: false,
        autoClose: 3000,
      })
    }else{
      toast.update('handleremove',{
        render: 'error',
        isLoading: false,
        autoClose: 3000,
    })
    }
  }

  const handleRefreshClick = async()=>{
     const toastId = toast.loading('updating...')
     const geolocation: any = await getgeolocation();
     if(geolocation && !(geolocation === 'notallowed')){
      const response = await updatecurrentlocation(geolocation.latitude, geolocation.longitude);
      if(response){
        const location: any = saveLocation(response.data, true, false)
        router.push(`/weather?id=${location.id}&name=${encodeURIComponent(location.name)}`) 
        toast.update(toastId,{ render: 'updated', isLoading: false, autoClose: 3000, })

      }else{
        toast.update(toastId,{ render: 'an error occurred', isLoading: false, autoClose: 3000,
      })
      }
     }else{
      toast.update(toastId,{ render: 'location error', isLoading: false, autoClose: 3000, })
     }
  }

  useEffect(()=>{
    if(isSearch && inputRef.current){
      inputRef.current.focus()
    }
  },[isSearch])
  return (
    <div className="flex px-[10%] pt-10 pb-5 flex-col gap-4 max-sm:px-1">
      <div className="flex flex-col items-start gap-5 px-5 max-sm:px-2 max-sm:items-center w-full">
      {isInfo.length > 0 && <p className="flex flex-col items-start gap-1">
        {isInfo.map((info, index)=>(
          <span key={index}>{info}</span>
        ))}
        </p>}
      {!(locations.length >= 29) ? <button className="self-start" onClick={()=>setIsSearch(true)}>Add location</button> :
      <button className="self-start" onClick={clearLocations}>clear locations</button>}
        {locations && <div className="flex flex-col items-start gap-3 w-full max-sm:items-stretch max-sm:px-1">
          {locations.map((loc: any) => (
            <div key={loc.id} className="flex flex-col gap-3  items-center justify-between w-[80%] max-sm:w-[95%] rounded-lg shadow-md shadow-gray-900 py-3 px-1">
              <Link href={{pathname: '/weather', query: {id: loc.id, name: loc.name}}} prefetch={false}
              className="flex justify-between items-center w-full px-2 cursor-pointer" >
              <h3 className="flex flex-col items-start gap-1 cursor-pointer" >
              <span className="text-lg max-sm:text-base font-medium self-start">{loc.name} {loc.current && "(Current)"}</span>
              {/*<div className="opacity-70"><SmallIcon src="/images/forward.png" alt="full data"/></div>*/}
              </h3>
              <div className="flex flex-row  items-center gap-4 max-sm:flex-col max-sm:items-start max-sm:gap-2">
                {shortWeatherData[loc.id] ? (
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex flex-row items-center gap-1.5">
                      <ConditionIcon condition={getCodeIcon(Number(shortWeatherData[loc.id].code ?? 3))} isDay={Boolean(shortWeatherData[loc.id].isday ?? 1)}/>
                      {getCodeCondition(Number(shortWeatherData[loc.id].code))}
                    </div>
                    <p className="opacity-70 font-light">{getTimeDifference(shortWeatherData[loc.id].timestamp)}</p>
                  </div>
                ) : (
                  <p>Location added</p>
                )}
                </div>
              </Link>
              {loc.current && <button onClick={handleRefreshClick} className="justify-self-end self-start">update</button>}
              {(!loc.current && isEditMode) && <button onClick={() => handleremove(String(loc.id))} className="justify-self-end self-end" >Remove</button>}
            </div>
          ))}
        </div>}
      </div>

      {isSearch && (
        <div ref={searchRef} className="absolute left-[50%] top-[7vh] transform translate-x-[-50%] bg-gray-900 w-[40%] h-[70%]
        px-3 py-3 flex flex-col items-stretch gap-4 max-md:w-[70%] max-sm:w-[98%] z-35">
            <form onSubmit={searchLocation} className=" py-1.5  flex flex-col items-center gap-3">
              <input
                type="search"
                placeholder="City..."
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                ref={inputRef}
                maxLength={50}
                required
                className="appearance-none  border-b border-b-white/30 pb-2 px-1 w-[100%] text-base max-sm:text-sm focus:outline-none focus:border-b-white/35"
              />
              {!(searchResponse === 'searching....') && <div className="flex gap-8 max-sm:gap-2.5">
              {searchResults.length < 1 && <button type="submit"> search</button>}
              <button type="button" onClick={() => {setIsSearch(false); setSearchResults([])}}>cancel</button>
              </div>}
            </form>
          <div className="flex flex-col items-start gap-3">
            <p className="self-center">{searchResponse || "Locations will appear here to choose from"}</p>
            {searchResults.length > 0 && <div className="flex flex-col items-stretch w-[100%] gap-3">
              {searchResults.map((result, index) => (
                <button key={index} onClick={() => handleSaveClick(result)} 
                className="no-global-style text-sm opacity-80 border-b border-white px-2 pb-1 flex flex-col items-start text-start cursor-pointer">
                  {result.display_name}
                </button>
              ))}
            </div>}
          </div>
        </div>
      )}
      {isEditMode && 
      <div className="fixed bottom-[10%] left-[50%] -translate-x-[50%] flex gap-3 px-4 py-4 rounded-lg bg-gray-900/40 backdrop-blur-md shadow-xl text-nowrap">
        {locations.length < 31 && <button onClick={() => setIsSearch(true)}>add location</button>}
        <button onClick={()=> setEditMode(false)}>exit edit mode</button>
       <button onClick={clearLocations}>clear all locations</button>
      </div>
      }
      {(locations.length > 11 && locations.length < 28) &&<button className="self-start" onClick={()=>setIsSearch(true)}>Add location</button>}
    </div>
  )
}

